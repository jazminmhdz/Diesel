import express from "express";
import {
  getAllTrucks,
  createTruck,
  updateTruck,
  deleteTruck,
} from "../controllers/truck.controller.js"; // ahora apuntan aquí

import {
  getAllTickets,
  createTicket,
  assignTruckToTicket,
} from "../controllers/admin.controller.js"; // si mantienes admin.controller para tickets

import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.use(authMiddleware);

// Trucks
router.get("/trucks", getAllTrucks);
router.post("/trucks", createTruck);
router.put("/trucks/:id", updateTruck);
router.delete("/trucks/:id", deleteTruck);

// Tickets (ejemplo)
router.get("/tickets", getAllTickets);
router.post("/tickets", upload.single("photo"), createTicket);

// Asignar camión a ticket
router.put("/assign-truck-ticket", assignTruckToTicket);

export default router;
