import { Router } from "express";
import { 
  listFriendRequests,
  getFriendRequestHandler,
  createFriendRequestHandler,
  updateFriendRequestHandler,
  deleteFriendRequestHandler
} from "../controllers/friend-request.controller.js";

const router = Router();

router.get("/", listFriendRequests);
router.get("/:id", getFriendRequestHandler);
router.post("/", createFriendRequestHandler);
router.put("/:id", updateFriendRequestHandler);
router.delete("/:id", deleteFriendRequestHandler);

export default router;
