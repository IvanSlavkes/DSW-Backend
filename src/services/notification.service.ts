import { prisma } from '../lib/prisma.js';
import { sendNotificationEmail } from '../lib/mailer.js';

// Listar todas las notificaciones
export async function getAllNotifications() {
  return await prisma.notification.findMany({
    include: { user: true, match: true },
  });
}

// Obtener notificación por ID
export async function getNotificationById(id: number) {
  return await prisma.notification.findUnique({
    where: { id },
    include: { user: true, match: true },
  });
}

// Crear notificación + enviar correo
export async function createNotification(data: {
  userId: number;
  matchId?: number;
  type: string;
  message: string;
}) {
  const notification = await prisma.notification.create({ data });

  const user = await prisma.user.findUnique({ where: { id: data.userId } });

  if (user?.email) {
    try {
      await sendNotificationEmail(
        user.email,
        `Nueva notificación (${data.type})`,
        data.message,
      );
    } catch (emailError) {
      console.error('No se pudo enviar el email de notificación:', emailError);
    }
  }

  return notification;
}

// Actualizar notificación (ej: marcar como leída)
export async function updateNotification(
  id: number,
  data: { read?: boolean; message?: string },
) {
  return await prisma.notification.update({ where: { id }, data });
}

// Eliminar notificación
export async function deleteNotification(id: number) {
  return await prisma.notification.delete({ where: { id } });
}
