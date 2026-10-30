import type { Request, Response } from 'express';
import {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
  countMatchesByField,
} from '../services/field.service.js';
import { fieldSchema } from '../schemas/field.schema.js';

export async function listFields(req: Request, res: Response) {
  try {
    const fields = await getAllFields();
    res.status(200).json(fields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener canchas' });
  }
}
export async function getFieldHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const field = await getFieldById(id);
    if (!field) {
      return res.status(404).json({ message: 'Cancha not found' });
    }
    res.status(200).json(field);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cancha' });
  }
}

export async function createFieldHandler(req: Request, res: Response) {
  const result = fieldSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    const nuevaField = await createField(result.data);
    res.status(201).json(nuevaField);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear Cancha' });
  }
}

export async function updateFieldHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  const result = fieldSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    const FieldActualizada = await updateField(id, result.data);
    res.status(200).json(FieldActualizada);
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Cancha no encontrada' });
  }
}

export async function deleteFieldHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const matchesCount = await countMatchesByField(id);
    if (matchesCount > 0) {
      return res.status(409).json({
        mensaje: `No se puede eliminar la cancha: tiene ${matchesCount} partido(s) asociado(s)`,
      });
    }

    await deleteField(id);
    res.status(204).send();
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Cancha no encontrada' });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la cancha' });
  }
}