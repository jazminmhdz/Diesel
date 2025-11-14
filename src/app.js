// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js"; // ✅ sin llaves

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 📦 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 🚨 Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ message: "Endpoint no encontrado" }));

export default app;
