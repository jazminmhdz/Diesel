// src/controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";

// Crear un ticket
export const createTicket = async (req, res) => {
  try {
    const { driver, truck, gallons, miles, pricePerGallon, state, photoUrl } =
      req.body;

    if (!driver || !truck || !gallons || !miles || !state) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Validar que driver exista
    const driverExists = await Driver.findById(driver);
    if (!driverExists) {
      return res.status(404).json({ message: "Driver no encontrado" });
    }

    // Validar que truck exista
    const truckExists = await Truck.findById(truck);
    if (!truckExists) {
      return res.status(404).json({ message: "Truck no encontrado" });
    }

    // Calcular MPG si los datos existen
    const mpg = gallons > 0 ? miles / gallons : 0;

    const newTicket = await Ticket.create({
      driver,
      truck,
      gallons,
      miles,
      pricePerGallon: pricePerGallon || 0,
      state,
      photoUrl,
      mpg,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Error creando ticket:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("driver", "name email")
      .populate("truck", "plate brand model");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};

// Obtener un ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("driver", "name email")
      .populate("truck", "plate brand model");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el ticket" });
  }
};

// Actualizar ticket
export const updateTicket = async (req, res) => {
  try {
    const data = req.body;

    // Recalcular MPG si cambian los valores
    if (data.gallons && data.miles) {
      data.mpg = data.miles / data.gallons;
    }

    const updated = await Ticket.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el ticket" });
  }
};

// Eliminar ticket
export const deleteTicket = async (req, res) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ticket" });
  }
};
