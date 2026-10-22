import { prisma } from "../lib/prisma.js";

// Listar todos los partidos
export async function getAllMatches() {
  return await prisma.match.findMany({
    include: {
      field: true,
      creator: true,
      ratings: true,
      notifications: true,
      teams: { include: { positions: true } },
    }
  });
}

export async function getMatchesForUser(userId: number) {
  return await prisma.match.findMany({
    where: {
      OR: [
        { creatorId: userId },
        {
          teams: {
            some: {
              positions: {
                some: { OR: [{ occupantId: userId }, { requesterId: userId }] },
              },
            },
          },
        },
      ],
    },
    include: {
      field: true,
      teams: { include: { positions: true } },
    },
    orderBy: { date: "asc" },
  });
}

// Obtener partido por ID
export async function getMatchById(id: number) {
  return await prisma.match.findUnique({
    where: { id },
    include: {
      field: true,
      creator: true,
      ratings: true,
      notifications: true,
      teams: { include: { positions: true } },
    }
  });
}

// Crear partido
export async function createMatch(data: { 
  name: string; 
  description?: string;
  date: Date; 
  time: string; 
  duration?: number;
  privacy: string; 
  fieldId: number; 
  creatorId: number; 
}) {
  return await prisma.match.create({ data });
}

// Actualizar partido
export async function updateMatch(id: number, data: Partial<{ 
  name: string; 
  description: string | null;
  date: Date; 
  time: string; 
  duration: number;
  privacy: string; 
  status: string; 
}>) {
  return await prisma.match.update({ where: { id }, data });
}

// Eliminar partido
export async function deleteMatch(id: number) {
  return await prisma.match.delete({ where: { id } });
}
