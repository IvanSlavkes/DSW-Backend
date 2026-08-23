import type { Request, Response } from "express";
import { getAllMatches } from "../services/match.service.js";

export async function listMatches(req: Request, res: Response) {
  try {
    const matches = await getAllMatches();
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener partidos" });
  }
}