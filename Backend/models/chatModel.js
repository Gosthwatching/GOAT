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

export async function canUserWriteToChatbox(chatboxId, userId) {
  const sql = `
    SELECT 1
    FROM chatbox c
    JOIN participants p ON p.sortie_id = c.sortie_id
    WHERE c.id = $1
      AND p.compte_id = $2
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [chatboxId, userId]);
  return rows.length > 0;
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