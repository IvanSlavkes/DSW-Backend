import { prisma } from "../lib/prisma.js"

export async function getAllUsers() {
  return await prisma.user.findMany();
}