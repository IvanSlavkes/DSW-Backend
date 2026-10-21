import { prisma } from '../lib/prisma.js';

export async function getAllFields() {
  return await prisma.field.findMany({ include: {locality: true}});
}

export async function getFieldById(id: number) {
  return await prisma.field.findUnique({ where: { id }, include: {locality: true} });
}

export async function createField(data: {
  name: string;
  address: string;
  type: string;
  price?: number;
  localityId: string;
}) {
  return await prisma.field.create({ data });
}

export async function updateField(
  id: number,
  data: Partial<{
    name: string;
    address: string;
    type: string;
    price: number;
    localityId: string;
  }>,
) {
  return await prisma.field.update({ where: { id }, data });
}

export async function deleteField(id: number) {
  return await prisma.field.delete({ where: { id } });
}
