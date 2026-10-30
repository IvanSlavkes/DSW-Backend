import { Router } from "express";
import { requireAdmin } from "../lib/permissions.js";
import { listTeamPositions, 
  getTeamPositionHandler, 
  createTeamPositionHandler, 
  updateTeamPositionHandler, 
  deleteTeamPositionHandler } from "../controllers/team-position.controller.js";

const router = Router();

router.get("/", listTeamPositions);
router.get("/:id", getTeamPositionHandler);
router.post("/", requireAdmin, createTeamPositionHandler);
router.put("/:id", requireAdmin, updateTeamPositionHandler);
router.delete("/:id", requireAdmin, deleteTeamPositionHandler);

export default router;
