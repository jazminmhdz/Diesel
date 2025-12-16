// controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// =======================
// CREATE TICKET (ADMIN)
// =======================
export const createTicket = async (req, res) => {
  try {
    const { truck, date, state, gallons, miles, pricePerGallon } = req.body;

    if (!truck || !date || !state || !gallons || !miles || !pricePerGallon) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben enviarse",
      });
    }

    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return res.status(404).json({ message: "El camión no existe" });
    }

    const ticket = await Ticket.create({
      truck,
      date: new Date(date),
      state,
      gallons: Number(gallons),
      miles: Number(miles),
      pricePerGallon: Number(pricePerGallon),
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("❌ Error creando ticket:", error);
    res.status(500).json({
      message: "Error creando ticket",
      error: error.message,
    });
  }
};

// =======================
// GET ALL
// =======================
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

// =======================
// GET BY ID
// =======================
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ticket" });
  }
};

// =======================
// UPDATE
// =======================
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando ticket" });
  }
};

// =======================
// DELETE
// =======================
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando ticket" });
  }
};
