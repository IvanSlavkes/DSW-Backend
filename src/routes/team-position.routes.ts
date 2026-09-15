import { Router } from "express";
import { listTeamPositions, 
  getTeamPositionHandler, 
  createTeamPositionHandler, 
  updateTeamPositionHandler, 
  deleteTeamPositionHandler } from "../controllers/team-position.controller.js";

const router = Router();

router.get("/", listTeamPositions);
router.get("/:id", getTeamPositionHandler);
router.post("/", createTeamPositionHandler);
router.put("/:id", updateTeamPositionHandler);
router.delete("/:id", deleteTeamPositionHandler);

export default router;
