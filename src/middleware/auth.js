// src/middlewares/auth.js
import jwt from "jsonwebtoken";

// ✅ Clave secreta (usa la misma del login)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Falta token de autenticación" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token inválido o ausente" });
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Token no válido" });
    }

    req.user = decoded;

    // Solo admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: solo administrador" });
    }

    next();
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
