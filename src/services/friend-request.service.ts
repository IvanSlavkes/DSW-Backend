import { prisma } from "../lib/prisma.js"

export async function getAllFriendRequests() {
  return await prisma.friendRequest.findMany();
}