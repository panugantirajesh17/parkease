const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkease';
  
  // Try connecting to existing local/configured MongoDB with a short timeout
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[ParkEase DB] Connected to external MongoDB: ${conn.connection.host}`);
    
    // Auto-seed if database is empty
    try {
      const Facility = require('../models/Facility');
      const count = await Facility.countDocuments();
      if (count === 0) {
        console.log('[ParkEase DB] Empty database detected. Auto-seeding initial demonstration facilities and slots...');
        const { seedInitialData } = require('../services/seedService');
        await seedInitialData();
        console.log('[ParkEase DB] Auto-seed complete!');
      }
    } catch (seedErr) {
      console.warn('[ParkEase DB] Auto-seed check notice:', seedErr.message);
    }
    return;
  } catch (err) {
    console.log(`[ParkEase DB] External/Local MongoDB unavailable (${err.message}). Starting MongoMemoryServer for standalone demo...`);
  }

  // Fallback: Start an in-memory MongoDB instance
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[ParkEase DB] In-Memory MongoDB Started at ${memoryUri}`);

    // Auto-seed demo data if empty
    setTimeout(async () => {
      try {
        const Facility = require('../models/Facility');
        const count = await Facility.countDocuments();
        if (count === 0) {
          console.log('[ParkEase DB] Auto-seeding initial demonstration data...');
          // Trigger internal seed logic
          const { seedInitialData } = require('../services/seedService');
          if (seedInitialData) {
            await seedInitialData();
            console.log('[ParkEase DB] Auto-seed complete!');
          }
        }
      } catch (seedErr) {
        console.error('[ParkEase DB] Auto-seed warning:', seedErr.message);
      }
    }, 500);

  } catch (memErr) {
    console.warn(`[ParkEase DB] Notice: In-Memory MongoDB binary unavailable (${memErr.message}). In Vercel, please configure MONGODB_URI in project settings for persistent database access.`);
  }
};

module.exports = connectDB;
