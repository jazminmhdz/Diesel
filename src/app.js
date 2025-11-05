// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

// ✅ Importar rutas
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportRoutes from "./routes/reports.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Prefijos correctos
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

// Prueba de conexión
app.get("/", (req, res) => {
  res.json({ message: "🚀 API Diesel Control funcionando" });
});

// 404 por rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

export default app;
