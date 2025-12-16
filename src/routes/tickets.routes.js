// routes/ticket.routes.js
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

// 🔒 ADMIN
router.use(authMiddleware);

// CRUD
router.post("/", upload.single("photo"), createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
