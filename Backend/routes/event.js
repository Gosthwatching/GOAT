import { Router } from "express";
import {
  // TODO: décommente quand tu crées le controller
  createEvent,
  listEvents,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";

const router = Router();

// TODO: créer une sortie
router.post("/", createEvent);

// TODO: lister les sorties
router.get("/", listEvents);

// TODO: rejoindre une sortie
router.post("/:id/join", joinEvent);

// TODO: quitter une sortie
router.delete("/:id/leave", leaveEvent);

// TODO: export du router
export default router;