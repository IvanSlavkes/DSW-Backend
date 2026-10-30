import { prisma } from '../lib/prisma.js';

export async function getAllLocalities() {
  return await prisma.locality.findMany({ orderBy: { name: 'asc' } });
}

export async function getLocalityById(id: string) {
  return await prisma.locality.findUnique({ where: { id } });
}

export async function createLocality(data: { id: string; name: string }) {
  return await prisma.locality.create({ data });
}

export async function updateLocality(id: string, data: { name?: string }) {
  return await prisma.locality.update({ where: { id }, data });
}

export async function deleteLocality(id: string) {
  return await prisma.locality.delete({ where: { id } });
}

export async function countFieldsByLocality(id: string) {
  return await prisma.field.count({ where: { localityId: id } });
}