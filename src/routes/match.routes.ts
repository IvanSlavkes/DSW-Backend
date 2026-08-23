import { Router } from "express";
import { listMatches } from "../controllers/match.controller.js";

const router = Router();

router.get("/", listMatches);

export default router;