import type { Request, Response } from "express";
import { getAllPartidos } from "../services/partido.service.js";

export async function listarPartidos(req: Request, res: Response) {
  try {
    const partidos = await getAllPartidos();
    res.status(200).json(partidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener partidos" });
  }
}