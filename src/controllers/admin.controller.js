import Driver from "../models/Driver.js";
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

    // ❌ validar duplicados
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
// 👨‍🔧 DRIVERS
// ===============================================================
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("truckAssigned");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo choferes" });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { nombre, numLicencia, numGafete } = req.body;

    if (!nombre || !numLicencia || !numGafete) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // ❌ duplicados
    const existsLic = await Driver.findOne({ numLicencia });
    if (existsLic) {
      return res.status(409).json({ message: "La licencia ya está registrada" });
    }

    const existsGaf = await Driver.findOne({ numGafete });
    if (existsGaf) {
      return res.status(409).json({ message: "El gafete ya está registrado" });
    }

    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error creando chofer" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { numLicencia, numGafete } = req.body;

    const existsLic = await Driver.findOne({ numLicencia, _id: { $ne: id } });
    if (existsLic) {
      return res.status(409).json({ message: "Ya existe otro chofer con esta licencia" });
    }

    const existsGaf = await Driver.findOne({ numGafete, _id: { $ne: id } });
    if (existsGaf) {
      return res.status(409).json({ message: "Ya existe otro chofer con este gafete" });
    }

    const driver = await Driver.findByIdAndUpdate(id, req.body, { new: true });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando chofer" });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Chofer eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando chofer" });
  }
};

// ===============================================================
// 🎟️ TICKETS
// ===============================================================
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck driver");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { millas, galones, estado, fecha } = req.body;

    if (!millas || !galones || !estado || !fecha) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const photo = req.file?.path || null;

    const ticket = await Ticket.create({ ...req.body, photo });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error creando ticket" });
  }
};

// ===============================================================
// 🚚 ASSIGN TRUCK
// ===============================================================
export const assignTruckToDriver = async (req, res) => {
  try {
    const { driverId, truckId } = req.body;

    const truck = await Truck.findById(truckId);
    const driver = await Driver.findById(driverId);

    if (!truck || !driver) {
      return res.status(404).json({ message: "Camión o chofer no encontrado" });
    }

    // ❌ Camión ya asignado
    if (truck.assignedTo) {
      return res.status(409).json({ message: "El camión ya está asignado a otro chofer" });
    }

    // ❌ Chofer ya tiene camión
    if (driver.truckAssigned) {
      return res.status(409).json({ message: "El chofer ya tiene un camión asignado" });
    }

    truck.assignedTo = driver._id;
    driver.truckAssigned = truck._id;

    await truck.save();
    await driver.save();

    res.json({ message: "Camión asignado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error asignando camión" });
  }
};

export const unassignTruckFromDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const driver = await Driver.findById(driverId).populate("truckAssigned");
    if (!driver || !driver.truckAssigned) {
      return res.status(404).json({ message: "El chofer no tiene camión asignado" });
    }

    const truck = await Truck.findById(driver.truckAssigned._id);

    truck.assignedTo = null;
    driver.truckAssigned = null;

    await truck.save();
    await driver.save();

    res.json({ message: "Camión desasignado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error desasignando camión" });
  }
};

export const getTruckAssignments = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("assignedTo");
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo asignaciones" });
  }
};
