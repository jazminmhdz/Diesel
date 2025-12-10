// src/controllers/admin.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// Tickets (admin)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (err) {
    console.error("Error getAllTickets:", err);
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const body = req.body || {};
    const miles = body.miles ?? body.millas ?? null;
    const gallons = body.gallons ?? body.galones ?? null;
    const state = body.state ?? body.estado ?? null;
    const date = body.date ?? body.fecha ?? null;
    const truckId = body.truckId ?? body.truck ?? null;

    if (!miles || !gallons || !state) {
      return res.status(400).json({ message: "Miles/gallons/state (o millas/galones/estado) son obligatorios" });
    }

    if (truckId) {
      const truck = await Truck.findById(truckId);
      if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    }

    const mpg = Number(gallons) > 0 ? Number(miles) / Number(gallons) : 0;
    const photoUrl = req.file?.path || body.photoUrl || null;

    const ticket = await Ticket.create({
      miles: Number(miles),
      gallons: Number(gallons),
      state: String(state).toUpperCase(),
      date: date ? new Date(date) : new Date(),
      photoUrl,
      truck: truckId || null,
      mpg,
    });

    await ticket.populate("truck");

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error createTicket:", err);
    res.status(500).json({ message: "Error creando ticket" });
  }
};

export const assignTruckToTicket = async (req, res) => {
  try {
    const { ticketId, truckId } = req.body;
    if (!ticketId || !truckId) return res.status(400).json({ message: "ticketId y truckId son requeridos" });

    const ticket = await Ticket.findById(ticketId);
    const truck = await Truck.findById(truckId);
    if (!ticket || !truck) return res.status(404).json({ message: "Ticket o camión no encontrado" });

    ticket.truck = truckId;
    await ticket.save();
    await ticket.populate("truck");

    res.json({ message: "Camión asignado al ticket correctamente", ticket });
  } catch (err) {
    console.error("Error assignTruckToTicket:", err);
    res.status(500).json({ message: "Error asignando camión al ticket" });
  }
};
