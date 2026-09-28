import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { Loading, ErrorState } from '../components/States.jsx';
import { CATEGORIES, toInputDate } from '../utils/format.js';

const EMPTY = { medicineName: '', company: '', category: 'Tablet', batchNumber: '', price: '', quantity: '', minimumStock: '', manufacturingDate: '', expiryDate: '', description: '' };
const FIELDS = [
  ['medicineName', 'Medicine name', 'text'], ['company', 'Company', 'text'], ['category', 'Category', 'select'],
  ['batchNumber', 'Batch number', 'text'], ['price', 'Price (₹)', 'number'], ['quantity', 'Quantity', 'number'],
  ['minimumStock', 'Minimum stock', 'number'], ['manufacturingDate', 'Manufacturing date', 'date'], ['expiryDate', 'Expiry date', 'date'],
];

export default function MedicineForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getMedicine(id)
      .then((m) => setForm({ ...EMPTY, ...m, manufacturingDate: toInputDate(m.manufacturingDate), expiryDate: toInputDate(m.expiryDate) }))
      .catch((e) => setLoadError(e.friendlyMessage)).finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErrors({});
    const body = { ...form, price: Number(form.price), quantity: Number(form.quantity), minimumStock: Number(form.minimumStock) };
    try {
      const saved = id ? await api.updateMedicine(id, body) : await api.createMedicine(body);
      toast(id ? 'Medicine updated' : 'Medicine added');
      nav(`/medicines/${saved.id}`);
    } catch (err) {
      setErrors(Object.fromEntries((err.fieldErrors || []).map((x) => [x.field, x.message])));
      toast(err.friendlyMessage, 'error');
    } finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  if (loadError) return <ErrorState message={loadError} />;
  return (
    <>
      <div className="page-head"><h1>{id ? 'Edit medicine' : 'Add medicine'}</h1></div>
      <form className="card form" onSubmit={submit}>
        <div className="grid">
          {FIELDS.map(([k, label, type]) => (
            <label key={k} className={errors[k] ? 'has-error' : ''}><span>{label}</span>
              {type === 'select'
                ? <select value={form[k]} onChange={set(k)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                : <input type={type} required min={type === 'number' ? 0 : undefined} step={k === 'price' ? '0.01' : type === 'number' ? '1' : undefined} value={form[k]} onChange={set(k)} />}
              {errors[k] && <small className="err">{errors[k]}</small>}
            </label>
          ))}
        </div>
        <label className={errors.description ? 'has-error' : ''}><span>Description</span>
          <textarea rows="3" maxLength="500" value={form.description} onChange={set('description')} />
          {errors.description && <small className="err">{errors.description}</small>}</label>
        <div className="row end"><Link className="btn" to="/medicines">Cancel</Link>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : id ? 'Save changes' : 'Add medicine'}</button></div>
      </form>
    </>
  );
}
