import { Router } from "express";
import { requireAdmin } from "../lib/permissions.js";
import { 
  listNotifications,
  getNotificationHandler,
  createNotificationHandler,
  updateNotificationHandler,
  deleteNotificationHandler
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", listNotifications);
router.get("/:id", getNotificationHandler);
router.post("/", requireAdmin, createNotificationHandler);
router.put("/:id", updateNotificationHandler);
router.delete("/:id", deleteNotificationHandler);

export default router;
