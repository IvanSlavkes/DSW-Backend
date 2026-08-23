import type { Request, Response } from "express";
import { getAllMatchTeams } from "../services/match-team.service.js";

export async function listMatchTeams(req: Request, res: Response) {
  try {
    const matchTeams = await getAllMatchTeams();
    res.status(200).json(matchTeams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener equipos partido" });
  }
}