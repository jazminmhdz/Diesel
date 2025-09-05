const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const driverRoutes = require('./routes/driver.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// rate limiter simple para proteger endpoints
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/reports', reportsRoutes);

// Healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
