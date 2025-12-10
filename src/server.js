// src/server.js
import "dotenv/config";
import express from "express";
import app from "./app.js";
import connect from "./db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

// IMPORTA SOLO UNA VEZ AQUI
import driversAdminRoutes from "./routes/driversAdmin.routes.js";

const PORT = process.env.PORT || 4000;

// Para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// RUTA ADMIN DE CHOFERES (AQUI MISMO)
app.use("/api/admin/drivers", driversAdminRoutes);

// Crear admin si no existe
async function ensureAdminExists() {
  const exists = await User.findOne({ email: "admin@diesel.local" });
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@diesel.local",
      password: hashed,
      role: "admin",
    });
    console.log("🔐 Admin creado: admin@diesel.local / admin123");
  }
}

// Conectar DB + iniciar servidor
connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB conectado correctamente");

    await ensureAdminExists();

    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });
