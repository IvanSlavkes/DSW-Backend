import { Router } from "express";
import {
  createFieldCategoryHandler,
  deleteFieldCategoryHandler,
  getFieldCategoryHandler,
  listFieldCategories,
  updateFieldCategoryHandler,
} from "../controllers/field-category.controller.js";
import { requireAdmin } from "../lib/permissions.js";

const router = Router();

router.get("/", listFieldCategories);
router.get("/:id", getFieldCategoryHandler);
router.post("/", requireAdmin, createFieldCategoryHandler);
router.put("/:id", requireAdmin, updateFieldCategoryHandler);
router.delete("/:id", requireAdmin, deleteFieldCategoryHandler);

export default router;
