import type { Request, Response } from 'express';
import {
  getAllFriendRequests,
  getFriendRequestById,
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
} from '../services/friend-request.service.js';
import { getAuthUserId, isAdmin } from '../lib/permissions.js';

// Listar solicitudes
export async function listFriendRequests(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });
  const requests = await getAllFriendRequests(isAdmin(req) ? undefined : userId);
  res.json(requests);
}

// Obtener solicitud por ID
export async function getFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: 'ID invÃ¡lido' });
  const request = await getFriendRequestById(id);
  if (!request)
    return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
  const userId = getAuthUserId(req);
  if (!isAdmin(req) && request.requesterId !== userId && request.receiverId !== userId)
    return res.status(403).json({ mensaje: 'No tenÃ©s permiso para ver esta solicitud' });
  res.json(request);
}

// Crear solicitud
export async function createFriendRequestHandler(req: Request, res: Response) {
  const requesterId = getAuthUserId(req);
  const receiverId = Number(req.body.receiverId);
  if (!requesterId) return res.status(401).json({ mensaje: 'No autorizado' });
  if (!Number.isInteger(receiverId) || receiverId < 1 || receiverId === requesterId)
    return res.status(400).json({ mensaje: 'Destinatario invÃ¡lido' });
  try {
    const newRequest = await createFriendRequest({
      requesterId,
      receiverId,
      status: 'pending',
    });
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear solicitud' });
  }
}

// Actualizar solicitud
export async function updateFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: 'ID invÃ¡lido' });
  const existing = await getFriendRequestById(id);
  if (!existing) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
  const userId = getAuthUserId(req);
  if (!isAdmin(req) && existing.receiverId !== userId)
    return res.status(403).json({ mensaje: 'Solo quien recibe la solicitud puede responderla' });
  const status = req.body.status;
  if (status !== 'accepted' && status !== 'rejected')
    return res.status(400).json({ mensaje: 'El estado debe ser accepted o rejected' });
  try {
    const updated = await updateFriendRequest(id, { status });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Solicitud no encontrada' });
  }
}

// Eliminar solicitud
export async function deleteFriendRequestHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: 'ID invÃ¡lido' });
  const existing = await getFriendRequestById(id);
  if (!existing) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
  const userId = getAuthUserId(req);
  if (!isAdmin(req) && existing.requesterId !== userId && existing.receiverId !== userId)
    return res.status(403).json({ mensaje: 'No tenÃ©s permiso para eliminar esta solicitud' });
  try {
    await deleteFriendRequest(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Solicitud no encontrada' });
  }
}
