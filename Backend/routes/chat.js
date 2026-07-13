import { Router } from "express";
import {
  // TODO: décommente quand tu crées le controller
  listMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = Router();

// TODO: lister les messages d'une chatbox
router.get("/:chatboxId/messages", listMessages);

// TODO: envoyer un message
router.post("/:chatboxId/messages", sendMessage);

// TODO: export du router
export default router;