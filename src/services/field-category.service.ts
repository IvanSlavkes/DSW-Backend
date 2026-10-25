import { prisma } from "../lib/prisma.js";

export async function getAllFieldCategories() {
  return prisma.fieldCategory.findMany({ orderBy: { name: "asc" } });
}

export async function getFieldCategoryById(id: number) {
  return prisma.fieldCategory.findUnique({ where: { id } });
}

export async function createFieldCategory(data: {
  name: string;
  surfaceType: string;
  playersPerTeam: number;
}) {
  return prisma.fieldCategory.create({ data });
}

export async function updateFieldCategory(
  id: number,
  data: Partial<{ name: string; surfaceType: string; playersPerTeam: number }>,
) {
  return prisma.fieldCategory.update({ where: { id }, data });
}

export async function deleteFieldCategory(id: number) {
  return prisma.fieldCategory.delete({ where: { id } });
}
