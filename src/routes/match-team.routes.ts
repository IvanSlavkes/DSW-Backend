import { Router } from "express";
import { listMatchTeams } from "../controllers/match-team.controller.js";

const router = Router();

router.get("/", listMatchTeams);

export default router;