import type { Request, Response } from "express";
import { 
  getAllMatches, 
  getMatchById, 
  createMatch, 
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
    return res.status(400).json({ errores: result.error.issues });
  }

  const { name, description, date, time, duration, privacy, fieldId, creatorId } = result.data;
  try {
    const nuevoMatch = await createMatch({ 
      name, 
      description,
      date, 
      time, 
      duration,
      privacy, 
      fieldId, 
      creatorId 
    });
    res.status(201).json(nuevoMatch);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear partido" });
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
