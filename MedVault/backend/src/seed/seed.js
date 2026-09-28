const mongoose = require('mongoose');
const config = require('../config/env');
const Medicine = require('../models/Medicine');
const data = require('./data');

async function seedIfEmpty() {
  if ((await Medicine.countDocuments()) > 0) return false;
  await Medicine.insertMany(data);
  console.log(`Seeded ${data.length} medicines`);
  return true;
}

// CLI: `npm run seed` (skips if data exists) or `npm run seed -- --force` (wipes and reseeds)
async function main() {
  const force = process.argv.includes('--force');
  if (!config.mongoUri) throw new Error('MONGO_URI is not set');
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 });
  if (force) {
    await Medicine.deleteMany({});
    await Medicine.insertMany(data);
    console.log(`Reseeded ${data.length} medicines`);
  } else if (!(await seedIfEmpty())) {
    console.log('Database already has medicines; skipping. Use "npm run seed -- --force" to reset.');
  }
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); });
}

module.exports = { seedIfEmpty };
