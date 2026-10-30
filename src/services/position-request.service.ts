import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export class ParticipationError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "ParticipationError";
  }
}

type PositionChoice = { positionType: string | null; secondaryPositionType: string | null };

async function refreshMatchStatus(tx: Prisma.TransactionClient, matchId: number) {
  const [total, free] = await Promise.all([
    tx.teamPosition.count({ where: { matchTeam: { matchId } } }),
    tx.teamPosition.count({ where: { matchTeam: { matchId }, status: "free", occupantId: null } }),
  ]);
  await tx.match.update({ where: { id: matchId }, data: { status: total > 0 && free === 0 ? "full" : "open" } });
}

async function ensureNotAlreadyInMatch(tx: Prisma.TransactionClient, matchId: number, userId: number) {
  const occupied = await tx.teamPosition.findFirst({ where: { matchTeam: { matchId }, occupantId: userId }, select: { id: true } });
  if (occupied) throw new ParticipationError(409, "Ya formás parte de este partido.");
}

export async function joinMatch(matchId: number, userId: number, teamId: number, choice: PositionChoice) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "Match" WHERE id = ${matchId} FOR UPDATE`;
    const match = await tx.match.findUnique({ where: { id: matchId }, include: { teams: { select: { id: true } } } });
    if (!match) throw new ParticipationError(404, "Partido no encontrado.");
    if (match.startsAt <= new Date()) throw new ParticipationError(409, "Este partido ya comenzó o finalizó.");
    if (!match.teams.some((team) => team.id === teamId)) throw new ParticipationError(400, "El equipo no pertenece a este partido.");
    await ensureNotAlreadyInMatch(tx, matchId, userId);

    const otherRequest = await tx.positionRequest.findFirst({ where: { userId, matchTeam: { matchId }, status: "pending" } });
    if (otherRequest && otherRequest.matchTeamId !== teamId) throw new ParticipationError(409, "Ya tenés una solicitud pendiente para el otro equipo.");

    const freeCount = await tx.teamPosition.count({ where: { matchTeamId: teamId, status: "free", occupantId: null } });
    if (freeCount === 0) throw new ParticipationError(409, "Ese equipo no tiene cupos libres.");

    if (match.privacy === "private") {
      const existing = await tx.positionRequest.findUnique({ where: { matchTeamId_userId: { matchTeamId: teamId, userId } } });
      if (existing?.status === "pending") throw new ParticipationError(409, "Ya tenés una solicitud pendiente para este equipo.");
      if (existing?.status === "accepted") throw new ParticipationError(409, "Ya formás parte de este partido.");
      const request = existing
        ? await tx.positionRequest.update({ where: { id: existing.id }, data: { ...choice, status: "pending", date: new Date() } })
        : await tx.positionRequest.create({ data: { matchTeamId: teamId, userId, ...choice } });
      return { kind: "pending" as const, request };
    }

    const slot = await tx.teamPosition.findFirst({ where: { matchTeamId: teamId, status: "free", occupantId: null }, orderBy: { id: "asc" } });
    if (!slot) throw new ParticipationError(409, "Ese equipo ya no tiene lugares libres.");
    const claimed = await tx.teamPosition.updateMany({
      where: { id: slot.id, status: "free", occupantId: null },
      data: { status: "occupied", occupantId: userId, ...choice },
    });
    if (claimed.count === 0) throw new ParticipationError(409, "Ese lugar acaba de ser ocupado. Actualizá el partido e intentá de nuevo.");
    await refreshMatchStatus(tx, matchId);
    return { kind: "joined" as const, positionId: slot.id };
  });
}

export async function getMyMatchParticipation(matchId: number, userId: number) {
  const [match, position, request] = await Promise.all([
    prisma.match.findUnique({ where: { id: matchId }, select: { creatorId: true } }),
    prisma.teamPosition.findFirst({ where: { matchTeam: { matchId }, occupantId: userId }, include: { matchTeam: { select: { id: true, name: true } } } }),
    prisma.positionRequest.findFirst({ where: { matchTeam: { matchId }, userId }, include: { matchTeam: { select: { id: true, name: true } } }, orderBy: { date: "desc" } }),
  ]);
  if (!match) throw new ParticipationError(404, "Partido no encontrado.");
  return { isCreator: match.creatorId === userId, position, request };
}

export async function listMatchPositionRequests(matchId: number, userId: number) {
  const match = await prisma.match.findUnique({ where: { id: matchId }, select: { creatorId: true } });
  if (!match) throw new ParticipationError(404, "Partido no encontrado.");
  if (match.creatorId !== userId) throw new ParticipationError(403, "Solo el creador puede revisar las solicitudes.");
  return prisma.positionRequest.findMany({
    where: { matchTeam: { matchId }, status: "pending" },
    include: { user: { select: { id: true, name: true, lastName: true } }, matchTeam: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });
}

export async function respondToPositionRequest(matchId: number, requestId: number, userId: number, decision: "accepted" | "rejected") {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "Match" WHERE id = ${matchId} FOR UPDATE`;
    const match = await tx.match.findUnique({ where: { id: matchId }, select: { creatorId: true, startsAt: true } });
    if (!match) throw new ParticipationError(404, "Partido no encontrado.");
    if (match.creatorId !== userId) throw new ParticipationError(403, "Solo el creador puede responder las solicitudes.");
    const request = await tx.positionRequest.findFirst({ where: { id: requestId, matchTeam: { matchId } } });
    if (!request) throw new ParticipationError(404, "Solicitud no encontrada.");
    if (request.status !== "pending") throw new ParticipationError(409, "Esta solicitud ya fue respondida.");

    if (decision === "rejected") {
      return tx.positionRequest.update({ where: { id: requestId }, data: { status: "rejected" } });
    }
    if (match.startsAt <= new Date()) throw new ParticipationError(409, "Este partido ya comenzó o finalizó.");
    await ensureNotAlreadyInMatch(tx, matchId, request.userId);
    const slot = await tx.teamPosition.findFirst({ where: { matchTeamId: request.matchTeamId, status: "free", occupantId: null }, orderBy: { id: "asc" } });
    if (!slot) throw new ParticipationError(409, "Ese equipo ya no tiene lugares libres.");
    const claimed = await tx.teamPosition.updateMany({ where: { id: slot.id, status: "free", occupantId: null }, data: { status: "occupied", occupantId: request.userId, positionType: request.positionType, secondaryPositionType: request.secondaryPositionType } });
    if (claimed.count === 0) throw new ParticipationError(409, "Ese lugar acaba de ser ocupado. Actualizá las solicitudes.");
    const accepted = await tx.positionRequest.update({ where: { id: requestId }, data: { status: "accepted" } });
    await tx.positionRequest.updateMany({ where: { userId: request.userId, matchTeam: { matchId }, status: "pending", id: { not: requestId } }, data: { status: "rejected" } });
    await refreshMatchStatus(tx, matchId);
    return accepted;
  });
}
