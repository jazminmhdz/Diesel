// src/middlewares/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Falta token de autenticación" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token inválido o ausente" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: solo administrador" });
    }

    next();
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
