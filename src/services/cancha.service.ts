import { prisma } from "../lib/prisma.js"

export async function getAllCanchas() {
  return await prisma.cancha.findMany();
}