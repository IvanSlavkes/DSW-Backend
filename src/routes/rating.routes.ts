import { Router } from "express";
import { 
  listRatings,
  getRatingHandler,
  createRatingHandler,
  updateRatingHandler,
  deleteRatingHandler
} from "../controllers/rating.controller.js";

const router = Router();

router.get("/", listRatings);
router.get("/:id", getRatingHandler);
router.post("/", createRatingHandler);
router.put("/:id", updateRatingHandler);
router.delete("/:id", deleteRatingHandler);

export default router;
