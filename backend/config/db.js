const mongoose = require('mongoose');

// Never buffer commands: always fail-fast so mockStore can handle the request immediately
mongoose.set('bufferCommands', false);

let dbConnectionAttempted = false;

const connectDB = async () => {
  // If already connected, nothing to do
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If no external MONGODB_URI is configured, run directly in hardcoded mockStore mode
  if (!process.env.MONGODB_URI) {
    if (!dbConnectionAttempted) {
      console.log('[ParkEase DB] No MONGODB_URI configured. Running in standalone hardcoded store mode for Bengaluru & Mumbai facilities.');
      dbConnectionAttempted = true;
    }
    return;
  }

  if (dbConnectionAttempted) return;
  dbConnectionAttempted = true;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
      bufferCommands: false
    });
    console.log(`[ParkEase DB] Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[ParkEase DB] Notice: MongoDB connection failed (${err.message}). Using in-memory hardcoded store for Bengaluru & Mumbai.`);
  }
};

module.exports = connectDB;

