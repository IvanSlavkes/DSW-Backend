import type { Request, Response } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../services/notification.service.js';

type AuthRequest = Request & { user?: { id: number } };

function getAuthUserId(req: Request) {
  return Number((req as AuthRequest).user?.id);
}

const FORBIDDEN_MESSAGE = 'No tenés permiso sobre esta notificación';

export async function listNotifications(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });
  const notifications = await getAllNotifications(userId);
  res.json(notifications);
}

export async function getNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const notification = await getNotificationById(id);
  if (!notification)
    return res.status(404).json({ mensaje: 'Notificación no encontrada' });
  if (notification.userId !== getAuthUserId(req))
    return res.status(403).json({ mensaje: FORBIDDEN_MESSAGE });
  res.json(notification);
}

export async function createNotificationHandler(req: Request, res: Response) {
  const { userId, matchId, type, message } = req.body;
  try {
    const newNotification = await createNotification({
      userId,
      matchId,
      type,
      message,
    });
    res.status(201).json(newNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear notificación' });
  }
}

export async function updateNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    const existing = await getNotificationById(id);
    if (!existing)
      return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    if (existing.userId !== getAuthUserId(req))
      return res.status(403).json({ mensaje: FORBIDDEN_MESSAGE });

    const { read, message } = req.body;
    const updated = await updateNotification(id, { read, message });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar notificación' });
  }
}

export async function deleteNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    const existing = await getNotificationById(id);
    if (!existing)
      return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    if (existing.userId !== getAuthUserId(req))
      return res.status(403).json({ mensaje: FORBIDDEN_MESSAGE });

    await deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar notificación' });
  }
}
