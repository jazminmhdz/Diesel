import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";

// ===============================================================
// 🚛 TRUCKS
// ===============================================================
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo camiones" });
  }
};

export const createTruck = async (req, res) => {
  try {
    const { numeroSerie, economico, marca, modelo, anio } = req.body;

    if (!numeroSerie || !economico || !marca || !modelo || !anio) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // ❌ Validar duplicados
    const existsSerie = await Truck.findOne({ numeroSerie });
    if (existsSerie) {
      return res.status(409).json({ message: "El número de serie ya está registrado" });
    }

    const existsEco = await Truck.findOne({ economico });
    if (existsEco) {
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
    res.status(500).json({ message: "Error al crear camión" });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const { numeroSerie, economico } = req.body;

    // ❌ Validación de duplicados excepto el mismo camión
    const existsSerie = await Truck.findOne({ numeroSerie, _id: { $ne: id } });
    if (existsSerie) {
      return res.status(409).json({ message: "Otro camión ya tiene ese número de serie" });
    }

    const existsEco = await Truck.findOne({ economico, _id: { $ne: id } });
    if (existsEco) {
      return res.status(409).json({ message: "Otro camión ya tiene ese número económico" });
    }

    const truck = await Truck.findByIdAndUpdate(id, req.body, { new: true });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando camión" });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    await Truck.findByIdAndDelete(req.params.id);
    res.json({ message: "Camión eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando camión" });
  }
};

// ===============================================================
// 🎟️ TICKETS
// ===============================================================
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { miles, gallons, state, date } = req.body;

    if (!miles || !gallons || !state) {
      return res.status(400).json({ message: "Miles, gallons y state son obligatorios" });
    }

    const photoUrl = req.file?.path || null;

    const ticket = await Ticket.create({
      ...req.body,
      photoUrl,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error creando ticket" });
  }
};

// ===============================================================
// 🔗 ASIGNAR CAMIÓN A TICKET
// ===============================================================
export const assignTruckToTicket = async (req, res) => {
  try {
    const { ticketId, truckId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    const truck = await Truck.findById(truckId);

    if (!ticket || !truck) {
      return res.status(404).json({ message: "Ticket o camión no encontrado" });
    }

    ticket.truck = truckId;
    await ticket.save();

    res.json({ message: "Camión asignado al ticket correctamente", ticket });
  } catch (err) {
    res.status(500).json({ message: "Error asignando camión al ticket" });
  }
};
