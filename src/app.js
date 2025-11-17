import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import reportsRoutes from "./routes/reports.routes.js"; // 🔥 AQUI

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reports", reportsRoutes); // 🔥 AQUI SE ACTIVA

export default app;
