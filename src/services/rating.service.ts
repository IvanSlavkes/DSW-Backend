import { prisma } from "../lib/prisma.js";

// Listar todas las calificaciones
export async function getAllRatings() {
  return await prisma.rating.findMany({
    include: { match: true, rater: true, rated: true } // opcional: trae relaciones
  });
}

// Obtener una calificación por ID
export async function getRatingById(id: number) {
  return await prisma.rating.findUnique({
    where: { id },
    include: { match: true, rater: true, rated: true }
  });
}

// Crear una calificación
export async function createRating(data: { matchId: number; raterId: number; ratedId: number; stars: number; comment: string }) {
  return await prisma.rating.create({ data });
}

// Actualizar una calificación
export async function updateRating(id: number, data: { stars?: number; comment?: string }) {
  return await prisma.rating.update({ where: { id }, data });
}

// Eliminar una calificación
export async function deleteRating(id: number) {
  return await prisma.rating.delete({ where: { id } });
}
