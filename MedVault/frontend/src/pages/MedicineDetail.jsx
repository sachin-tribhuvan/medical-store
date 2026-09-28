import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAsync from '../hooks/useAsync.js';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { Loading, ErrorState } from '../components/States.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { money, fmtDate } from '../utils/format.js';

export default function MedicineDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { data: m, loading, error, reload } = useAsync(() => api.getMedicine(id), [id]);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try { await api.deleteMedicine(id); toast('Medicine deleted'); nav('/medicines'); }
    catch (e) { toast(e.friendlyMessage, 'error'); setBusy(false); }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const rows = [['Company', m.company], ['Category', m.category], ['Batch number', m.batchNumber], ['Price', money(m.price)],
    ['Quantity', m.quantity], ['Minimum stock', m.minimumStock], ['Manufactured', fmtDate(m.manufacturingDate)],
    ['Expires', fmtDate(m.expiryDate)], ['Created', fmtDate(m.createdAt)], ['Last updated', fmtDate(m.updatedAt)]];
  return (
    <>
      <div className="page-head"><div><h1>{m.medicineName}</h1><StatusBadge medicine={m} /></div>
        <div className="row"><Link className="btn" to={`/medicines/${id}/edit`}>Edit</Link>
          <button className="btn danger" onClick={() => setConfirm(true)}>Delete</button></div></div>
      <section className="card">
        <dl className="details">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {m.description && <p className="desc">{m.description}</p>}
      </section>
      <Link to="/medicines" className="muted">← Back to medicines</Link>
      {confirm && <ConfirmModal title="Delete medicine?" message={`"${m.medicineName}" will be permanently removed.`} busy={busy} onConfirm={remove} onCancel={() => setConfirm(false)} />}
    </>
  );
}
