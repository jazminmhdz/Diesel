import { Router } from "express";
import multer from "multer";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// ADMIN – CRUD TICKETS
router.post("/", upload.single("photo"), createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", upload.single("photo"), updateTicket);
router.delete("/:id", deleteTicket);

export default router;
