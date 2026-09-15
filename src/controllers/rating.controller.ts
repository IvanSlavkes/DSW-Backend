import type { Request, Response } from "express";
import { 
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deleteRating
} from "../services/rating.service.js";

// Listar todas las calificaciones
export async function listRatings(req: Request, res: Response) {
  const ratings = await getAllRatings();
  res.json(ratings);
}

// Obtener una calificación por ID
export async function getRatingHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const rating = await getRatingById(id);
  if (!rating) return res.status(404).json({ mensaje: "Calificación no encontrada" });
  res.json(rating);
}

// Crear calificación
export async function createRatingHandler(req: Request, res: Response) {
  const { matchId, raterId, ratedId, stars, comment } = req.body;
  try {
    const nuevaRating = await createRating({ matchId, raterId, ratedId, stars, comment });
    res.status(201).json(nuevaRating);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ mensaje: "Ya existe una calificación para este usuario en este partido" });
    } else {
      res.status(500).json({ mensaje: "Error al crear calificación" });
    }
  }
}

// Actualizar calificación
export async function updateRatingHandler(req: Request, res: Response) {
  
 const id = parseInt(req.params.id as string, 10);
  const { stars, comment } = req.body;
  try {
    const ratingUpdated = await updateRating(id, { stars, comment });
    res.json(ratingUpdated);
  } catch (error) {
    res.status(404).json({ mensaje: "Calificación no encontrada" });
  }
}

// Eliminar calificación
export async function deleteRatingHandler(req: Request, res: Response) {
 const id = parseInt(req.params.id as string, 10);
  try {
    await deleteRating(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ mensaje: "Calificación no encontrada" });
  }
}
