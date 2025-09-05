const router = require('express').Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const Truck = require('../models/Truck');
const Driver = require('../models/Driver');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Alta camión
router.post('/trucks', auth, roles('admin'), [
  body('economicNumber').isLength({min:1}),
  body('vin').isLength({min:6}),
  body('model').isLength({min:1}),
  body('year').isInt({min:1995, max:2100}),
  body('expectedMpgMin').optional().isFloat({min:1}),
  body('expectedMpgMax').optional().isFloat({min:1}),
], validate, async (req,res)=>{
  const truck = await Truck.create(req.body);
  res.status(201).json(truck);
});

// Alta chofer + usuario driver
router.post('/drivers', auth, roles('admin'), [
  body('name').isLength({min:3}),
  body('licenseNumber').matches(/^[A-Z0-9-]{5,20}$/i),
  body('type').isIn(['local','cruce']),
  body('email').isEmail(),
  body('password').isLength({min:6})
], validate, async (req,res)=>{
  const { name, licenseNumber, type, badge, email, password } = req.body;
  const driver = await Driver.create({ name, licenseNumber, type, badge });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role:'driver', driverRef: driver._id });
  res.status(201).json({ driver, userId: user._id });
});

// Asignar chofer a camión
router.post('/drivers/:id/assign-truck', auth, roles('admin'), [
  param('id').isMongoId(), body('truckId').isMongoId()
], validate, async (req,res)=>{
  const { id } = req.params; const { truckId } = req.body;
  const driver = await Driver.findByIdAndUpdate(id, { assignedTruck: truckId }, { new: true });
  res.json(driver);
});

module.exports = router;
