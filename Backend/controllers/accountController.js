import {
  createAccount,
  findAccountByPseudo,
  findAccountsByName,
  findAccountById,
} from "../models/accountModel.js";

import {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
} from "../services/auth.js";

export async function register(req, res, next) {
  try {
    const { nom, prenom, password, photoProfil } = req.body;

    const nomClean = String(nom ?? "").trim();
    const prenomClean = String(prenom ?? "").trim();
    const passwordRaw = String(password ?? "");
    const photoProfilClean = String(photoProfil ?? "").trim();

    if (!nomClean || !prenomClean || !passwordRaw) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    if (passwordRaw.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    const normalize = (value) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 12);

    const pseudoRoot = `${normalize(prenomClean)}${normalize(nomClean)}` || "compte";

    let pseudoGenerated = "";
    for (let i = 0; i < 8; i += 1) {
      const suffix = Math.random().toString(36).slice(2, 6);
      const candidate = `${pseudoRoot}${suffix}`;
      const existing = await findAccountByPseudo(candidate);
      if (!existing) {
        pseudoGenerated = candidate;
        break;
      }
    }

    if (!pseudoGenerated) {
      return res.status(500).json({ error: "Impossible de générer un identifiant" });
    }

    const passwordHash = await hashPassword(passwordRaw);

    const account = await createAccount({
      nom: nomClean,
      prenom: prenomClean,
      pseudo: pseudoGenerated,
      passwordHash,
      photoProfil: photoProfilClean || null,
    });

    return res.status(201).json(account);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const nomClean = String(req.body?.nom ?? "").trim();
    const prenomClean = String(req.body?.prenom ?? "").trim();
    const passwordRaw = String(req.body?.password ?? "");

    if (!nomClean || !prenomClean || !passwordRaw) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const matches = await findAccountsByName(nomClean, prenomClean);
    if (!matches.length) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    if (matches.length > 1) {
      return res.status(409).json({ error: "Plusieurs comptes trouvés pour ce nom et prénom" });
    }

    const account = matches[0];

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