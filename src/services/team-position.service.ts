import { prisma } from '../lib/prisma.js';
import { publicUserSelect } from '../lib/publicUser.js';

// Listar todas las posiciones
export async function getAllTeamPositions() {
  return await prisma.teamPosition.findMany({
    include: { matchTeam: true, occupant: { select: publicUserSelect } },
  });
}

// Obtener posición por ID
export async function getTeamPositionById(id: number) {
  return await prisma.teamPosition.findUnique({
    where: { id },
    include: { matchTeam: true, occupant: { select: publicUserSelect } },
  });
}

// Crear posición
export async function createTeamPosition(data: {
  positionType?: string | null;
  secondaryPositionType?: string | null;
  guestName?: string | null;
  matchTeamId: number;
  occupantId?: number;
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
    positionType?: string | null;
    secondaryPositionType?: string | null;
    guestName?: string | null;
  },
) {
  return await prisma.teamPosition.update({ where: { id }, data });
}

// Eliminar posición
export async function deleteTeamPosition(id: number) {
  return await prisma.teamPosition.delete({ where: { id } });
}
