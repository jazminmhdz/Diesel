const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const upload = require('../services/upload.service');
const Ticket = require('../models/Ticket');
const Driver = require('../models/Driver');
const Truck = require('../models/Truck');
const Alert = require('../models/Alert');
const User = require('../models/User');

router.post('/', auth, roles('driver'),
  upload.single('photo'),
  body('date').isISO8601(),
  body('state').isLength({min:2,max:2}),
  body('gallons').isFloat({gt:0}),
  body('miles').isFloat({min:0}),
  body('pricePerGallon').optional().isFloat({min:0}),
  validate,
  async (req,res)=>{
    // obtener user (token incluye driverRef)
    const userId = req.user.id;
    const user = await User.findById(userId).populate({ path: 'driverRef', populate: { path: 'assignedTruck' }});
    const driver = user.driverRef;
    if(!driver || !driver.assignedTruck) return res.status(400).json({error:'Chofer sin camión asignado'});

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if(!photoUrl) return res.status(422).json({error:'Foto requerida'});

    const ticket = await Ticket.create({
      driver: driver._id,
      truck: driver.assignedTruck._id,
      photoUrl,
      date: req.body.date,
      state: req.body.state.toUpperCase(),
      gallons: Number(req.body.gallons),
      miles: Number(req.body.miles),
      pricePerGallon: req.body.pricePerGallon ? Number(req.body.pricePerGallon) : undefined
    });

    // Reglas de alerta
    const { expectedMpgMin, expectedMpgMax } = driver.assignedTruck;
    if (expectedMpgMin && ticket.mpg < expectedMpgMin) {
      await Alert.create({ truck: driver.assignedTruck._id, ticket: ticket._id, type:'LOW_MPG', value: ticket.mpg, min: expectedMpgMin });
      // aquí enviar push a admins
    } else if (expectedMpgMax && ticket.mpg > expectedMpgMax) {
      await Alert.create({ truck: driver.assignedTruck._id, ticket: ticket._id, type:'HIGH_MPG', value: ticket.mpg, max: expectedMpgMax });
    }

    res.status(201).json(ticket);
});

module.exports = router;
