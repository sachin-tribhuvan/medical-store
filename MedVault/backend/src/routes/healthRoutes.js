const router = require('express').Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    service: 'medvault-backend',
    database: connected ? 'connected' : 'disconnected',
  });
});

module.exports = router;
