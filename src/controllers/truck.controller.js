// src/controllers/truck.controller.js
import Truck from "../models/Truck.js";

// Obtener todos los camiones
export const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    console.error("Error getTrucks:", err);
    res.status(500).json({ message: "Error obteniendo camiones" });
  }
};

// Crear camión
export const createTruck = async (req, res) => {
  try {
    const { numeroSerie, economico, marca, modelo, anio, platesMx, platesUsa } = req.body;

    if (!numeroSerie || !economico || !marca || !modelo || !anio) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar duplicados
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
      platesMx: platesMx || "",
      platesUsa: platesUsa || "",
    });

    res.status(201).json(truck);
  } catch (err) {
    console.error("Error createTruck:", err);
    res.status(500).json({ message: "Error creando camión" });
  }
};

// Actualizar camión
export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Validar duplicados excepto el mismo
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

// Eliminar camión
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
