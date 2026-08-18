import { Router } from "express";
import { listarCalificaciones } from "../controllers/calificacion.controller.js";

const router = Router();

router.get("/", listarCalificaciones);

export default router;