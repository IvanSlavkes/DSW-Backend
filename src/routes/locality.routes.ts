import { Router } from "express";
import { 
  listLocalities, 
  getLocalityHandler, 
  createLocalityHandler, 
  updateLocalityHandler, 
  deleteLocalityHandler 
} from "../controllers/locality.controller.js";

const router = Router();

router.get("/", listLocalities);
router.get("/:id", getLocalityHandler);
router.post("/", createLocalityHandler);
router.put("/:id", updateLocalityHandler);
router.delete("/:id", deleteLocalityHandler);

export default router;
