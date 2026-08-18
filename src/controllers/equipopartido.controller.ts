import type { Request, Response } from "express";
import { getAllEquiposPartido } from "../services/equipopartido.service.js";

export async function listarEquiposPartido(req: Request, res: Response) {
  try {
    const equiposPartido = await getAllEquiposPartido();
    res.status(200).json(equiposPartido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener equipos partido" });
  }
}