// src/app.js (BACKEND)
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas principales
app.use("/api/auth", authRoutes);      // login, me
app.use("/api/admin", adminRoutes);    // rutas admin
app.use("/api/driver", driverRoutes);  // rutas chofer
app.use("/api/reports", reportsRoutes);// alertas, rendimiento

// Ruta de prueba
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

export default app;
