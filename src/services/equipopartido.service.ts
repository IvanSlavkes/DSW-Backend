import { prisma } from "../lib/prisma.js"

export async function getAllEquiposPartido() {
  return await prisma.equipoPartido.findMany();
}