import { prisma } from "../lib/prisma.js"

export async function getAllCalificaciones() {
  return await prisma.calificacion.findMany();
}