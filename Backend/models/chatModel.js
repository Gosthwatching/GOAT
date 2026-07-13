import pool from "../db/pool.js";

export async function selectMessagesByChatbox(chatboxId) {
  const sql = `
    SELECT id, chatbox_id, sender_id, text, "timestamp"
    FROM message
    WHERE chatbox_id = $1
    ORDER BY "timestamp" ASC
  `;
  const { rows } = await pool.query(sql, [chatboxId]);
  return rows;
}

export async function insertMessage({ chatboxId, sender_id, text }) {
  const sql = `
    INSERT INTO message (chatbox_id, sender_id, text)
    VALUES ($1, $2, $3)
    RETURNING id, chatbox_id, sender_id, text, "timestamp"
  `;
  const { rows } = await pool.query(sql, [chatboxId, sender_id, text]);
  return rows[0];
}