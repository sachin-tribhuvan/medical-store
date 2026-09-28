export default function StatusBadge({ medicine }) {
  const extra = medicine.statuses.length > 1 ? medicine.statuses.filter((s) => s !== medicine.status) : [];
  return (
    <span className="badges">
      <span className={`badge ${medicine.status}`}>{medicine.statusLabel}</span>
      {extra.includes('expiring_soon') && <span className="badge expiring_soon">Expiring Soon</span>}
      {extra.includes('low_stock') && <span className="badge low_stock">Low Stock</span>}
    </span>
  );
}
