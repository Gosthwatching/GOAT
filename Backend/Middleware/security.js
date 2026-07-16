import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function applySecurity(app) {
  app.use(helmet());

  const allowed = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowed.includes(origin)) return cb(null, true);
        return cb(new Error("Origin non autorisée"));
      },
      credentials: true,
    })
  );

  app.set("trust proxy", 1);
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessaie plus tard" },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});