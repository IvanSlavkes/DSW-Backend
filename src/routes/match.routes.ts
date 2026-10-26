import { Router } from "express";
import { 
  listMatches, 
  listMyMatches,
  getMatchHandler, 
  createMatchHandler, 
  updateMatchHandler, 
  deleteMatchHandler 
} from "../controllers/match.controller.js";
import { requireAdmin } from "../lib/permissions.js";

const router = Router();

router.get("/", listMatches);
router.get("/mine", listMyMatches);
router.get("/:id", getMatchHandler);
router.post("/", createMatchHandler);
router.put("/:id", requireAdmin, updateMatchHandler);
router.delete("/:id", requireAdmin, deleteMatchHandler);

export default router;
