import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import ticketRoutes from "./routes/ticket.routes.js"; // 👈 AGREGA ESTO

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);    // 👉 Para trucks, drivers, tickets
app.use("/api/reports", reportsRoutes);
app.use("/api/driver", driverRoutes);

// 👇 AGREGA LOS ENDPOINTS DE TICKETS AQUÍ
app.use("/api/admin/tickets", ticketRoutes);

export default app;
