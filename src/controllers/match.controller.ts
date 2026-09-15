import type { Request, Response } from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
} from '../services/match.service.js';
import { matchSchema } from '../schemas/match.schema.js';

export async function listMatches(req: Request, res: Response) {
  try {
    const matches = await getAllMatches();
    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener partidos' });
  }
}

export async function getMatchHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const match = await getMatchById(id);
    if (!match) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el partido' });
  }
}

export async function createMatchHandler(req: Request, res: Response) {
  const result = matchSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    const nuevoMatch = await createMatch(result.data);
    res.status(201).json(nuevoMatch);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      mensaje:
        'Error al crear el partido. Revisá que fieldId y creatorId existan.',
    });
  }
}

export async function updateMatchHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  const result = matchSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errores: result.error.issues });
  }

  try {
    const matchActualizado = await updateMatch(id, result.data);
    res.status(200).json(matchActualizado);
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Partido no encontrado' });
  }
}

export async function deleteMatchHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    await deleteMatch(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Partido no encontrado' });
  }
}
