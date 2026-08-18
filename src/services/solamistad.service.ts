import { prisma } from "../lib/prisma.js"

export async function getAllSolicitudesAmistad() {
  return await prisma.solAmistad.findMany();
}