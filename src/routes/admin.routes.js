// src/routes/admin.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";
import upload from "../middleware/upload.js";

import {
  getAllTickets,
  createTicket,
  assignTruckToTicket
} from "../controllers/admin.controller.js";

import trucksRouter from "./trucks.routes.js";

const router = express.Router();

// 🔐 Todas las rutas requieren login y rol admin
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// ===============================
// 🚚 Montar Trucks
// ===============================
router.use("/trucks", trucksRouter);

// ===============================
// 🎫 Tickets
// ===============================
router.get("/tickets", getAllTickets);
router.post("/tickets", upload.single("photo"), createTicket);

// 🔗 Asignar camión a ticket
router.put("/assign-truck-ticket", assignTruckToTicket);

export default router;
