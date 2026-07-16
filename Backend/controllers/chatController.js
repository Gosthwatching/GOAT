import {
  selectMessagesByChatbox,
  insertMessage,
  canUserWriteToChatbox,
} from "../models/chatModel.js";

export async function listMessages(req, res, next) {
  try {
    const chatboxId = Number(req.params.chatboxId);

    if (!Number.isInteger(chatboxId) || chatboxId <= 0) {
      return res.status(400).json({ error: "ID de chatbox invalide" });
    }

    const rows = await selectMessagesByChatbox(chatboxId);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const chatboxId = Number(req.params.chatboxId);
    const senderId = Number(req.user?.id);
    const textClean = String(req.body?.text ?? "").trim();

    if (
      !Number.isInteger(chatboxId) ||
      chatboxId <= 0 ||
      !Number.isInteger(senderId) ||
      senderId <= 0 ||
      !textClean
    ) {
      return res.status(400).json({ error: "Champs invalides" });
    }

    const allowed = await canUserWriteToChatbox(chatboxId, senderId);
    if (!allowed) {
      return res.status(403).json({ error: "Accès refusé à cette chatbox" });
    }

    const msg = await insertMessage({
      chatboxId,
      sender_id: senderId,
      text: textClean,
    });

    return res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
}