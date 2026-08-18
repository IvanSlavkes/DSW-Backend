import { prisma } from "../lib/prisma.js"

export async function getAllUsuarios() {
  return await prisma.usuario.findMany();
}