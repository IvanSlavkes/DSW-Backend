import { Router } from "express";
import { listarPartidos } from "../controllers/partido.controller.js";

const router = Router();

router.get("/", listarPartidos);

export default router;