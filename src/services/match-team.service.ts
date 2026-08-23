import { prisma } from "../lib/prisma.js"

export async function getAllMatchTeams() {
  return await prisma.matchTeam.findMany();
}