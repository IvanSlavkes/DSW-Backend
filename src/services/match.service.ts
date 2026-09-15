import { prisma } from '../lib/prisma.js';

export async function getAllMatches() {
  return await prisma.match.findMany();
}

export async function getMatchById(id: number) {
  return await prisma.match.findUnique({ where: { id } });
}

export async function createMatch(data: {
  name: string;
  date: Date;
  time: string;
  fieldType: string;
  privacy: string;
  status: string;
  fieldId: number;
  creatorId: number;
}) {
  return await prisma.match.create({ data });
}

export async function updateMatch(
  id: number,
  data: Partial<{
    name: string;
    date: Date;
    time: string;
    fieldType: string;
    privacy: string;
    status: string;
    fieldId: number;
    creatorId: number;
  }>,
) {
  return await prisma.match.update({ where: { id }, data });
}

export async function deleteMatch(id: number) {
  return await prisma.match.delete({ where: { id } });
}
