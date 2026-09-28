const mongoose = require('mongoose');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retries so the backend survives starting before MongoDB (Compose / Kubernetes).
async function connectDB(uri, retries = 15, delayMs = 3000) {
  if (!uri) throw new Error('MONGO_URI is not set');
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection failed (${i}/${retries}): ${err.message}`);
      if (i === retries) throw err;
      await sleep(delayMs);
    }
  }
}

module.exports = { connectDB };
