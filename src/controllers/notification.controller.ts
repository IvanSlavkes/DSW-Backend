import type { Request, Response } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../services/notification.service.js';

export async function listNotifications(req: Request, res: Response) {
  const notifications = await getAllNotifications();
  res.json(notifications);
}

export async function getNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const notification = await getNotificationById(id);
  if (!notification)
    return res.status(404).json({ mensaje: 'Notificación no encontrada' });
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
    const updated = await updateNotification(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Notificación no encontrada' });
  }
}

export async function deleteNotificationHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    await deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Notificación no encontrada' });
  }
}
