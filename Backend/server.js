import express from "express";
import dotenv from "dotenv";

import accountRoutes from "./routes/account.js";
import eventRoutes from "./routes/event.js";
import chatRoutes from "./routes/chat.js";

import { applySecurity, apiLimiter } from "./Middleware/security.js";
import { httpLogger, logger } from "./services/logger.js";

dotenv.config();

const app = express();

applySecurity(app);
app.use(httpLogger);
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/account", accountRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/chat", chatRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.use((err, _req, res, _next) => {
  logger.error({ err }, "Unhandled error");
  if (String(err.message || "").includes("Origin non autorisée")) {
    return res.status(403).json({ error: "Origin non autorisée" });
  }
  res.status(500).json({ error: "Erreur interne serveur" });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});