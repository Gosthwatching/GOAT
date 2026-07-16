import { verifyToken } from "../services/auth.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    const userId = Number(payload?.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ error: "Token invalide" });
    }

    req.user = { id: userId, pseudo: payload?.pseudo ?? null };
    return next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}