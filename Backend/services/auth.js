import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET manquant ou trop faible");
}

export async function hashPassword(raw) {
  return bcrypt.hash(raw, 12);
}

export async function comparePassword(raw, hash) {
  return bcrypt.compare(raw, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    algorithm: "HS256",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
}