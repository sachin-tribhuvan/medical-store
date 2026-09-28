const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  const origins = config.corsOrigins;
  app.use(cors({ origin: origins.includes('*') ? true : origins }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/health', require('./routes/healthRoutes'));
  app.use('/api/medicines', require('./routes/medicineRoutes'));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
