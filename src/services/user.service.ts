import { prisma } from "../lib/prisma.js";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id:number) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function createUser(data:any) {
  return await prisma.user.create({ data });
}

export async function updateUser(id:number, data:any) {
  return await prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id:number) {
  return await prisma.user.delete({ where: { id } });
}
