import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// ======================================================
// ADMIN – CRUD DE TICKETS (CARGA DE DIESEL)
// ======================================================

// ----------------------------------------
// CREATE – Crear ticket
// ----------------------------------------
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

    if (!truck || !date || !state || !gallons || !miles || !pricePerGallon) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // Validar camión
    const existsTruck = await Truck.findById(truck);
    if (!existsTruck) {
      return res.status(404).json({ message: "Camión no encontrado" });
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
  } catch (err) {
    console.error("Error creando ticket:", err);
    res.status(500).json({ message: "Error al crear ticket" });
  }
};

// ----------------------------------------
// GET ALL – Listar todos los tickets
// ----------------------------------------
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("truck")
      .sort({ date: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Error obteniendo tickets:", err);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};

// ----------------------------------------
// GET ONE – Buscar ticket por ID
// ----------------------------------------
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("truck");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error buscando ticket:", err);
    res.status(500).json({ message: "Error al buscar ticket" });
  }
};

// ----------------------------------------
// UPDATE – Actualizar ticket
// ----------------------------------------
export const updateTicket = async (req, res) => {
  try {
    const {
      truck,
      date,
      state,
      gallons,
      miles,
      pricePerGallon,
    } = req.body;

    if (truck) {
      const existsTruck = await Truck.findById(truck);
      if (!existsTruck) {
        return res.status(404).json({ message: "Camión no encontrado" });
      }
    }

    const updateData = {
      ...(truck && { truck }),
      ...(date && { date: new Date(date) }),
      ...(state && { state }),
      ...(gallons && { gallons: Number(gallons) }),
      ...(miles && { miles: Number(miles) }),
      ...(pricePerGallon && { pricePerGallon: Number(pricePerGallon) }),
    };

    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("truck");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error actualizando ticket:", err);
    res.status(500).json({ message: "Error al actualizar ticket" });
  }
};

// ----------------------------------------
// DELETE – Eliminar ticket
// ----------------------------------------
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando ticket:", err);
    res.status(500).json({ message: "Error al eliminar ticket" });
  }
};
