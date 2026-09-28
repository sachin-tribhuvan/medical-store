import { AlertCircle, Inbox } from 'lucide-react';

export const Loading = ({ text = 'Loading…' }) => (
  <div className="state"><div className="spinner" /><p>{text}</p></div>
);
export const Empty = ({ title = 'Nothing here yet', text, children }) => (
  <div className="state"><Inbox size={36} /><h3>{title}</h3>{text && <p>{text}</p>}{children}</div>
);
export const ErrorState = ({ message, onRetry }) => (
  <div className="state error"><AlertCircle size={36} /><h3>Something went wrong</h3><p>{message}</p>
    {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}</div>
);
