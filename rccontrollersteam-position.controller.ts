[1mdiff --git a/src/controllers/match-team.controller.ts b/src/controllers/match-team.controller.ts[m
[1mindex b305ff5..f4a9cbc 100644[m
[1m--- a/src/controllers/match-team.controller.ts[m
[1m+++ b/src/controllers/match-team.controller.ts[m
[36m@@ -1,9 +1,11 @@[m
[31m-import type { Request, Response } from "express";[m
[31m-import { getAllMatchTeams, [m
[31m-  getMatchTeamById, [m
[31m-  createMatchTeam, [m
[31m-  updateMatchTeam, [m
[31m-  deleteMatchTeam } from "../services/match-team.service.js";[m
[32m+[m[32mimport type { Request, Response } from 'express';[m
[32m+[m[32mimport {[m
[32m+[m[32m  getAllMatchTeams,[m
[32m+[m[32m  getMatchTeamById,[m
[32m+[m[32m  createMatchTeam,[m
[32m+[m[32m  updateMatchTeam,[m
[32m+[m[32m  deleteMatchTeam,[m
[32m+[m[32m} from '../services/match-team.service.js';[m
 [m
 export async function listMatchTeams(req: Request, res: Response) {[m
   const teams = await getAllMatchTeams();[m
[36m@@ -13,7 +15,7 @@[m [mexport async function listMatchTeams(req: Request, res: Response) {[m
 export async function getMatchTeamHandler(req: Request, res: Response) {[m
   const id = parseInt(req.params.id as string, 10);[m
   const team = await getMatchTeamById(id);[m
[31m-  if (!team) return res.status(404).json({ mensaje: "Equipo no encontrado" });[m
[32m+[m[32m  if (!team) return res.status(404).json({ mensaje: 'Equipo no encontrado' });[m
   res.json(team);[m
 }[m
 [m
[36m@@ -22,8 +24,9 @@[m [mexport async function createMatchTeamHandler(req: Request, res: Response) {[m
   try {[m
     const newTeam = await createMatchTeam({ name, color, matchId });[m
     res.status(201).json(newTeam);[m
[31m-  } catch {[m
[31m-    res.status(500).json({ mensaje: "Error al crear equipo" });[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error(error);[m
[32m+[m[32m    res.status(500).json({ mensaje: 'Error al crear equipo' });[m
   }[m
 }[m
 [m
[36m@@ -32,17 +35,19 @@[m [mexport async function updateMatchTeamHandler(req: Request, res: Response) {[m
   try {[m
     const updated = await updateMatchTeam(id, req.body);[m
     res.json(updated);[m
[31m-  } catch {[m
[31m-    res.status(404).json({ mensaje: "Equipo no encontrado" });[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error(error);[m
[32m+[m[32m    res.status(404).json({ mensaje: 'Equipo no encontrado' });[m
   }[m
 }[m
 [m
 export async function deleteMatchTeamHandler(req: Request, res: Response) {[m
[31m- const id = parseInt(req.params.id as string, 10);[m
[32m+[m[32m  const id = parseInt(req.params.id as string, 10);[m
   try {[m
     await deleteMatchTeam(id);[m
     res.status(204).send();[m
[31m-  } catch {[m
[31m-    res.status(404).json({ mensaje: "Equipo no encontrado" });[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error(error);[m
[32m+[m[32m    res.status(404).json({ mensaje: 'Equipo no encontrado' });[m
   }[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
