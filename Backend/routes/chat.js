import { Router } from "express";
import { listMessages, sendMessage } from "../controllers/chatController.js";
import { requireAuth } from "../Middleware/middleware.js";
import { validateBody } from "../Middleware/validate.js";
import { sendMessageSchema } from "../validators/schemas.js";

const router = Router();

router.get("/:chatboxId/messages", listMessages);
router.post(
  "/:chatboxId/messages",
  requireAuth,
  validateBody(sendMessageSchema),
  sendMessage
);

export default router;