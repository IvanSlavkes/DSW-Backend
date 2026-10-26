import { Router } from "express";
import { 
  listRatings,
  getRatingHandler,
  createRatingHandler,
  updateRatingHandler,
  deleteRatingHandler
} from "../controllers/rating.controller.js";
import { requireAdmin } from "../lib/permissions.js";

const router = Router();

router.get("/", listRatings);
router.get("/:id", getRatingHandler);
router.post("/", createRatingHandler);
router.put("/:id", requireAdmin, updateRatingHandler);
router.delete("/:id", requireAdmin, deleteRatingHandler);

export default router;
