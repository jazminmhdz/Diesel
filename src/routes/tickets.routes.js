// src/routes/ticket.routes.js
import { Router } from "express";
import multer from "multer";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Rutas públicas/administrativas según tu diseño:
// - Si quieres que solo admin cree/gestione tickets, protege con authMiddleware + roleMiddleware("admin")
// - Si quieres permitir que drivers suban tickets, protege con roleMiddleware("driver") para ese endpoint.
// Aquí dejo la versión que protege creación/edición/eliminación para admin.
// Si en tu app el admin es quien registra tickets, está OK.

router.get("/", authMiddleware, getTickets);
router.get("/:id", authMiddleware, getTicketById);

// Crear ticket (admin) con foto opcional
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("photo"), createTicket);

// Actualizar ticket (admin)
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateTicket);

// Eliminar ticket (admin)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTicket);

export default router;
