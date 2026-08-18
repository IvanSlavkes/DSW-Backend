import type { Request, Response } from "express";
import { getAllPosicionesEnEquipo } from "../services/posicionenequipo.service.js";

export async function listarPosicionesEnEquipo(req: Request, res: Response) {
  try {
    const posicionesEnEquipo = await getAllPosicionesEnEquipo();
    res.status(200).json(posicionesEnEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener posiciones en equipo" });
  }
}