import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

import connect from "./db.js";
import User from "./models/User.js";

// Rutas
import driversAdminRoutes from "./routes/driversAdmin.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rutas
app.use("/api/admin/drivers", driversAdminRoutes);
app.use("/api/admin/tickets", ticketRoutes);
app.use("/api/admin/reports", reportsRoutes);

// Admin default
async function ensureAdminExists() {
  const exists = await User.findOne({ email: "admin@diesel.local" });

  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@diesel.local",
      password: hashed,
      role: "admin",
    });

    console.log("🔐 Admin creado");
  }
}

// Start
connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB conectado");
    await ensureAdminExists();

    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error MongoDB:", err.message);
    process.exit(1);
  });
