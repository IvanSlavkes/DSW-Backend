import { Router } from "express";
import { listRatings } from "../controllers/rating.controller.js";

const router = Router();

router.get("/", listRatings);

export default router;