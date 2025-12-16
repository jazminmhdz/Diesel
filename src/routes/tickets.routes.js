// src/routes/ticket.routes.js
import { Router } from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();

// 🔒 Solo admin
router.use(authMiddleware);

// Crear ticket
router.post("/", upload.single("photo"), createTicket);

// Listar
router.get("/", getTickets);

// Buscar por ID
router.get("/:id", getTicketById);

// Actualizar
router.put("/:id", updateTicket);

// Eliminar
router.delete("/:id", deleteTicket);

export default router;
