const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const User = require('../models/User');

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  async (req, res) => {
    const { email, password, expoPushToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });
    if (expoPushToken) { user.expoPushToken = expoPushToken; await user.save(); }

    // incluir driverRef en el token para facilitar acceso en rutas driver
    const token = jwt.sign({ id: user._id, role: user.role, driverRef: user.driverRef }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role, driverRef: user.driverRef });
  });

module.exports = router;
