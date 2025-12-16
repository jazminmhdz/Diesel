import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();

router.use(authMiddleware);

// CRUD ADMIN
router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
