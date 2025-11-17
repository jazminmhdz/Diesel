// src/controllers/admin.controller.js
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";

// ----------------------- TRUCKS -----------------------
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    console.error("Error getAllTrucks:", err);
    res.status(500).json({ message: "Error obteniendo camiones" });
  }
};

export const createTruck = async (req, res) => {
  try {
    const { numeroSerie, economico, marca, modelo, anio } = req.body;

    if (!numeroSerie || !economico || !marca || !modelo || !anio) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (await Truck.findOne({ numeroSerie })) {
      return res.status(409).json({ message: "El número de serie ya está registrado" });
    }
    if (await Truck.findOne({ economico })) {
      return res.status(409).json({ message: "El número económico ya está registrado" });
    }

    const truck = await Truck.create({
      numeroSerie,
      economico,
      marca,
      modelo,
      anio,
    });

    res.status(201).json(truck);
  } catch (err) {
    console.error("Error createTruck:", err);
    res.status(500).json({ message: "Error creando camión" });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.numeroSerie) {
      const exists = await Truck.findOne({ numeroSerie: update.numeroSerie, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Otro camión ya tiene ese número de serie" });
    }
    if (update.economico) {
      const exists = await Truck.findOne({ economico: update.economico, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Otro camión ya tiene ese número económico" });
    }

    const truck = await Truck.findByIdAndUpdate(id, update, { new: true });
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json(truck);
  } catch (err) {
    console.error("Error updateTruck:", err);
    res.status(500).json({ message: "Error actualizando camión" });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const deleted = await Truck.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Camión no encontrado" });
    res.json({ message: "Camión eliminado" });
  } catch (err) {
    console.error("Error deleteTruck:", err);
    res.status(500).json({ message: "Error eliminando camión" });
  }
};

// ----------------------- TICKETS -----------------------
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
    // Aceptar tanto keys en español como en inglés
    const body = req.body || {};
    const miles = body.miles ?? body.millas ?? null;
    const gallons = body.gallons ?? body.galones ?? null;
    const state = body.state ?? body.estado ?? null;
    const date = body.date ?? body.fecha ?? null;
    const truckId = body.truckId ?? body.truck ?? null;

    if (!miles || !gallons || !state) {
      return res.status(400).json({ message: "Miles/gallons/state (o millas/galones/estado) son obligatorios" });
    }

    // Validar camión si viene
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
      date: date ? new Date(date) : undefined,
      photoUrl,
      truck: truckId || null,
      mpg,
    });

    // poblar truck para devolver
    await ticket.populate("truck").execPopulate?.() || await ticket.populate("truck");

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error createTicket:", err);
    res.status(500).json({ message: "Error creando ticket" });
  }
};

// ----------------------- ASIGNAR CAMIÓN A TICKET -----------------------
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
