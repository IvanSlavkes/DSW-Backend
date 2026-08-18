import { Router } from "express";
import { listarPosicionesEnEquipo } from "../controllers/posicionenequipo.controller.js";

const router = Router();

router.get("/", listarPosicionesEnEquipo);

export default router;