import { prisma } from "../lib/prisma.js"

export async function getAllFields() {
  return await prisma.field.findMany();
}

export async function getFieldById(id: number) {
  return await prisma.field.findUnique({ where: { id } });
}

export async function createField(data: {
  name: string;
  address: string;
  type: string;
  locationId: string;
  locationName: string;
}) {
  return await prisma.field.create({ data });
}

//Partial <{}> lo que hace es que los campos sean opcionales, por ejemplo si solo quiero cambiar nombre
export async function updateField(id: number, data: Partial<{ 
  name: string;
  address: string;
  type: string;
  locationId: string;
  locationName: string;
}>) {
  return await prisma.field.update({where: {id}, data});
}

export async function deleteField(id: number){
  return await prisma.field.delete({where: {id}})
}