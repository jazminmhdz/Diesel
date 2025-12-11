// controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// Crear ticket
export const createTicket = async (req, res) => {
  try {
    const { truck, date, state, gallons, miles, pricePerGallon } = req.body;

    // Validar campos obligatorios
    if (!truck || !date || !state || !gallons || !miles || !pricePerGallon) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben llenarse" });
    }

    // Verificar camión
    const existsTruck = await Truck.findById(truck);
    if (!existsTruck) {
      return res.status(404).json({ message: "El camión no existe" });
    }

    // Foto (si viene)
    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // Crear ticket
    const ticket = await Ticket.create({
      truck,
      date,
      state,
      gallons: Number(gallons),
      miles: Number(miles),
      pricePerGallon: Number(pricePerGallon),
      photoUrl,
    });

    res.status(201).json(ticket);

  } catch (error) {
    console.error("❌ Error al crear ticket:", error);
    res.status(500).json({ message: "Error al crear el ticket" });
  }
};

// Obtener todos
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (error) {
    console.error("❌ Error al obtener tickets:", error);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};

// Obtener por ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("❌ Error al obtener ticket:", error);
    res.status(500).json({ message: "Error al obtener ticket" });
  }
};

// Actualizar ticket
export const updateTicket = async (req, res) => {
  try {
    const data = req.body;

    // Foto nueva (si se sube)
    if (req.file) {
      data.photoUrl = `/uploads/${req.file.filename}`;
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);

  } catch (error) {
    console.error("❌ Error al actualizar ticket:", error);
    res.status(500).json({ message: "Error al actualizar ticket" });
  }
};

// Eliminar ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar ticket:", error);
    res.status(500).json({ message: "Error al eliminar ticket" });
  }
};
