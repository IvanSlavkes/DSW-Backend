import type { Request, Response } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../services/notification.service.js';
import { getAuthUserId, isAdmin, isOwnerOrAdmin } from '../lib/permissions.js';

const FORBIDDEN_MESSAGE = 'No tenés permiso sobre esta notificación';

export async function listNotifications(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });

  // El admin puede pedir las de todos con ?all=true
  const wantsAll = isAdmin(req) && req.query.all === 'true';
  const notifications = await getAllNotifications(
    wantsAll ? undefined : userId,
  );
  res.json(notifications);
}

export async function getNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const notification = await getNotificationById(id);
  if (!notification)
    return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    if (!isOwnerOrAdmin(req, notification.userId))
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
          if (!isOwnerOrAdmin(req, existing.userId))
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
        if (!isOwnerOrAdmin(req, existing.userId))
          return res.status(403).json({ mensaje: FORBIDDEN_MESSAGE });

    await deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar notificación' });
  }
}
