import type { Request, Response } from "express";
import { getAllSolicitudesAmistad } from "../services/solamistad.service.js";

export async function listarSolicitudesAmistad(req: Request, res: Response) {
  try {
    const solicitudesAmistad = await getAllSolicitudesAmistad();
    res.status(200).json(solicitudesAmistad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las solicitudes de amistad" });
  }
}