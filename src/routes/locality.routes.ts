import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { requireAdmin } from "../lib/permissions.js";
import { 
  listLocalities, 
  getLocalityHandler, 
  createLocalityHandler, 
  updateLocalityHandler, 
  deleteLocalityHandler
} from "../controllers/locality.controller.js";

const router = Router();

router.get("/", listLocalities);
router.get("/:id", getLocalityHandler);
router.post("/", verifyToken, requireAdmin, createLocalityHandler);
router.put("/:id", verifyToken, requireAdmin, updateLocalityHandler);
router.delete("/:id", verifyToken, requireAdmin, deleteLocalityHandler);

export default router;
