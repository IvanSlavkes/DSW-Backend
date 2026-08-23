import type { Request, Response } from "express";
import { getAllRatings } from "../services/rating.service.js";

export async function listRatings(req: Request, res: Response) {
  try {
    const ratings = await getAllRatings();
    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener calificaciones" });
  }
}