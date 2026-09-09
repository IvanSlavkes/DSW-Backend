import { Router } from "express";
import { 
  listUsers, 
  getUserHandler, 
  createUserHandler, 
  updateUserHandler, 
  deleteUserHandler 
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUserHandler);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

export default router;