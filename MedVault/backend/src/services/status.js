const DAY = 24 * 60 * 60 * 1000;
const PRIORITY = ['expired', 'out_of_stock', 'low_stock', 'expiring_soon', 'available'];
const LABELS = {
  expired: 'Expired',
  out_of_stock: 'Out of Stock',
  low_stock: 'Low Stock',
  expiring_soon: 'Expiring Soon',
  available: 'Available',
};

const utcToday = (now) => Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

// Status is always calculated, never stored.
function getStatuses(m, now = new Date()) {
  const today = utcToday(now);
  const expiry = new Date(m.expiryDate).getTime();
  const s = [];
  if (expiry < today) s.push('expired');
  else if (expiry - today <= 30 * DAY) s.push('expiring_soon');
  if (m.quantity === 0) s.push('out_of_stock');
  else if (m.quantity <= m.minimumStock) s.push('low_stock');
  if (!s.length) s.push('available');
  return s;
}

function withStatus(doc, now = new Date()) {
  const { _id, __v, ...rest } = doc;
  const statuses = getStatuses(rest, now);
  const status = PRIORITY.find((p) => statuses.includes(p));
  return { id: String(_id), ...rest, statuses, status, statusLabel: LABELS[status] };
}

const matchesFilter = (m, filter) => m.statuses.includes(String(filter).replace(/-/g, '_'));

module.exports = { getStatuses, withStatus, matchesFilter, LABELS };
