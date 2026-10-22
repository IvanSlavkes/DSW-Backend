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
export class MatchCreationError extends Error {
  constructor(public readonly statusCode: 400 | 404, message: string) {
    super(message);
    this.name = "MatchCreationError";
  }
}

interface CreateMatchData {
  name: string;
  description?: string | undefined;
  date: Date;
  time: string;
  duration?: number | undefined;
  privacy: "public" | "private";
  fieldId: number;
  creatorId: number;
  teamAName: string;
  positionType?: string | undefined;
  secondaryPositionType?: string | undefined;
}

export async function createMatch(data: CreateMatchData) {
  const field = await prisma.field.findUnique({ where: { id: data.fieldId } });
  if (!field) throw new MatchCreationError(404, "Field not found");
  if (!["5", "7", "11"].includes(field.type)) {
    throw new MatchCreationError(400, "Field format must be 5, 7, or 11");
  }

  const positionsPerTeam = Number(field.type);
  const createTeam = (name: string, color: string, isCreatorTeam: boolean) => ({
    name,
    color,
    positions: {
      create: Array.from({ length: positionsPerTeam }, (_, index) => ({
        status: isCreatorTeam && index === 0 ? "occupied" : "free",
        role: isCreatorTeam && index === 0 ? "captain" : "player",
        ...(isCreatorTeam && index === 0
          ? {
              occupant: { connect: { id: data.creatorId } },
              positionType: data.positionType ?? null,
              secondaryPositionType: data.secondaryPositionType ?? null,
            }
          : {}),
      })),
    },
  });

  return prisma.match.create({
    data: {
      name: data.name,
      ...(data.description !== undefined ? { description: data.description } : {}),
      date: data.date,
      time: data.time,
      ...(data.duration !== undefined ? { duration: data.duration } : {}),
      privacy: data.privacy,
      status: "open",
      field: { connect: { id: field.id } },
      creator: { connect: { id: data.creatorId } },
      teams: {
        create: [
          createTeam(data.teamAName, "#2563eb", true),
          createTeam("Equipo B", "#dc2626", false),
        ],
      },
    },
    include: { teams: { include: { positions: true } } },
  });
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
