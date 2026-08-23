import { prisma } from "../lib/prisma.js"

export async function getAllNotifications() {
  return await prisma.notification.findMany();
}