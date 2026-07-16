import { Router } from "express";
import {
  createEvent,
  listEvents,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";
import { requireAuth } from "../Middleware/middleware.js";

const router = Router();

router.post("/", requireAuth, createEvent);
router.get("/", requireAuth, listEvents); 
router.post("/:id/join", requireAuth, joinEvent);
router.delete("/:id/leave", requireAuth, leaveEvent);

export default router;