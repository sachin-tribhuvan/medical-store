const Medicine = require('../models/Medicine');
const { withStatus, matchesFilter } = require('./status');

const FIELDS = ['medicineName', 'company', 'category', 'batchNumber', 'price', 'quantity', 'minimumStock', 'manufacturingDate', 'expiryDate', 'description'];
const SORTS = { name: 'medicineName', price: 'price', quantity: 'quantity', expiry: 'expiryDate' };
const pick = (body = {}) => FIELDS.reduce((o, k) => (body[k] !== undefined ? { ...o, [k]: body[k] } : o), {});
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function listMedicines({ q, status, sortBy = 'name', order = 'asc' } = {}) {
  const filter = {};
  if (q && String(q).trim()) {
    const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
    filter.$or = ['medicineName', 'company', 'batchNumber', 'category'].map((f) => ({ [f]: rx }));
  }
  const docs = await Medicine.find(filter)
    .collation({ locale: 'en' })
    .sort({ [SORTS[sortBy] || 'medicineName']: order === 'desc' ? -1 : 1 })
    .lean();
  const items = docs.map((d) => withStatus(d));
  return status && status !== 'all' ? items.filter((m) => matchesFilter(m, status)) : items;
}

async function getMedicine(id) {
  const doc = await Medicine.findById(id).lean();
  return doc ? withStatus(doc) : null;
}

async function createMedicine(body) {
  const doc = await Medicine.create(pick(body));
  return withStatus(doc.toObject());
}

async function updateMedicine(id, body) {
  const doc = await Medicine.findById(id);
  if (!doc) return null;
  doc.set(pick(body));
  await doc.save();
  return withStatus(doc.toObject());
}

async function deleteMedicine(id) {
  return Medicine.findByIdAndDelete(id);
}

async function getStats() {
  const items = await listMedicines();
  const count = (s) => items.filter((m) => m.statuses.includes(s)).length;
  return {
    totalMedicines: items.length,
    totalQuantity: items.reduce((a, m) => a + m.quantity, 0),
    totalValue: Math.round(items.reduce((a, m) => a + m.quantity * m.price, 0) * 100) / 100,
    lowStock: count('low_stock'),
    outOfStock: count('out_of_stock'),
    expired: count('expired'),
    expiringSoon: count('expiring_soon'),
    attention: items.filter((m) => m.status !== 'available').slice(0, 8),
  };
}

module.exports = { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine, getStats };
