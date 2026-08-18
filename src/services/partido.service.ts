import { prisma } from "../lib/prisma.js"

export async function getAllPartidos() {
  return await prisma.partido.findMany();
}