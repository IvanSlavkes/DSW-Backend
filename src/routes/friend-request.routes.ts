import { Router } from "express";
import { listFriendRequests } from "../controllers/friend-request.controller.js";

const router = Router();

router.get("/", listFriendRequests);

export default router;