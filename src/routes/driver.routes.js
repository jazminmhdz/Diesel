const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const Driver = require('../models/Driver');
const Ticket = require('../models/Ticket');
const Alert = require('../models/Alert');

// 1) Ver perfil del chofer
router.get('/me', auth, roles('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.driverRef).populate('assignedTruck');
    if (!driver) return res.status(404).json({ error: 'Chofer no encontrado' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// 2) Ver camión asignado
router.get('/my-truck', auth, roles('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.driverRef).populate('assignedTruck');
    if (!driver || !driver.assignedTruck) {
      return res.status(404).json({ error: 'No tienes camión asignado' });
    }
    res.json(driver.assignedTruck);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener camión asignado' });
  }
});

// 3) Historial de tickets propios
router.get('/my-tickets', auth, roles('driver'), async (req, res) => {
  try {
    const tickets = await Ticket.find({ driver: req.user.driverRef })
      .sort({ date: -1 })
      .populate('truck', 'economicNumber model year');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
});

// 4) Ver alertas de su camión
router.get('/my-alerts', auth, roles('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.driverRef);
    if (!driver || !driver.assignedTruck) {
      return res.status(404).json({ error: 'No tienes camión asignado' });
    }
    const alerts = await Alert.find({ truck: driver.assignedTruck }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

module.exports = router;
