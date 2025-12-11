// src/routes/ticket.routes.js
import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();

// Crear ticket
router.post("/", upload.single("photo"), createTicket);

// Obtener todos los tickets
router.get("/", getTickets);

// Obtener uno por ID
router.get("/:id", getTicketById);

// Actualizar ticket (también acepta nueva foto)
router.put("/:id", upload.single("photo"), updateTicket);

// Eliminar ticket
router.delete("/:id", deleteTicket);

export default router;
