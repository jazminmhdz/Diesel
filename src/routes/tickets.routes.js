// src/routes/ticket.routes.js
import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} from "../controllers/ticket.controller.js";


const router = Router();

// Crear ticket
router.post("/", createTicket);

// Obtener todos los tickets
router.get("/", getTickets);

// Obtener un ticket por ID
router.get("/:id", getTicketById);

// Actualizar un ticket
router.put("/:id", updateTicket);

// Eliminar un ticket
router.delete("/:id", deleteTicket);

export default router;
