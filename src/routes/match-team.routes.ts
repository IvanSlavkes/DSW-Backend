import { Router } from "express";
import { requireAdmin } from "../lib/permissions.js";
import { listMatchTeams, 
  getMatchTeamHandler, 
  createMatchTeamHandler, 
  updateMatchTeamHandler, 
  deleteMatchTeamHandler 
} from "../controllers/match-team.controller.js";

const router = Router();

router.get("/", listMatchTeams);
router.get("/:id", getMatchTeamHandler);
router.post("/", requireAdmin, createMatchTeamHandler);
router.put("/:id", requireAdmin, updateMatchTeamHandler);
router.delete("/:id", requireAdmin, deleteMatchTeamHandler);

export default router;
