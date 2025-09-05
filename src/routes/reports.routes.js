const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const Ticket = require('../models/Ticket');
const Alert = require('../models/Alert');
const mongoose = require('mongoose');

router.get('/truck/:truckId', auth, roles('admin'), async (req,res)=>{
  const { truckId } = req.params;
  const tickets = await Ticket.find({ truck: truckId }).sort({ date: -1 }).populate('driver','name licenseNumber');
  res.json(tickets);
});

router.get('/truck/:truckId/weekly', auth, roles('admin'), async (req,res)=>{
  const { truckId } = req.params;
  const data = await Ticket.aggregate([
    { $match: { truck: mongoose.Types.ObjectId(truckId) } },
    { $group: {
      _id: { $isoWeek: '$date' },
      gallons: { $sum: '$gallons' },
      miles: { $sum: '$miles' },
      avgMpg: { $avg: '$mpg' },
      count: { $sum: 1 }
    }},
    { $sort: { '_id': -1 } }
  ]);
  res.json(data);
});

router.get('/state/:code', auth, roles('admin'), async (req,res)=>{
  const { code } = req.params;
  const byState = await Ticket.find({ state: code.toUpperCase() }).sort({ date: -1 });
  res.json(byState);
});

router.get('/alerts', auth, roles('admin'), async (req,res)=>{
  const alerts = await Alert.find().sort({ createdAt: -1 }).populate('truck','economicNumber').populate('ticket','mpg date');
  res.json(alerts);
});

module.exports = router;
