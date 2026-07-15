import {
  // TODO: importer les fonctions model event
  insertEvent,
  selectEvents,
  insertParticipant,
  deleteParticipant,
} from "../models/eventModel.js";

export async function createEvent(req, res, next) {
  try {
    const { nom, lieu, date, expiration, created_by } = req.body;
    
    if (!nom || !lieu || !date || !created_by) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }
  
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Date invalide" });
    }

    // 🔥 VALIDATION EXPIRATION
    let parsedExpiration = null;
    if (expiration) {
      parsedExpiration = new Date(expiration);

      if (Number.isNaN(parsedExpiration.getTime())) {
        return res.status(400).json({ error: "Expiration invalide" });
      }

      if (parsedExpiration <= parsedDate) {
        return res.status(400).json({
          error: "Expiration doit être strictement supérieure à la date de l'événement"
        });
      }
    }

    const event = await insertEvent({
      nom: String(nom).trim(),
      lieu: String(lieu).trim(),
      date: parsedDate.toISOString(),
      expiration: parsedExpiration ? parsedExpiration.toISOString() : null,
      created_by: Number(created_by),
    });

    return res.status(201).json(event);
  } catch (err) {
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
    const { compte_id } = req.body;

    if (isNaN(eventId) || isNaN(Number(compte_id))) {
      return res.status(400).json({ error: "Champs invalides" });
    }

    const row = await insertParticipant(eventId, Number(compte_id));

    return res.status(200).json({
      joined: Boolean(row),
      message: row ? "Inscription OK" : "Déjà inscrit",
    });
  } catch (err) {
    next(err);
  }
}

export async function leaveEvent(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    const { compte_id } = req.body;

    if (isNaN(eventId) || isNaN(Number(compte_id))) {
      return res.status(400).json({ error: "Champs invalides" });
    }

    const row = await deleteParticipant(eventId, Number(compte_id));

    return res.json({
      left: Boolean(row),
      message: row ? "Désinscription OK" : "Pas inscrit",
    });
  } catch (err) {
    next(err);
  }
}