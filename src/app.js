import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// 📌 Rutas
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();

// 🔒 Seguridad
app.use(helmet());

// 🌐 CORS
app.use(
  cors({
    origin: "*", // si quieres, aquí puedes poner la URL de tu app frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📋 Logger
app.use(morgan("dev"));

// 📝 Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ⏱ Rate limiter
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// 🚦 Rutas principales
app.use("/api/auth", authRoutes);     // login / registro admin/chofer
app.use("/api/admin", adminRoutes);   // todo lo de admin (camiones, choferes, historial tickets)
app.use("/api/driver", driverRoutes); // todo lo de chofer (perfil, camión asignado, subir tickets, alertas)
app.use("/api/reports", reportsRoutes); // reportes generales

// ✅ Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true }));

export default app;
