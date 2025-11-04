import express from "express";
import { login, getMe, registerAdmin, testConnection } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/test", testConnection);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/register-admin", registerAdmin);

export default router;
