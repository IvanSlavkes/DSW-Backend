import type { Request, Response } from "express";
import { getAllCanchas } from "../services/cancha.service.js";

export async function listarCanchas(req: Request, res: Response) {
  try {
    const canchas = await getAllCanchas();
    res.status(200).json(canchas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener canchas" });
  }
}