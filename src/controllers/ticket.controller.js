// src/controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// ============================
// CREATE – Crear ticket (ADMIN)
// ============================
export const createTicket = async (req, res) => {
  try {
    const {
      truck,
      date,
      state,
      gallons,
      miles,
      pricePerGallon,
    } = req.body;

    // Validaciones
    if (!truck || !date || !state || !gallons || !miles || !pricePerGallon) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben llenarse",
      });
    }

    // Validar camión
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return res.status(404).json({ message: "El camión no existe" });
    }

    // Crear ticket
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
    res.status(500).json({ message: "Error creando ticket" });
  }
};

// ============================
// GET ALL – Listar tickets
// ============================
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};

// ============================
// GET ONE – Ticket por ID
// ============================
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ticket" });
  }
};

// ============================
// UPDATE – Actualizar ticket
// ============================
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
    console.error(error);
    res.status(500).json({ message: "Error al actualizar ticket" });
  }
};

// ============================
// DELETE – Eliminar ticket
// ============================
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar ticket" });
  }
};
