// src/controllers/admin.controller.js
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";

// ===============================
// 📋 CONTROLADOR DEL ADMINISTRADOR
// ===============================
export const adminController = {
  // 📌 Obtener todos los choferes
  async getDrivers(req, res) {
    try {
      const drivers = await Driver.find().populate("assignedTruck", "economicNumber model");
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo choferes", error: err.message });
    }
  },

  // ➕ Crear nuevo chofer
  async createDriver(req, res) {
    try {
      const { name, licenseNumber, type, badge } = req.body;

      if (!name || !licenseNumber || !type) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const exists = await Driver.findOne({ licenseNumber });
      if (exists) return res.status(400).json({ message: "Ya existe un chofer con esa licencia" });

      const driver = await Driver.create({ name, licenseNumber, type, badge: badge || "" });
      res.json({ message: "Chofer creado correctamente", driver });
    } catch (err) {
      res.status(500).json({ message: "Error creando chofer", error: err.message });
    }
  },

  // ✏️ Editar chofer
  async updateDriver(req, res) {
    try {
      const { id } = req.params;
      const { name, licenseNumber, type, badge } = req.body;

      const driver = await Driver.findByIdAndUpdate(
        id,
        { name, licenseNumber, type, badge },
        { new: true }
      );

      if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

      res.json({ message: "Chofer actualizado correctamente", driver });
    } catch (err) {
      res.status(500).json({ message: "Error actualizando chofer", error: err.message });
    }
  },

  // ❌ Eliminar chofer
  async deleteDriver(req, res) {
    try {
      const { id } = req.params;
      const driver = await Driver.findById(id);
      if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

      // Liberar camión si estaba asignado
      if (driver.assignedTruck) {
        await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
      }

      await driver.deleteOne();
      res.json({ message: "Chofer eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ message: "Error eliminando chofer", error: err.message });
    }
  },

  // 🚛 Obtener todos los camiones
  async getTrucks(req, res) {
    try {
      const trucks = await Truck.find().populate("driver", "name");
      res.json(trucks);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo camiones", error: err.message });
    }
  },

  // ➕ Crear nuevo camión
  async createTruck(req, res) {
    try {
      const { economicNumber, vin, model, year, plateMx, plateUsa } = req.body;

      if (!economicNumber || !vin || !model) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const exists = await Truck.findOne({ economicNumber });
      if (exists) return res.status(400).json({ message: "Ya existe un camión con ese número económico" });

      const truck = await Truck.create({ economicNumber, vin, model, year, plateMx, plateUsa });
      res.json({ message: "Camión creado correctamente", truck });
    } catch (err) {
      res.status(500).json({ message: "Error creando camión", error: err.message });
    }
  },

  // ✏️ Editar camión
  async updateTruck(req, res) {
    try {
      const { id } = req.params;
      const { economicNumber, vin, model, year, plateMx, plateUsa } = req.body;

      const truck = await Truck.findByIdAndUpdate(
        id,
        { economicNumber, vin, model, year, plateMx, plateUsa },
        { new: true }
      );

      if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
      res.json({ message: "Camión actualizado correctamente", truck });
    } catch (err) {
      res.status(500).json({ message: "Error actualizando camión", error: err.message });
    }
  },

  // ❌ Eliminar camión
  async deleteTruck(req, res) {
    try {
      const { id } = req.params;
      const truck = await Truck.findById(id);
      if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

      // Liberar chofer si estaba asignado
      if (truck.driver) {
        await Driver.findByIdAndUpdate(truck.driver, { assignedTruck: null });
      }

      await truck.deleteOne();
      res.json({ message: "Camión eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ message: "Error eliminando camión", error: err.message });
    }
  },

  // 🔄 Asignar camión a chofer
  async assignTruck(req, res) {
    try {
      const { driverId, truckId } = req.body;

      const driver = await Driver.findById(driverId);
      const truck = await Truck.findById(truckId);

      if (!driver || !truck)
        return res.status(404).json({ message: "Chofer o camión no encontrados" });

      if (truck.driver && truck.driver.toString() !== driverId)
        return res.status(400).json({ message: "El camión ya está asignado a otro chofer" });

      // Si el chofer tenía otro camión, liberarlo
      if (driver.assignedTruck && driver.assignedTruck.toString() !== truckId) {
        await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
      }

      // Asignar relación mutua
      driver.assignedTruck = truck._id;
      truck.driver = driver._id;

      await driver.save();
      await truck.save();

      res.json({ message: "Camión asignado correctamente", driver, truck });
    } catch (err) {
      res.status(500).json({ message: "Error asignando camión", error: err.message });
    }
  },

  // 📊 Ver todos los tickets
  async getTickets(req, res) {
    try {
      const tickets = await Ticket.find()
        .populate("driver", "name")
        .populate("truck", "economicNumber");
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo tickets", error: err.message });
    }
  },
};
