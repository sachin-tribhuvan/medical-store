export default function ConfirmModal({ title, message, confirmText = 'Delete', busy, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="row end">
          <button className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmText}</button>
        </div>
      </div>
    </div>
  );
}
