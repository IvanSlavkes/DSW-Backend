import { prisma } from '../lib/prisma.js';

// Saca la contraseña antes de devolver un usuario al cliente
function withoutPassword<T extends { password: string }>(user: T) {
  const { password: _password, ...rest } = user;
  return rest;
}

// Obtener todos los usuarios
export async function getAllUsers() {
  const users = await prisma.user.findMany({ include: { locality: true } });
  return users.map(withoutPassword);
}

// Obtener usuario por ID
export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { locality: true },
  });
  return user ? withoutPassword(user) : null;
}

// Obtener usuario por email (para login): ESTE SÍ trae la contraseña, no devolverlo al cliente
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { locality: true },
  });
}

// Crear usuario
export async function createUser(data: any) {
  const user = await prisma.user.create({ data, include: { locality: true } });
  return withoutPassword(user);
}

// Actualizar usuario
export async function updateUser(id: number, data: any) {
  const user = await prisma.user.update({
    where: { id },
    data,
    include: { locality: true },
  });
  return withoutPassword(user);
}

// Eliminar usuario
export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
