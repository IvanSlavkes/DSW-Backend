import { Router } from "express";
import { listNotification } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", listNotification);

export default router;