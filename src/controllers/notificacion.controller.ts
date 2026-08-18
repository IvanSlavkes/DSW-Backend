import type { Request, Response } from "express";
import { getAllNotificaciones } from "../services/notificacion.service.js";

export async function listarNotificaciones(req: Request, res: Response) {
  try {
    const notificaciones = await getAllNotificaciones();
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener notificaciones" });
  }
}