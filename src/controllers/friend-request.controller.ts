import type { Request, Response } from "express";
import { 
  getAllFriendRequests,
  getFriendRequestById,
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest
} from "../services/friend-request.service.js";

// Listar solicitudes
export async function listFriendRequests(req: Request, res: Response) {
  const requests = await getAllFriendRequests();
  res.json(requests);
}

// Obtener solicitud por ID
export async function getFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const request = await getFriendRequestById(id);
  if (!request) return res.status(404).json({ mensaje: "Solicitud no encontrada" });
  res.json(request);
}

// Crear solicitud
export async function createFriendRequestHandler(req: Request, res: Response) {
  const { requesterId, receiverId, status } = req.body;
  try {
    const newRequest = await createFriendRequest({ requesterId, receiverId, status });
    res.status(201).json(newRequest);
  } catch {
    res.status(500).json({ mensaje: "Error al crear solicitud" });
  }
}

// Actualizar solicitud
export async function updateFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    const updated = await updateFriendRequest(id, req.body);
    res.json(updated);
  } catch {
    res.status(404).json({ mensaje: "Solicitud no encontrada" });
  }
}

// Eliminar solicitud
export async function deleteFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    await deleteFriendRequest(id);
    res.status(204).send();
  } catch {
    res.status(404).json({ mensaje: "Solicitud no encontrada" });
  }
}
