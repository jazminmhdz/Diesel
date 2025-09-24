import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// Configuración multer (subida local)
const upload = multer({ dest: "uploads/" });

// POST /api/tickets
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Solo drivers" });
  }

  const { date, state, gallons, miles, pricePerGallon } = req.body;

  const ticket = new Ticket({
    driver: req.user.id,
    photo: req.file.path,
    date,
    state,
    gallons,
    miles,
    pricePerGallon,
  });

  await ticket.save();
  res.json(ticket);
});

export default router;
