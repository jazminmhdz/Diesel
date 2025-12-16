import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// solo admin
router.use(authMiddleware);

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
