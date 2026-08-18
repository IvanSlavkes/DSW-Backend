import { Router } from "express";
import { listarNotificaciones } from "../controllers/notificacion.controller.js";

const router = Router();

router.get("/", listarNotificaciones);

export default router;