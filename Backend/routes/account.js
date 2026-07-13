import { Router } from "express";
import {
  // TODO: décommente quand tu crées le controller
  register,
  login,
  me,
} from "../controllers/accountController.js";

const router = Router();

// TODO: endpoint inscription
router.post("/register", register);

// TODO: endpoint connexion
router.post("/login", login);

// TODO: endpoint profil connecté
router.get("/me", me);

// TODO: export du router
export default router;