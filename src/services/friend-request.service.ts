import { prisma } from "../lib/prisma.js";
import { publicUserSelect } from '../lib/publicUser.js';

// Listar todas las solicitudes
export async function getAllFriendRequests(userId?: number) {
  return await prisma.friendRequest.findMany({
    ...(userId !== undefined ? { where: { OR: [{ requesterId: userId }, { receiverId: userId }] } } : {}),
    include: {
      requester: { select: publicUserSelect },
      receiver: { select: publicUserSelect },
    },
  });
}

// Obtener solicitud por ID
export async function getFriendRequestById(id: number) {
  return await prisma.friendRequest.findUnique({
    where: { id },
    include: {
      requester: { select: publicUserSelect },
      receiver: { select: publicUserSelect },
    },
  });
}

// Crear solicitud
export async function createFriendRequest(data: { requesterId: number; receiverId: number; status: "pending" }) {
  return await prisma.friendRequest.create({ data });
}

// Actualizar solicitud (ej: cambiar estado)
export async function updateFriendRequest(id: number, data: { status?: string }) {
  return await prisma.friendRequest.update({ where: { id }, data });
}

// Eliminar solicitud
export async function deleteFriendRequest(id: number) {
  return await prisma.friendRequest.delete({ where: { id } });
}
