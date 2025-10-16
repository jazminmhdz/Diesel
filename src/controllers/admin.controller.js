import User from "../models/User.js";
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";
import bcrypt from "bcryptjs";
import path from "path";

/* ===================== 🚛 CAMIONES ===================== */

// Obtener todos los camiones
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("driver", "name");
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener camiones", error: err.message });
  }
};

// Crear camión
export const createTruck = async (req, res) => {
  try {
    const { economicNumber, vin, model, year, expectedMpgMin, expectedMpgMax } = req.body;

    if (!economicNumber || !vin || !model || !year) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const exists = await Truck.findOne({ economicNumber });
    if (exists) return res.status(400).json({ message: "Ya existe un camión con ese número económico" });

    const truck = await Truck.create({
      economicNumber,
      vin,
      model,
      year,
      expectedMpgMin: expectedMpgMin || 4,
      expectedMpgMax: expectedMpgMax || 10,
    });

    res.status(201).json(truck);
  } catch (err) {
    res.status(500).json({ message: "Error al crear camión", error: err.message });
  }
};

// Actualizar camión
export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByIdAndUpdate(id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar camión", error: err.message });
  }
};

// Eliminar camión
export const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findById(id);
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

    // Si está asignado a un chofer, lo desvinculamos
    if (truck.driver) {
      await Driver.findByIdAndUpdate(truck.driver, { assignedTruck: null });
    }

    await Truck.findByIdAndDelete(id);
    res.json({ message: "Camión eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar camión", error: err.message });
  }
};

/* ===================== 👨‍🔧 CHOFERES ===================== */

// Obtener todos los choferes
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck", "economicNumber model");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener choferes", error: err.message });
  }
};

// Crear chofer
export const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, phone, truck } = req.body;

    if (!name || !licenseNumber || !phone) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Buscar camión si se asigna uno
    let assignedTruck = null;
    if (truck) {
      const truckFound = await Truck.findById(truck);
      if (!truckFound) return res.status(400).json({ message: "Camión no encontrado" });
      if (truckFound.driver) return res.status(400).json({ message: "Camión ya está asignado" });
      assignedTruck = truckFound._id;
    }

    // Crear usuario y chofer
    const email = `${name.replace(/\s+/g, "").toLowerCase()}@diesel.local`;
    const password = await bcrypt.hash("driver123", 10);

    const user = await User.create({
      email,
      password,
      role: "driver",
    });

    const driver = await Driver.create({
      name,
      licenseNumber,
      phone,
      assignedTruck,
      userRef: user._id,
    });

    // Si tiene camión, actualizarlo
    if (assignedTruck) {
      await Truck.findByIdAndUpdate(assignedTruck, { driver: driver._id });
    }

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error al crear chofer", error: err.message });
  }
};

// Actualizar chofer
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, licenseNumber, phone, truck } = req.body;

    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    // Si se asigna un nuevo camión
    if (truck) {
      const newTruck = await Truck.findById(truck);
      if (!newTruck) return res.status(400).json({ message: "Camión no encontrado" });
      if (newTruck.driver && newTruck.driver.toString() !== driver._id.toString())
        return res.status(400).json({ message: "Camión ya está ocupado" });

      // Desvincular camión anterior
      if (driver.assignedTruck) {
        await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
      }

      // Vincular nuevo camión
      await Truck.findByIdAndUpdate(truck, { driver: driver._id });
      driver.assignedTruck = truck;
    }

    driver.name = name || driver.name;
    driver.licenseNumber = licenseNumber || driver.licenseNumber;
    driver.phone = phone || driver.phone;
    await driver.save();

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar chofer", error: err.message });
  }
};

// Eliminar chofer
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    // Desvincular camión si tiene uno
    if (driver.assignedTruck) {
      await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
    }

    // Eliminar usuario asociado
    if (driver.userRef) {
      await User.findByIdAndDelete(driver.userRef);
    }

    await Driver.findByIdAndDelete(id);
    res.json({ message: "Chofer eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar chofer", error: err.message });
  }
};

/* ===================== 🎟️ TICKETS ===================== */

// Obtener todos los tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("driver", "name")
      .populate("truck", "economicNumber");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tickets", error: err.message });
  }
};

// Crear ticket
export const createTicket = async (req, res) => {
  try {
    const { truckNumber, gallons, miles, state, pricePerGallon } = req.body;

    if (!truckNumber || !gallons || !miles || !state) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const truck = await Truck.findOne({ economicNumber: truckNumber }).populate("driver");
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    if (!truck.driver) return res.status(400).json({ message: "El camión no tiene chofer asignado" });

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const mpg = (miles / gallons).toFixed(2);

    const ticket = await Ticket.create({
      driver: truck.driver._id,
      truck: truck._id,
      photoUrl,
      date: new Date(),
      state,
      gallons,
      miles,
      pricePerGallon: pricePerGallon || 0,
      mpg,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error al crear ticket", error: err.message });
  }
};
