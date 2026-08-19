import type { Request, Response } from "express";
import { createCancha, getAllCanchas, getCancha, updateCancha, deleteCancha } from "../services/cancha.service.js";
import { canchaSchema } from "../schemas/cancha.schema.js";

export async function listarCanchas(req: Request, res: Response) {
  try {
    const canchas = await getAllCanchas();
    res.status(200).json(canchas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener canchas" });
  }
}

export async function crearCancha(req: Request, res: Response) {
  const resultado = canchaSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ errores: resultado.error.issues});
  }

  try {
    const nuevaCancha = await createCancha(resultado.data);
    res.status(201).json(nuevaCancha);
  } catch (error){
    console.error(error);
    res.status(500).json({mensaje: "Error al crear cancha"})
  }
}

export async function actualizarCancha(req: Request, res: Response) {
  const id = Number(req.params.id);

  const resultado = canchaSchema.partial().safeParse(req.body);
  if(!resultado.success){
    return res.status(400).json({errores: resultado.error.issues});
  }

  try {
    const canchaActualizada = await updateCancha (id, resultado.data);
    res.status(200).json(canchaActualizada);
  } catch (error){
    console.error(error);
    res.status(404).json({mensaje: "Cancha no encontrada"});
  }
}

export async function borrarCancha(req: Request, res: Response) {
  const id = Number(req.params.id);

  try{
    await deleteCancha(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({mensaje: "Cancha no encontrada"})
  }
}