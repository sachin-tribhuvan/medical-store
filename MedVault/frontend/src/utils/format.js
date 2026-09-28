export const CATEGORIES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Powder', 'Other'];
export const FILTERS = [
  ['all', 'All'], ['available', 'Available'], ['low-stock', 'Low Stock'],
  ['out-of-stock', 'Out of Stock'], ['expired', 'Expired'], ['expiring-soon', 'Expiring Soon'],
];
export const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);
export const num = (n) => new Intl.NumberFormat('en-IN').format(n || 0);
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—');
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
