class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `Duplicate value for ${field}`, errors: [{ field, message: 'Must be unique' }] });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ success: false, message: 'Malformed JSON body' });
  if (err.status && err.status < 500) return res.status(err.status).json({ success: false, message: err.message });
  console.error(err); // details stay in server logs only
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

module.exports = { HttpError, notFound, errorHandler };
