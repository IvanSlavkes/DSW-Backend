import type { Request, Response } from "express";
import { 
  getAllMatches, 
  getMatchById, 
  createMatch, 
  MatchCreationError,
  updateMatch, 
  deleteMatch 
} from "../services/match.service.js";
import { createMatchSchema, updateMatchSchema } from "../schemas/match.schema.js";

// Listar partidos
export async function listMatches(req: Request, res: Response) {
  const matches = await getAllMatches();
  res.json(matches);
}

// Obtener partido por ID
export async function getMatchHandler(req: Request, res: Response) {
const id = parseInt(req.params.id as string, 10);
  const match = await getMatchById(id);
  if (!match) return res.status(404).json({ mensaje: "Partido no encontrado" });
  res.json(match);
}

// Crear partido
export async function createMatchHandler(req: Request, res: Response) {
  const result = createMatchSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const creatorId = (req as Request & { user?: { id: number } }).user?.id;
  if (!creatorId) return res.status(401).json({ error: "Authentication required" });

  try {
    const match = await createMatch({
      ...result.data,
      description: result.data.description,
      duration: result.data.duration,
      positionType: result.data.positionType,
      secondaryPositionType: result.data.secondaryPositionType,
      creatorId,
    });
    return res.status(201).json(match);
  } catch (error) {
    if (error instanceof MatchCreationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Failed to create match:", error);
    return res.status(500).json({ error: "Failed to create match" });
  }
}

// Actualizar partido
export async function updateMatchHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const result = updateMatchSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    const matchUpdated = await updateMatch(id, result.data);
    res.json(matchUpdated);
  } catch (error) {
    res.status(404).json({ mensaje: "Partido no encontrado" });
  }
}

// Eliminar partido
export async function deleteMatchHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    await deleteMatch(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ mensaje: "Partido no encontrado" });
  }
}
