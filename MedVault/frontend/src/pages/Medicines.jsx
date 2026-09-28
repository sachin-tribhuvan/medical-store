import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import useAsync from '../hooks/useAsync.js';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { Loading, ErrorState, Empty } from '../components/States.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { FILTERS, money, fmtDate } from '../utils/format.js';

export default function Medicines() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || 'all';
  const [text, setText] = useState('');
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { const t = setTimeout(() => setQ(text), 300); return () => clearTimeout(t); }, [text]);
  const { data, loading, error, reload } = useAsync(
    () => api.listMedicines({ q, status: filter, sortBy, order }), [q, filter, sortBy, order]);

  const remove = async () => {
    setBusy(true);
    try { await api.deleteMedicine(target.id); toast(`${target.medicineName} deleted`); setTarget(null); reload(); }
    catch (e) { toast(e.friendlyMessage, 'error'); }
    finally { setBusy(false); }
  };

  return (
    <>
      <div className="page-head"><div><h1>Medicines</h1><p className="muted">Search, filter and manage stock</p></div>
        <Link className="btn primary" to="/medicines/add">+ Add Medicine</Link></div>
      <section className="card">
        <div className="toolbar">
          <label className="search"><Search size={16} />
            <input placeholder="Search name, company, batch, category…" value={text} onChange={(e) => setText(e.target.value)} /></label>
          <div className="row">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort by">
              <option value="name">Sort: Name</option><option value="price">Sort: Price</option>
              <option value="quantity">Sort: Quantity</option><option value="expiry">Sort: Expiry date</option>
            </select>
            <button className="btn icon-only" title="Toggle order" onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
              <ArrowUpDown size={16} /> {order === 'asc' ? 'Asc' : 'Desc'}</button>
          </div>
        </div>
        <div className="chips">
          {FILTERS.map(([v, label]) => (
            <button key={v} className={`chip${filter === v ? ' active' : ''}`}
              onClick={() => setParams(v === 'all' ? {} : { filter: v })}>{label}</button>
          ))}
        </div>
        {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> :
          data.length === 0 ? <Empty title="No medicines found" text="Try a different search or filter." /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Medicine</th><th>Category</th><th>Batch</th><th>Price</th><th>Qty</th><th>Expiry</th><th>Status</th><th /></tr></thead>
            <tbody>{data.map((m) => (
              <tr key={m.id}>
                <td><Link to={`/medicines/${m.id}`} className="strong">{m.medicineName}</Link><div className="muted small">{m.company}</div></td>
                <td>{m.category}</td><td>{m.batchNumber}</td><td>{money(m.price)}</td>
                <td>{m.quantity}<span className="muted small"> / min {m.minimumStock}</span></td>
                <td>{fmtDate(m.expiryDate)}</td><td><StatusBadge medicine={m} /></td>
                <td className="actions">
                  <Link className="icon-btn" title="View" to={`/medicines/${m.id}`}><Eye size={16} /></Link>
                  <Link className="icon-btn" title="Edit" to={`/medicines/${m.id}/edit`}><Pencil size={16} /></Link>
                  <button className="icon-btn danger" title="Delete" onClick={() => setTarget(m)}><Trash2 size={16} /></button>
                </td>
              </tr>))}</tbody></table></div>
        )}
      </section>
      {target && <ConfirmModal title="Delete medicine?" message={`"${target.medicineName}" (batch ${target.batchNumber}) will be permanently removed.`}
        busy={busy} onConfirm={remove} onCancel={() => setTarget(null)} />}
    </>
  );
}
