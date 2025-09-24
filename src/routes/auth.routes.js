// src/routes/auth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 👇 asegúrate de que tu modelo exista en src/models/User.js
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Busca usuario en BD
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // 2. Valida contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 3. Genera token con driverRef si aplica
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        driverRef: user.driverRef || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Respuesta
    res.json({
      token,
      role: user.role,             // "admin" o "driver"
      driverRef: user.driverRef || null,
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error interno en login" });
  }
});

export default router;
