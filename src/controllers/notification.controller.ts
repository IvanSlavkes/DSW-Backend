import type { Request, Response } from "express";
import { getAllNotifications } from "../services/notification.service.js";

export async function listNotification(req: Request, res: Response) {
  try {
    const notification = await getAllNotifications();
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener notificaciones" });
  }
}