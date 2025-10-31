// src/controllers/admin.controller.js
import Truck from "../models/Truck.js";
import Driver from "../models/Driver.js";
import Ticket from "../models/Ticket.js";

/* =====================================================
   🚛 CAMIONES
===================================================== */
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener camiones", error: error.message });
  }
};

export const createTruck = async (req, res) => {
  try {
    const newTruck = new Truck(req.body);
    await newTruck.save();
    res.status(201).json({ message: "Camión creado correctamente", newTruck });
  } catch (error) {
    res.status(500).json({ message: "Error al crear camión", error: error.message });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json({ message: "Camión actualizado correctamente", truck });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar camión", error: error.message });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json({ message: "Camión eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar camión", error: error.message });
  }
};

/* =====================================================
   👨‍🔧 CHOFERES
===================================================== */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck", "economicNumber brand platesMx");
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener choferes", error: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { fullName, licenseNumber, driverType, badge } = req.body;

    if (!fullName || !licenseNumber || !driverType)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const driver = new Driver({ fullName, licenseNumber, driverType, badge });
    await driver.save();
    res.status(201).json({ message: "Chofer creado correctamente", driver });
  } catch (error) {
    res.status(500).json({ message: "Error al crear chofer", error: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });
    res.json({ message: "Chofer actualizado correctamente", driver });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar chofer", error: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });
    res.json({ message: "Chofer eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar chofer", error: error.message });
  }
};

/* =====================================================
   🎟️ TICKETS
===================================================== */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("truck", "economicNumber");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tickets", error: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { truck, gallons, miles, date, state } = req.body;

    if (!truck || !gallons || !miles)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const mpg = (miles / gallons).toFixed(2);
    const ticket = new Ticket({
      truck,
      gallons,
      miles,
      date: date || new Date(),
      state: state || "pendiente",
      mpg,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await ticket.save();
    res.status(201).json({ message: "Ticket creado correctamente", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error al crear ticket", error: error.message });
  }
};

/* =====================================================
   🚚 ASIGNACIONES DE CAMIÓN
===================================================== */
export const assignTruckToDriver = async (req, res) => {
  try {
    const { driverId, truckId } = req.body;

    if (!driverId || !truckId)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const driver = await Driver.findById(driverId);
    const truck = await Truck.findById(truckId);

    if (!driver || !truck)
      return res.status(404).json({ message: "Chofer o camión no encontrado" });

    if (truck.assigned)
      return res.status(400).json({ message: "Este camión ya está asignado" });

    driver.assignedTruck = truck._id;
    truck.assigned = true;

    await driver.save();
    await truck.save();

    res.json({ message: "Camión asignado correctamente", driver, truck });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar camión", error: error.message });
  }
};

/* =====================================================
   🚛 LIBERAR CAMIÓN DE CHOFER
===================================================== */
export const unassignTruckFromDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    if (!driverId) {
      return res.status(400).json({ message: "Se requiere el ID del chofer." });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado." });

    const truckId = driver.assignedTruck;
    if (!truckId) return res.status(400).json({ message: "Este chofer no tiene camión asignado." });

    await Truck.findByIdAndUpdate(truckId, { assigned: false });

    driver.assignedTruck = null;
    await driver.save();

    res.json({ message: "Camión liberado correctamente.", driverId });
  } catch (error) {
    res.status(500).json({ message: "Error liberando camión.", error: error.message });
  }
};

/* =====================================================
   🚚 CONSULTAR ASIGNACIONES (Chofer ↔ Camión)
===================================================== */
export const getTruckAssignments = async (req, res) => {
  try {
    const assignments = await Driver.find({ assignedTruck: { $ne: null } })
      .populate("assignedTruck", "economicNumber brand platesMx year");

    const formatted = assignments.map((d) => ({
      driverId: d._id,
      fullName: d.fullName,
      licenseNumber: d.licenseNumber,
      driverType: d.driverType,
      truck: d.assignedTruck
        ? {
            truckId: d.assignedTruck._id,
            economicNumber: d.assignedTruck.economicNumber,
            brand: d.assignedTruck.brand,
            platesMx: d.assignedTruck.platesMx,
            year: d.assignedTruck.year,
          }
        : null,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo asignaciones.", error: error.message });
  }
};
