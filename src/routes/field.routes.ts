import { Router } from "express";
import { listFields, getFieldHandler, createFieldHandler, updateFieldHandler, deleteFieldHandler } from "../controllers/field.controller.js";

const router = Router();

router.get("/", listFields);
router.get("/:id", getFieldHandler);
router.post("/", createFieldHandler);
router.put("/:id", updateFieldHandler);
router.delete("/:id", deleteFieldHandler);

export default router;