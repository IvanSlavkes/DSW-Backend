import { prisma } from "../lib/prisma.js";

// Listar todos los partidos
export async function getAllMatches() {
  return await prisma.match.findMany({
    include: { field: true, creator: true, ratings: true, notifications: true, teams: true }
  });
}

// Obtener partido por ID
export async function getMatchById(id: number) {
  return await prisma.match.findUnique({
    where: { id },
    include: { field: true, creator: true, ratings: true, notifications: true, teams: true }
  });
}

// Crear partido
export async function createMatch(data: { 
  name: string; 
  date: Date; 
  time: string; 
  fieldType: string; 
  privacy: string; 
  fieldId: number; 
  creatorId: number; 
}) {
  return await prisma.match.create({ data });
}

// Actualizar partido
export async function updateMatch(id: number, data: Partial<{ 
  name: string; 
  date: Date; 
  time: string; 
  fieldType: string; 
  privacy: string; 
  status: string; 
}>) {
  return await prisma.match.update({ where: { id }, data });
}

// Eliminar partido
export async function deleteMatch(id: number) {
  return await prisma.match.delete({ where: { id } });
}
