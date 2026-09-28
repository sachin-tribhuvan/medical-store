const mongoose = require('mongoose');
const config = require('./config/env');
const createApp = require('./app');
const { connectDB } = require('./config/db');
const { seedIfEmpty } = require('./seed/seed');

async function start() {
  await connectDB(config.mongoUri);
  if (config.autoSeed) await seedIfEmpty();
  const server = createApp().listen(config.port, () =>
    console.log(`medvault-backend listening on :${config.port} (${config.nodeEnv})`)
  );
  const stop = () => server.close(() => mongoose.connection.close().finally(() => process.exit(0)));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

start().catch((err) => {
  console.error('Fatal startup error:', err.message);
  process.exit(1);
});
