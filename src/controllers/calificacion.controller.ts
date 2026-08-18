import type { Request, Response } from "express";
import { getAllCalificaciones } from "../services/calificacion.service.js";

export async function listarCalificaciones(req: Request, res: Response) {
  try {
    const calificaciones = await getAllCalificaciones();
    res.status(200).json(calificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener calificaciones" });
  }
}