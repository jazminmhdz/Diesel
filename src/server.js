// src/server.js
import "dotenv/config";
import express from "express";
import app from "./app.js";
import connect from "./db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 4000;

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos subidos (fotos de tickets)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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
    console.log("Admin creado automáticamente: admin@diesel.local / admin123");
  }
}

// Conectar a MongoDB y levantar servidor
connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" MongoDB conectado correctamente");
    await ensureAdminExists();

    app.listen(PORT, () =>
      console.log(`Servidor API en ejecución en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error(" Error al conectar MongoDB:", err.message);
    process.exit(1);
  });
