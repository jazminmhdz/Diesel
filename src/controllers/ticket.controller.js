// src/controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";
import Driver from "../models/Driver.js";

/**
 * Crear ticket (admin)
 * Acepta cuerpo con keys en inglés o español:
 * - miles o millas
 * - gallons o galones
 * - state o estado
 * - date o fecha
 * - truckId o truck
 * - driverId o driver (opcional si no se usa)
 * - photoUrl (o se toma de req.file en route si usas multer)
 */
export const createTicket = async (req, res) => {
  try {
    const body = req.body || {};

    // soportar nombres distintos (frontend puede enviar millas/galones/estado)
    const miles = Number(body.miles || body.millas || body.millasValue || 0);
    const gallons = Number(body.gallons || body.galones || body.gallonsValue || 0);
    const state = (body.state || body.estado || "").toUpperCase();
    const date = body.date || body.fecha || body.createdAt || Date.now();
    const truckId = body.truckId || body.truck || body.camionId;
    const driverId = body.driverId || body.driver || null;

    if (!miles || !gallons || !state || !truckId) {
      return res.status(400).json({ message: "Faltan campos obligatorios (miles/gallons/state/truckId)" });
    }

    // validar truck
    const truck = await Truck.findById(truckId);
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

    // si envían driver, validar
    if (driverId) {
      const driver = await Driver.findById(driverId);
      if (!driver) return res.status(404).json({ message: "Chofer indicado no encontrado" });
    }

    const mpg = gallons > 0 ? Number((miles / gallons).toFixed(2)) : null;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : body.photoUrl || null;

    const ticket = await Ticket.create({
      driver: driverId,
      truck: truckId,
      miles,
      gallons,
      pricePerGallon: Number(body.pricePerGallon || body.pricePerGallon || 0),
      state,
      date,
      photoUrl,
      mpg,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error createTicket:", err);
    res.status(500).json({ message: "Error creando ticket", error: err.message });
  }
};

/**
 * Obtener todos los tickets (popula truck)
 */
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck").populate("driver");
    res.json(tickets);
  } catch (err) {
    console.error("Error getTickets:", err);
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

/**
 * Obtener por id
 */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck").populate("driver");
    if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });
    res.json(ticket);
  } catch (err) {
    console.error("Error getTicketById:", err);
    res.status(500).json({ message: "Error obteniendo ticket" });
  }
};

/**
 * Actualizar ticket
 * Acepta los mismos campos que createTicket (milla/gallon mapping)
 */
export const updateTicket = async (req, res) => {
  try {
    const body = req.body || {};

    const update = {};

    if (body.miles || body.millas) update.miles = Number(body.miles || body.millas);
    if (body.gallons || body.galones) update.gallons = Number(body.gallons || body.galones);
    if (body.state || body.estado) update.state = (body.state || body.estado).toUpperCase();
    if (body.date || body.fecha) update.date = body.date || body.fecha;
    if (body.truckId || body.truck) update.truck = body.truckId || body.truck;
    if (body.driverId || body.driver) update.driver = body.driverId || body.driver;
    if (body.pricePerGallon) update.pricePerGallon = Number(body.pricePerGallon);

    if (update.gallons && update.miles) {
      update.mpg = update.miles / update.gallons;
    }

    const updated = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "Ticket no encontrado" });

    res.json(updated);
  } catch (err) {
    console.error("Error updateTicket:", err);
    res.status(500).json({ message: "Error actualizando ticket" });
  }
};

/**
 * Eliminar ticket
 */
export const deleteTicket = async (req, res) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ticket no encontrado" });
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    console.error("Error deleteTicket:", err);
    res.status(500).json({ message: "Error eliminando ticket" });
  }
};
