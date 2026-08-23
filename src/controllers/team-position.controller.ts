import type { Request, Response } from "express";
import { getAllTeamPositions } from "../services/team-position.service.js";

export async function listTeamPositions(req: Request, res: Response) {
  try {
    const teamPositions = await getAllTeamPositions();
    res.status(200).json(teamPositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener posiciones en equipo" });
  }
}