import { Router } from "express";
import { listarUsuarios } from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", listarUsuarios);

export default router;