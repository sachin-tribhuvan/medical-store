const svc = require('../services/medicineService');
const { HttpError } = require('../middleware/errorHandler');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const found = (m) => { if (!m) throw new HttpError(404, 'Medicine not found'); return m; };

exports.list = wrap(async (req, res) => {
  const data = await svc.listMedicines(req.query);
  res.json({ success: true, count: data.length, data });
});
exports.search = exports.list; // GET /search?q= shares the same query handling
exports.stats = wrap(async (req, res) => res.json({ success: true, data: await svc.getStats() }));
exports.getOne = wrap(async (req, res) => res.json({ success: true, data: found(await svc.getMedicine(req.params.id)) }));
exports.create = wrap(async (req, res) => res.status(201).json({ success: true, message: 'Medicine created', data: await svc.createMedicine(req.body) }));
exports.update = wrap(async (req, res) => res.json({ success: true, message: 'Medicine updated', data: found(await svc.updateMedicine(req.params.id, req.body)) }));
exports.remove = wrap(async (req, res) => {
  found(await svc.deleteMedicine(req.params.id));
  res.json({ success: true, message: 'Medicine deleted' });
});
