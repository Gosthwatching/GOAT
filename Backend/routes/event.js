import { Router } from "express";
import {
  createEvent,
  listEvents,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";
import { requireAuth } from "../Middleware/middleware.js";
import { validateBody } from "../Middleware/validate.js";
import { createEventSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", requireAuth, validateBody(createEventSchema), createEvent);
router.get("/", requireAuth, listEvents);
router.post("/:id/join", requireAuth, joinEvent);
router.delete("/:id/leave", requireAuth, leaveEvent);

export default router;