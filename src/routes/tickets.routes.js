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

// Crear ticket (acepta foto opcional)
router.post("/", upload.single("photo"), createTicket);

// Obtener todos
router.get("/", getTickets);

// Obtener por ID
router.get("/:id", getTicketById);

// Actualizar ticket
router.put("/:id", updateTicket);

// Eliminar ticket
router.delete("/:id", deleteTicket);

export default router;
