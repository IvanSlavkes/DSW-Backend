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
import {
  getMyMatchParticipationHandler,
  joinMatchHandler,
  listMatchPositionRequestsHandler,
  respondToPositionRequestHandler,
} from "../controllers/position-request.controller.js";

const router = Router();

router.get("/", listMatches);
router.get("/mine", listMyMatches);
router.post("/:id/join", joinMatchHandler);
router.get("/:id/my-participation", getMyMatchParticipationHandler);
router.get("/:id/position-requests", listMatchPositionRequestsHandler);
router.patch("/:id/position-requests/:requestId", respondToPositionRequestHandler);
router.get("/:id", getMatchHandler);
router.post("/", createMatchHandler);
router.put("/:id", requireAdmin, updateMatchHandler);
router.delete("/:id", requireAdmin, deleteMatchHandler);

export default router;
