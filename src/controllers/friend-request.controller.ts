import type { Request, Response } from "express";
import { getAllFriendRequests } from "../services/friend-request.service.js";

export async function listFriendRequests(req: Request, res: Response) {
  try {
    const friendRequests = await getAllFriendRequests();
    res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las solicitudes de amistad" });
  }
}