import type { Request, Response } from "express";
import { getAllUsers } from "../services/user.service.js";

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
}