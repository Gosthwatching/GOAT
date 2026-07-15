import {
  createAccount,
  findAccountByPseudo,
  findAccountById,
} from "../models/accountModel.js";

import {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
} from "../services/auth.js";

export async function   register(req, res, next) {
  try {
    const { nom, prenom, pseudo, password } = req.body;

    const nomClean = String(nom ?? "").trim();
    const prenomClean = String(prenom ?? "").trim();
    const pseudoClean = String(pseudo ?? "").trim();
    const passwordRaw = String(password ?? "");

    if (!nomClean || !prenomClean || !pseudoClean || !passwordRaw) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    if (passwordRaw.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    const existing = await findAccountByPseudo(pseudoClean);
    if (existing) {
      return res.status(409).json({ error: "Pseudo déjà utilisé" });
    }

    const passwordHash = await hashPassword(passwordRaw);

    const account = await createAccount({
      nom: nomClean,
      prenom: prenomClean,
      pseudo: pseudoClean,
      passwordHash,
    });

    return res.status(201).json(account);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const pseudoClean = String(req.body?.pseudo ?? "").trim();
    const passwordRaw = String(req.body?.password ?? "");

    if (!pseudoClean || !passwordRaw) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const account = await findAccountByPseudo(pseudoClean);
    if (!account) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const ok = await comparePassword(passwordRaw, account.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = signToken({
      sub: account.id,
      pseudo: account.pseudo,
    });

    return res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Token invalide" });
    }

    const accountId = Number(payload?.sub);
    if (!Number.isInteger(accountId)) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const account = await findAccountById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Compte introuvable" });
    }

    return res.json(account);
  } catch (err) {
    next(err);
  }
}