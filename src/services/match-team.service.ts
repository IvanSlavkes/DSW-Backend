import { prisma } from "../lib/prisma.js";

// Listar todos los equipos de un partido
export async function getAllMatchTeams() {
  return await prisma.matchTeam.findMany({
    include: { match: true, positions: true }
  });
}

// Obtener equipo por ID
export async function getMatchTeamById(id: number) {
  return await prisma.matchTeam.findUnique({
    where: { id },
    include: { match: true, positions: true }
  });
}

// Crear equipo
export async function createMatchTeam(data: { name: string; color: string; matchId: number }) {
  return await prisma.matchTeam.create({ data });
}

// Actualizar equipo
export async function updateMatchTeam(id: number, data: { name?: string; color?: string }) {
  return await prisma.matchTeam.update({ where: { id }, data });
}

// Eliminar equipo
export async function deleteMatchTeam(id: number) {
  return await prisma.matchTeam.delete({ where: { id } });
}
