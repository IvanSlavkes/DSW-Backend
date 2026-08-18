import { prisma } from "../lib/prisma.js"

export async function getAllNotificaciones() {
  return await prisma.notificacion.findMany();
}