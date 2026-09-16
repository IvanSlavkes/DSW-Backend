import { prisma } from '../lib/prisma.js';

// Listar todas las posiciones
export async function getAllTeamPositions() {
  return await prisma.teamPosition.findMany({
    include: { matchTeam: true, occupant: true, requester: true },
  });
}

// Obtener posición por ID
export async function getTeamPositionById(id: number) {
  return await prisma.teamPosition.findUnique({
    where: { id },
    include: { matchTeam: true, occupant: true, requester: true },
  });
}

// Crear posición
export async function createTeamPosition(data: {
  positionType: string;
  matchTeamId: number;
  occupantId?: number;
  requesterId?: number;
  role?: string;
}) {
  return await prisma.teamPosition.create({ data });
}

// Actualizar posición
export async function updateTeamPosition(
  id: number,
  data: {
    status?: string;
    role?: string;
    occupantId?: number;
    requesterId?: number;
  },
) {
  return await prisma.teamPosition.update({ where: { id }, data });
}

// Eliminar posición
export async function deleteTeamPosition(id: number) {
  return await prisma.teamPosition.delete({ where: { id } });
}
