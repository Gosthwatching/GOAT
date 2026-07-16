import {
  insertEvent,
  selectEvents,
  insertParticipant,
  deleteParticipant,
} from "../models/eventModel.js";

export async function createEvent(req, res, next) {
  try {
    const nomClean = String(req.body?.nom ?? "").trim();
    const lieuClean = String(req.body?.lieu ?? "").trim();
    const dateRaw = req.body?.date;
    const expirationRaw = req.body?.expiration;
    const createdBy = Number(req.user?.id);

    if (!nomClean || !lieuClean || !dateRaw) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    if (!Number.isInteger(createdBy) || createdBy <= 0) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const parsedDate = new Date(dateRaw);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Date invalide" });
    }

    let parsedExpiration = null;
    if (expirationRaw != null && String(expirationRaw).trim() !== "") {
      parsedExpiration = new Date(expirationRaw);

      if (Number.isNaN(parsedExpiration.getTime())) {
        return res.status(400).json({ error: "Expiration invalide" });
      }

      if (parsedExpiration <= parsedDate) {
        return res.status(400).json({
          error: "Expiration doit être strictement supérieure à la date de l'événement",
        });
      }
    }

    const event = await insertEvent({
      nom: nomClean,
      lieu: lieuClean,
      date: parsedDate.toISOString(),
      expiration: parsedExpiration ? parsedExpiration.toISOString() : null,
      created_by: createdBy,
    });

    return res.status(201).json(event);
  } catch (err) {
    if (err?.code === "23503") {
      return res.status(404).json({ error: "Compte introuvable" });
    }
    next(err);
  }
}

export async function listEvents(_req, res, next) {
  try {
    const events = await selectEvents();
    return res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function joinEvent(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    const compteId = Number(req.user?.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: "ID sortie invalide" });
    }

    if (!Number.isInteger(compteId) || compteId <= 0) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const row = await insertParticipant(eventId, compteId);

    if (!row) {
      return res.status(409).json({ error: "Déjà inscrit" });
    }

    return res.status(201).json({
      joined: true,
      message: "Inscription OK",
    });
  } catch (err) {
    if (err?.code === "23503") {
      return res.status(404).json({ error: "Sortie introuvable" });
    }
    next(err);
  }
}

export async function leaveEvent(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    const compteId = Number(req.user?.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: "ID sortie invalide" });
    }

    if (!Number.isInteger(compteId) || compteId <= 0) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const row = await deleteParticipant(eventId, compteId);

    if (!row) {
      return res.status(404).json({ error: "Inscription introuvable" });
    }

    return res.json({
      left: true,
      message: "Désinscription OK",
    });
  } catch (err) {
    next(err);
  }
}