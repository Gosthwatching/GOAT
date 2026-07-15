import { Router } from "express";
import {
  listMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { requireAuth } from "../Middleware/middleware.js";

const router = Router();

router.get("/:chatboxId/messages", listMessages);
router.post("/:chatboxId/messages", requireAuth, sendMessage);

export default router;