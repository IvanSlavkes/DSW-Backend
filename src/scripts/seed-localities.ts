import { prisma } from "../lib/prisma.js";

const GEOREF_URL = "https://apis.datos.gob.ar/georef/api/v2.0/localidades";
const PROVINCE = "santa fe";
const DEPARTMENT = "rosario";
const PAGE_SIZE = 1000;

interface GeorefLocality {
  id: string;
  nombre: string;
  departamento?: { nombre: string } | null;
}

interface GeorefResponse {
  localidades: GeorefLocality[];
}

async function fetchPage(start: number): Promise<GeorefLocality[]> {
  const params = new URLSearchParams({
    provincia: PROVINCE,
    departamento: DEPARTMENT,
    campos: "id,nombre,departamento.nombre",
    max: String(PAGE_SIZE),
    inicio: String(start),
  });
  const res = await fetch(`${GEOREF_URL}?${params}`);
  if (!res.ok) throw new Error(`Georef respondió ${res.status}`);
  const data = (await res.json()) as GeorefResponse;
  return data.localidades;
}

async function main() {
  const byId = new Map<string, GeorefLocality>();
  let start = 0;

  while (true) {
    const page = await fetchPage(start);
    const sizeBefore = byId.size;
    for (const loc of page) byId.set(loc.id, loc);
    if (page.length < PAGE_SIZE || byId.size === sizeBefore) break;
    start += PAGE_SIZE;
  }

  const rosario = [...byId.values()].filter(
    (l) => l.departamento?.nombre.toLowerCase() === DEPARTMENT
  );

  const result = await prisma.locality.createMany({
    data: rosario.map((l) => ({ id: l.id, name: l.nombre })),
    skipDuplicates: true,
  });

  console.log(
    `Georef devolvió ${byId.size}, del departamento Rosario: ${rosario.length}, insertadas: ${result.count}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
