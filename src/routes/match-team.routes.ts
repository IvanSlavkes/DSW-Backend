import { Router } from "express";
import { listMatchTeams, 
  getMatchTeamHandler, 
  createMatchTeamHandler, 
  updateMatchTeamHandler, 
  deleteMatchTeamHandler 
} from "../controllers/match-team.controller.js";

const router = Router();

router.get("/", listMatchTeams);
router.get("/:id", getMatchTeamHandler);
router.post("/", createMatchTeamHandler);
router.put("/:id", updateMatchTeamHandler);
router.delete("/:id", deleteMatchTeamHandler);

export default router;