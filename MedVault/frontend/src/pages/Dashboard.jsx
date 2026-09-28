import { Link, useNavigate } from 'react-router-dom';
import { Pill, Boxes, IndianRupee, AlertTriangle, PackageX, CalendarX, Clock } from 'lucide-react';
import useAsync from '../hooks/useAsync.js';
import { api } from '../services/api.js';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { money, num, fmtDate } from '../utils/format.js';

export default function Dashboard() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useAsync(() => api.getStats());
  if (loading) return <Loading text="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const cards = [
    ['Total Medicines', num(data.totalMedicines), Pill, 'teal', 'all'],
    ['Inventory Quantity', num(data.totalQuantity), Boxes, 'blue', 'all'],
    ['Inventory Value', money(data.totalValue), IndianRupee, 'green', 'all'],
    ['Low Stock', data.lowStock, AlertTriangle, 'amber', 'low-stock'],
    ['Out of Stock', data.outOfStock, PackageX, 'red', 'out-of-stock'],
    ['Expired', data.expired, CalendarX, 'red', 'expired'],
    ['Expiring Soon', data.expiringSoon, Clock, 'amber', 'expiring-soon'],
  ];
  return (
    <>
      <div className="page-head"><div><h1>Dashboard</h1><p className="muted">Live overview of your pharmacy inventory</p></div>
        <Link className="btn primary" to="/medicines/add">+ Add Medicine</Link></div>
      <div className="cards">
        {cards.map(([label, value, Icon, tone, filter]) => (
          <button key={label} className="card stat" onClick={() => nav(`/medicines?filter=${filter}`)}>
            <span className={`icon ${tone}`}><Icon size={22} /></span>
            <span><span className="stat-label">{label}</span><span className="stat-value">{value}</span></span>
          </button>
        ))}
      </div>
      <section className="card">
        <h2>Needs attention</h2>
        {data.attention.length === 0 ? <Empty title="All good" text="No stock or expiry issues right now." /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Medicine</th><th>Batch</th><th>Qty</th><th>Expiry</th><th>Status</th></tr></thead>
            <tbody>{data.attention.map((m) => (
              <tr key={m.id}><td><Link to={`/medicines/${m.id}`}>{m.medicineName}</Link></td><td>{m.batchNumber}</td>
                <td>{m.quantity}</td><td>{fmtDate(m.expiryDate)}</td><td><StatusBadge medicine={m} /></td></tr>
            ))}</tbody></table></div>
        )}
      </section>
    </>
  );
}
