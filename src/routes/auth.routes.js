import express from "express";
import {
  login,
  getMe,
  registerAdmin,
  testConnection,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Test
router.get("/test", testConnection);

// Auth
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

// Solo para crear admin (opcional)
router.post("/register-admin", registerAdmin);

export default router;
