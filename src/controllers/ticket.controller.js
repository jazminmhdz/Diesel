import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// =======================================
// CREATE TICKET (ADMIN)
// =======================================
export const createTicket = async (req, res) => {
  try {
    const {
      truck,
      date,
      state,
      gallons,
      miles,
      pricePerGallon,
      photoUrl,
    } = req.body;

    // Validaciones
    if (!truck || !date || !state || !gallons || !miles || !pricePerGallon) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben enviarse",
      });
    }

    // Verificar camión
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return res.status(404).json({ message: "El camión no existe" });
    }

    // Calcular MPG 🔥
    const mpg = Number(miles) / Number(gallons);

    const ticket = await Ticket.create({
      truck,
      date: new Date(date),
      state,
      gallons: Number(gallons),
      miles: Number(miles),
      pricePerGallon: Number(pricePerGallon),
      mpg,
      photoUrl: photoUrl || null,
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

// =======================================
// GET ALL
// =======================================
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

// =======================================
// GET BY ID
// =======================================
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck");
    if (!ticket)
      return res.status(404).json({ message: "Ticket no encontrado" });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ticket" });
  }
};

// =======================================
// UPDATE
// =======================================
export const updateTicket = async (req, res) => {
  try {
    const data = req.body;

    // Recalcular MPG si cambian millas o galones
    if (data.miles && data.gallons) {
      data.mpg = Number(data.miles) / Number(data.gallons);
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!ticket)
      return res.status(404).json({ message: "Ticket no encontrado" });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando ticket" });
  }
};

// =======================================
// DELETE
// =======================================
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket)
      return res.status(404).json({ message: "Ticket no encontrado" });

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando ticket" });
  }
};
