import { prisma } from "../lib/prisma.js";

// Obtener todos los usuarios
export async function getAllUsers() {
  return prisma.user.findMany({ include: { locality: true } });
}

// Obtener usuario por ID
export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { locality: true } });
}

// Obtener usuario por email (para login)
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, include: { locality: true } });
}

// Crear usuario
export async function createUser(data: any) {
  return prisma.user.create({ data, include: { locality: true } });
}

// Actualizar usuario
export async function updateUser(id: number, data: any) {
  return prisma.user.update({ where: { id }, data, include: { locality: true } });
}

// Eliminar usuario
export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
