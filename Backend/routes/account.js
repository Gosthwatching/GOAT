import { Router } from "express";
import { register, login, me } from "../controllers/accountController.js";
import { requireAuth } from "../Middleware/middleware.js";
import { authLimiter } from "../Middleware/security.js";
import { validateBody } from "../Middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;