import { prisma } from "../lib/prisma.js"

export async function getAllPosicionesEnEquipo() {
  return await prisma.posicionEnEquipo.findMany();
}