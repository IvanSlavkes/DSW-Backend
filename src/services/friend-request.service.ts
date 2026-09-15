import { prisma } from "../lib/prisma.js";

// Listar todas las solicitudes
export async function getAllFriendRequests() {
  return await prisma.friendRequest.findMany({
    include: { requester: true, receiver: true }
  });
}

// Obtener solicitud por ID
export async function getFriendRequestById(id: number) {
  return await prisma.friendRequest.findUnique({
    where: { id },
    include: { requester: true, receiver: true }
  });
}

// Crear solicitud
export async function createFriendRequest(data: { requesterId: number; receiverId: number; status: string }) {
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
