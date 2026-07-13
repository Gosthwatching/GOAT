import {
  // TODO: importer les fonctions model
  createAccount,
  findAccountByPseudo,
  findAccountById,
} from "../models/accountModel.js";

import {
  // TODO: importer les fonctions auth
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
} from "../services/auth.js";

export async function register(req, res, next) {
  try {
    const { nom, prenom, pseudo, password } = req.body;

    // TODO: valider les champs obligatoires
    // if (...) return res.status(400).json({ error: "..." });

    // TODO: vérifier si pseudo déjà pris
    const existing = await findAccountByPseudo(pseudo);
    if (existing) {
      return res.status(409).json({ error: "Pseudo déjà utilisé" });
    }

    // TODO: hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // TODO: créer le compte en DB
    const account = await createAccount({
      nom,
      prenom,
      pseudo,
      passwordHash,
    });

    // TODO: choisir les champs à renvoyer
    return res.status(201).json(account);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { pseudo, password } = req.body;

    // TODO: valider les champs
    // if (...) return res.status(400).json({ error: "..." });

    // TODO: chercher le compte
    const account = await findAccountByPseudo(pseudo);
    if (!account) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // TODO: vérifier le mot de passe
    const ok = await comparePassword(password, account.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // TODO: générer un JWT
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
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    // TODO: vérifier présence token
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // TODO: décoder/vérifier token
    const payload = verifyToken(token);

    // TODO: récupérer l'utilisateur en DB
    const account = await findAccountById(Number(payload.sub));
    if (!account) {
      return res.status(404).json({ error: "Compte introuvable" });
    }

    return res.json(account);
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
}