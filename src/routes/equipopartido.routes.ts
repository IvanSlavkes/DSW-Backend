import { Router } from "express";
import { listarEquiposPartido } from "../controllers/equipopartido.controller.js";

const router = Router();

router.get("/", listarEquiposPartido);

export default router;