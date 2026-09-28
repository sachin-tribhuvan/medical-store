const { getStatuses, withStatus } = require('../src/services/status');

const now = new Date('2026-06-15T10:00:00Z');
const day = (n) => new Date(Date.UTC(2026, 5, 15 + n));
const med = (o) => ({ quantity: 100, minimumStock: 10, expiryDate: day(365), ...o });

test('out of stock when quantity is 0', () => expect(getStatuses(med({ quantity: 0 }), now)).toContain('out_of_stock'));
test('low stock when quantity <= minimumStock', () => expect(getStatuses(med({ quantity: 10 }), now)).toContain('low_stock'));
test('expired when expiry is before today', () => expect(getStatuses(med({ expiryDate: day(-1) }), now)).toEqual(['expired']));
test('expiring soon within 30 days', () => expect(getStatuses(med({ expiryDate: day(30) }), now)).toEqual(['expiring_soon']));
test('not expiring soon at 31 days', () => expect(getStatuses(med({ expiryDate: day(31) }), now)).toEqual(['available']));
test('primary status prioritises expired', () => {
  const r = withStatus({ _id: 'x', ...med({ quantity: 0, expiryDate: day(-5) }) }, now);
  expect(r.status).toBe('expired');
  expect(r.statuses).toEqual(expect.arrayContaining(['expired', 'out_of_stock']));
});
