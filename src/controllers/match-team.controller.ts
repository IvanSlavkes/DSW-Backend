import type { Request, Response } from 'express';
import {
  getAllMatchTeams,
  getMatchTeamById,
  createMatchTeam,
  updateMatchTeam,
  deleteMatchTeam,
} from '../services/match-team.service.js';

export async function listMatchTeams(req: Request, res: Response) {
  const teams = await getAllMatchTeams();
  res.json(teams);
}

export async function getMatchTeamHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const team = await getMatchTeamById(id);
  if (!team) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
  res.json(team);
}

export async function createMatchTeamHandler(req: Request, res: Response) {
  const { name, color, matchId } = req.body;
  try {
    const newTeam = await createMatchTeam({ name, color, matchId });
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear equipo' });
  }
}

export async function updateMatchTeamHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    const updated = await updateMatchTeam(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Equipo no encontrado' });
  }
}

export async function deleteMatchTeamHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  try {
    await deleteMatchTeam(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ mensaje: 'Equipo no encontrado' });
  }
}
