import type { Request, Response } from "express";
import { z } from "zod";
import {
  getMyMatchParticipation,
  joinMatch,
  listMatchPositionRequests,
  ParticipationError,
  respondToPositionRequest,
} from "../services/position-request.service.js";

const positionChoiceSchema = z.object({
  teamId: z.number().int().positive(),
  positionType: z.enum(["arquero", "defensor", "centrocampista", "delantero"]).nullable(),
  secondaryPositionType: z.enum(["arquero", "defensor", "centrocampista", "delantero"]).nullable(),
}).refine((choice) => !choice.positionType || choice.positionType !== choice.secondaryPositionType, {
  message: "Las posiciones deben ser distintas.",
  path: ["secondaryPositionType"],
});

const responseSchema = z.object({ decision: z.enum(["accepted", "rejected"]) });

function ids(req: Request) {
  return {
    userId: Number((req as Request & { user?: { id: number } }).user?.id),
    matchId: Number(req.params.id),
  };
}

function sendError(res: Response, error: unknown) {
  if (error instanceof ParticipationError) return res.status(error.statusCode).json({ mensaje: error.message });
  console.error("Error en la inscripción al partido:", error);
  return res.status(500).json({ mensaje: "No se pudo procesar la solicitud." });
}

export async function joinMatchHandler(req: Request, res: Response) {
  const { userId, matchId } = ids(req);
  if (!userId) return res.status(401).json({ mensaje: "No autorizado." });
  const parsed = positionChoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ mensaje: "Revisá el equipo y las posiciones seleccionadas." });
  try {
    const result = await joinMatch(matchId, userId, parsed.data.teamId, {
      positionType: parsed.data.positionType,
      secondaryPositionType: parsed.data.secondaryPositionType,
    });
    return res.status(result.kind === "pending" ? 202 : 200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getMyMatchParticipationHandler(req: Request, res: Response) {
  const { userId, matchId } = ids(req);
  if (!userId) return res.status(401).json({ mensaje: "No autorizado." });
  try {
    return res.json(await getMyMatchParticipation(matchId, userId));
  } catch (error) {
    return sendError(res, error);
  }
}

export async function listMatchPositionRequestsHandler(req: Request, res: Response) {
  const { userId, matchId } = ids(req);
  if (!userId) return res.status(401).json({ mensaje: "No autorizado." });
  try {
    return res.json(await listMatchPositionRequests(matchId, userId));
  } catch (error) {
    return sendError(res, error);
  }
}

export async function respondToPositionRequestHandler(req: Request, res: Response) {
  const { userId, matchId } = ids(req);
  const requestId = Number(req.params.requestId);
  if (!userId) return res.status(401).json({ mensaje: "No autorizado." });
  const parsed = responseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ mensaje: "La respuesta debe ser accepted o rejected." });
  try {
    return res.json(await respondToPositionRequest(matchId, requestId, userId, parsed.data.decision));
  } catch (error) {
    return sendError(res, error);
  }
}
