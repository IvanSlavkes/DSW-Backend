import { prisma } from "../lib/prisma.js"

export async function getAllMatches() {
  return await prisma.match.findMany();
}