import type { Request, Response } from "express";
import { 
  getAllMatches, 
  getMatchById, 
  createMatch, 
  updateMatch, 
  deleteMatch 
} from "../services/match.service.js";

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
  const { name, date, time, fieldType, privacy, fieldId, creatorId } = req.body;
  try {
    const nuevoMatch = await createMatch({ 
      name, 
      date: new Date(date), 
      time, 
      fieldType, 
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
  try {
    const matchUpdated = await updateMatch(id, req.body);
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
