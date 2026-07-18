import pool from "../db/pool.js";

export async function createAccount({ nom, prenom, pseudo, passwordHash, photoProfil }) {
  const sql = `
    INSERT INTO compte (nom, prenom, pseudo, password_hash, photo_profil)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nom, prenom, pseudo, photo_profil, qr_code
  `;
  const values = [nom, prenom, pseudo, passwordHash, photoProfil ?? null];
  const { rows } = await pool.query(sql, values);
  return rows[0];
}

export async function findAccountByPseudo(pseudo) {
  const sql = `
    SELECT id, nom, prenom, pseudo, photo_profil, qr_code, password_hash
    FROM compte
    WHERE pseudo = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [pseudo]);
  return rows[0] || null;
}

export async function findAccountsByName(nom, prenom) {
  const sql = `
    SELECT id, nom, prenom, pseudo, photo_profil, qr_code, password_hash
    FROM compte
    WHERE LOWER(nom) = LOWER($1)
      AND LOWER(prenom) = LOWER($2)
  `;
  const { rows } = await pool.query(sql, [nom, prenom]);
  return rows;
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