import { Router } from "express";
import { listarSolicitudesAmistad } from "../controllers/solamistad.controller.js";

const router = Router();

router.get("/", listarSolicitudesAmistad);

export default router;