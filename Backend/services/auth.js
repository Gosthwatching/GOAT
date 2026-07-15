import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;

export async function hashPassword(plain) {
  if (typeof plain !== "string") {
    throw new Error("Le mot de passe est invalide");
  }
  
  if (plain.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");
  }
  
  return bcrypt.hash(String(plain), SALT_ROUNDS);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(String(plain), String(hash));
}

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.verify(token, secret);
}