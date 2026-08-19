import { prisma } from "../lib/prisma.js"

export async function getAllCanchas() {
  return await prisma.cancha.findMany();
}

export async function getCancha(id: number) {
  return await prisma.cancha.findUnique({ where: { id } });
}

export async function createCancha(data: {
  nombre: string;
  direccion: string;
  tipo: string;
  localidadId: string;
  localidadNombre: string;
}) {
  return await prisma.cancha.create({ data });
}

//Partial <{}> lo que hace es que los campos sean opcionales, por ejemplo si solo quiero cambiar nombre
export async function updateCancha(id: number, data: Partial<{ 
  nombre: string;
  direccion: string;
  tipo: string;
  localidadId: string;
  localidadNombre: string;
}>) {
  return await prisma.cancha.update({where: {id}, data});
}

export async function deleteCancha(id: number){
  return await prisma.cancha.delete({where: {id}})
}