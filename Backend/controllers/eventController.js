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

    // TODO: validations champs obligatoires
    // if (...) return res.status(400).json({ error: "..." });

    // TODO: validation date
    // const parsedDate = new Date(date);
    // if (Number.isNaN(parsedDate.getTime())) ...

    // TODO: validation expiration (optionnelle)
    // if (expiration) { ... }

    const event = await insertEvent({
      nom,
      lieu,
      date,        // TODO: éventuellement convertir en ISO string
      expiration,  // TODO: idem
      created_by,
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

    // TODO: validations eventId + compte_id
    // if (...) return res.status(400).json({ error: "..." });

    const row = await insertParticipant(eventId, Number(compte_id));

    return res.status(201).json({
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

    // TODO: validations eventId + compte_id
    // if (...) return res.status(400).json({ error: "..." });

    const row = await deleteParticipant(eventId, Number(compte_id));

    return res.json({
      left: Boolean(row),
      message: row ? "Désinscription OK" : "Pas inscrit",
    });
  } catch (err) {
    next(err);
  }
}