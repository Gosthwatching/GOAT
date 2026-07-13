import pool from "../db/pool.js";

export async function createAccount({ nom, prenom, pseudo, passwordHash }) {
  const sql = `
    -- TODO: adapter si la colonne password_hash n'existe pas encore
    INSERT INTO compte (nom, prenom, pseudo, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nom, prenom, pseudo, photo_profil, qr_code
  `;
  const values = [nom, prenom, pseudo, passwordHash];
  const { rows } = await pool.query(sql, values);
  return rows[0];
}

export async function findAccountByPseudo(pseudo) {
  const sql = `
    -- TODO: vérifier les colonnes retournées
    SELECT id, nom, prenom, pseudo, photo_profil, qr_code, password_hash
    FROM compte
    WHERE pseudo = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [pseudo]);
  return rows[0] || null;
}

export async function findAccountById(id) {
  const sql = `
    SELECT id, nom, prenom, pseudo, photo_profil, qr_code
    FROM compte
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [id]);
  return rows[0] || null;
}