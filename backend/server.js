require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Ensure database connection is ready for incoming requests on serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[ParkEase DB Middleware]', err.message);
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/seed', require('./routes/seed'));

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    mode: mongoose.connection.readyState === 1 ? 'mongodb' : 'hardcoded_store',
    dbState: mongoose.connection.readyState,
    time: new Date()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`ParkEase backend running on port ${PORT}`));
}

module.exports = app;
