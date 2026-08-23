import { prisma } from "../lib/prisma.js"

export async function getAllTeamPositions() {
  return await prisma.teamPosition.findMany();
}