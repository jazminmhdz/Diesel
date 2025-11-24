import express from "express";
import {
  getAllTrucks,
  createTruck,
  updateTruck,
  deleteTruck,
} from "../controllers/truck.controller.js";

import {
  getAllTickets,
  createTicket,
  assignTruckToTicket,
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔐 Todas las rutas requieren autenticación
router.use(authMiddleware);

// ===============================
// 🚚 TRUCKS
// ===============================
router.get("/trucks", getAllTrucks);          // Obtener todos los camiones
router.post("/trucks", createTruck);          // Crear camión
router.put("/trucks/:id", updateTruck);       // Actualizar camión
router.delete("/trucks/:id", deleteTruck);    // Eliminar camión

// ===============================
// 🎫 TICKETS
// ===============================
router.get("/tickets", getAllTickets);        // Obtener tickets
router.post("/tickets", upload.single("photo"), createTicket); // Crear ticket con foto

// ===============================
// 🔗 Asignar camión a ticket
// ===============================
router.put("/assign-truck-ticket", assignTruckToTicket);

export default router;
