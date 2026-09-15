import type { Request, Response } from "express";
import { getAllTeamPositions, 
  getTeamPositionById,
   createTeamPosition, 
   updateTeamPosition, 
   deleteTeamPosition 
  } from "../services/team-position.service.js";

export async function listTeamPositions(req: Request, res: Response) {
  const positions = await getAllTeamPositions();
  res.json(positions);
}

export async function getTeamPositionHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const position = await getTeamPositionById(id);
  if (!position) return res.status(404).json({ mensaje: "Posición no encontrada" });
  res.json(position);
}

export async function createTeamPositionHandler(req: Request, res: Response) {
  const { positionType, matchTeamId, occupantId, requesterId } = req.body;
  try {
    const newPosition = await createTeamPosition({ positionType, matchTeamId, occupantId, requesterId });
    res.status(201).json(newPosition);
  } catch {
    res.status(500).json({ mensaje: "Error al crear posición" });
  }
}

export async function updateTeamPositionHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    const updated = await updateTeamPosition(id, req.body);
    res.json(updated);
  } catch {
    res.status(404).json({ mensaje: "Posición no encontrada" });
  }
}

export async function deleteTeamPositionHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    await deleteTeamPosition(id);
    res.status(204).send();
  } catch {
    res.status(404).json({ mensaje: "Posición no encontrada" });
  }
}
