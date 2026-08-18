import { Router } from "express";
import { listarCanchas } from "../controllers/cancha.controller.js";

const router = Router();

router.get("/", listarCanchas);

export default router;