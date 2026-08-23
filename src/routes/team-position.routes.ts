import { Router } from "express";
import { listTeamPositions } from "../controllers/team-position.controller.js";

const router = Router();

router.get("/", listTeamPositions);

export default router;