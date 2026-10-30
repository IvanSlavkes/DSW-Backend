import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from '../lib/publicUser.js';

// Listar todas las calificaciones
export async function getAllRatings() {
  return await prisma.rating.findMany({
        include: {
          match: true,
          rater: { select: publicUserSelect },
          rated: { select: publicUserSelect } } // opcional: trae relaciones
  });
}

// Obtener una calificaciÃ³n por ID
export async function getRatingById(id: number) {
  return await prisma.rating.findUnique({
    where: { id },
    include: {
      match: true,
      rater: { select: publicUserSelect },
      rated: { select: publicUserSelect },
    },
  });
}

// Crear una calificaciÃ³n
export async function createRating(data: { matchId: number; raterId: number; ratedId: number; stars: number; comment: string }) {
  if (data.raterId === data.ratedId) {
    throw new RatingError(400, "No podes calificarte a vos mismo");
  }
  const match = await prisma.match.findUnique({
    where: { id: data.matchId },
    select: {
      creatorId: true,
      teams: {
        select: {
          positions: {
            where: { occupantId: { in: [data.raterId, data.ratedId] } },
            select: { occupantId: true },
          },
        },
      },
    },
  });
  if (!match) throw new RatingError(404, "Partido no encontrado");
  const participants = new Set<number>([
    match.creatorId,
    ...match.teams.flatMap((team) => team.positions.flatMap((position) => position.occupantId == null ? [] : [position.occupantId])),
  ]);
  if (!participants.has(data.raterId) || !participants.has(data.ratedId)) {
    throw new RatingError(403, "Solo podes calificar a jugadores del mismo partido");
  }
  return await prisma.rating.create({ data });
}

export class RatingError extends Error {
  constructor(public readonly statusCode: 400 | 403 | 404, message: string) {
    super(message);
    this.name = "RatingError";
  }
}

// Actualizar una calificaciÃ³n
export async function updateRating(id: number, data: { stars?: number; comment?: string }) {
  return await prisma.rating.update({ where: { id }, data });
}

// Eliminar una calificaciÃ³n
export async function deleteRating(id: number) {
  return await prisma.rating.delete({ where: { id } });
}
