import {
  // TODO: importer fonctions model chat
  selectMessagesByChatbox,
  insertMessage,
} from "../models/chatModel.js";

export async function listMessages(req, res, next) {
  try {
    const chatboxId = Number(req.params.chatboxId);

    // TODO: valider chatboxId
    // if (...) return res.status(400).json({ error: "..." });

    const rows = await selectMessagesByChatbox(chatboxId);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const chatboxId = Number(req.params.chatboxId);
    const { sender_id, text } = req.body;

    // TODO: validations chatboxId + sender_id + text
    // if (...) return res.status(400).json({ error: "..." });

    const msg = await insertMessage({
      chatboxId,
      sender_id: Number(sender_id),
      text: String(text),
    });

    return res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
}