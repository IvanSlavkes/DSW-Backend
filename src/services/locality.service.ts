import { prisma } from "../lib/prisma.js";

export async function getAllLocalities() {
  return await prisma.locality.findMany();
}

export async function getLocalityById(id: string) {
  return await prisma.locality.findUnique({ where: { id } });
}

export async function createLocality(data: { id: string; nombre: string }) {
  return await prisma.locality.create({ data });
}

export async function updateLocality(id: string, data: { nombre?: string }) {
  return await prisma.locality.update({ where: { id }, data });
}

export async function deleteLocality(id: string) {
  return await prisma.locality.delete({ where: { id } });
}
