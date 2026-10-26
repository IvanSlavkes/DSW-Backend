import { Router } from "express";
import { listFields, getFieldHandler, createFieldHandler, updateFieldHandler, deleteFieldHandler } from "../controllers/field.controller.js";
import { requireAdmin } from "../lib/permissions.js";

const router = Router();

router.get("/", listFields);
router.get("/:id", getFieldHandler);
router.post("/", requireAdmin, createFieldHandler);
router.put("/:id", requireAdmin, updateFieldHandler);
router.delete("/:id", requireAdmin, deleteFieldHandler);

export default router;
