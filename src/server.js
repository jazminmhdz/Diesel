// src/server.js
import "dotenv/config"; // Cargar variables de entorno
import app from "./app.js";
import connect from "./db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 4000;

// 🧩 Crear admin si no existe
async function ensureAdminExists() {
  const exists = await User.findOne({ email: "admin@diesel.local" });
  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@diesel.local",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin creado automáticamente: admin@diesel.local / admin123");
  }
}

// 🚀 Conectar a MongoDB y levantar el servidor
connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB conectado");
    await ensureAdminExists();
    app.listen(PORT, () => console.log(`🚀 API escuchando en :${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Fallo al conectar MongoDB:", err);
    process.exit(1);
  });
