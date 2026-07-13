import express from "express";
import dotenv from "dotenv";

import accountRoutes from "./routes/account.js";
import eventRoutes from "./routes/event.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(express.json());

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
  console.error(err);
  res.status(500).json({ error: "Erreur interne serveur" });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});