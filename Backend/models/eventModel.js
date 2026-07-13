import pool from "../db/pool.js";

export async function insertEvent({ nom, lieu, date, expiration, created_by }) {
  const sql = `
    INSERT INTO sortie (nom, lieu, date, expiration, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [nom, lieu, date, expiration ?? null, created_by];
  const { rows } = await pool.query(sql, values);
  return rows[0];
}

export async function selectEvents() {
  const sql = `
    -- TODO: tu peux commencer simple avec SELECT * FROM sortie
    -- puis ajouter le nombre de participants
    SELECT s.*,
           COALESCE(COUNT(p.compte_id), 0)::int AS nb_participants
    FROM sortie s
    LEFT JOIN participants p ON p.sortie_id = s.id
    GROUP BY s.id
    ORDER BY s.date ASC
  `;
  const { rows } = await pool.query(sql);
  return rows;
}

export async function insertParticipant(sortieId, compteId) {
  const sql = `
    -- TODO: anti-doublon avec ON CONFLICT
    INSERT INTO participants (sortie_id, compte_id)
    VALUES ($1, $2)
    ON CONFLICT (sortie_id, compte_id) DO NOTHING
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [sortieId, compteId]);
  return rows[0] || null;
}

export async function deleteParticipant(sortieId, compteId) {
  const sql = `
    DELETE FROM participants
    WHERE sortie_id = $1 AND compte_id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [sortieId, compteId]);
  return rows[0] || null;
}