import type { Request, Response } from "express";
import { getAllUsuarios } from "../services/usuario.service.js";

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
}