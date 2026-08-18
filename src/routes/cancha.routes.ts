import { Router } from "express";
import { listarCanchas, crearCancha, actualizarCancha, borrarCancha } from "../controllers/cancha.controller.js";

const router = Router();

router.get("/", listarCanchas);
router.post("/", crearCancha);
router.put("/:id", actualizarCancha);
router.delete("/:id", borrarCancha);

export default router;