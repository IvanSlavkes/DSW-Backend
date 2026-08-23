import { prisma } from "../lib/prisma.js"

export async function getAllRatings() {
  return await prisma.rating.findMany();
}