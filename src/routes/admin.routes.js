// src/routes/admin.routes.js
import express from "express";
import {
  getAllTrucks,
  createTruck,
  updateTruck,
  deleteTruck,

  getAllTickets,
  createTicket,
  assignTruckToTicket, // 🔥 NUEVO

} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔐 Todas las rutas requieren admin
router.use(authMiddleware);

//
// 🚛 CAMIONES
//
router.get("/trucks", getAllTrucks);
router.post("/trucks", createTruck);
router.put("/trucks/:id", updateTruck);
router.delete("/trucks/:id", deleteTruck);

//
// 🎟️ TICKETS
//
router.get("/tickets", getAllTickets);
router.post("/tickets", upload.single("photo"), createTicket);

//
// 🔗 ASIGNAR CAMIÓN A TICKET (NUEVO)
//
router.put("/assign-truck-ticket", assignTruckToTicket);

export default router;
