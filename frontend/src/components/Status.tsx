type StatusType = 'idle' | 'speaking' | 'stopped' | 'exporting' | 'done' | 'error' | 'success' | 'warning';

interface StatusProps {
  type: StatusType;
  message: string;
}

export default function Status({ type, message }: StatusProps) {
  if (!message) return null;

  const statusClass =
    type === 'error' ? 'error' :
    type === 'done' || type === 'stopped' ? 'success' :
    type === 'speaking' ? 'info' :
    'warning';

  const icon =
    statusClass === 'error' ? '⚠️' :
    statusClass === 'success' ? '✅' :
    statusClass === 'info' ? '🔊' :
    'ℹ️';

  return (
    <div className={`status ${statusClass}`} role="status" aria-live="polite">
      <span className="status-icon" aria-hidden>{icon}</span>
      <span className="status-message">{message}</span>
    </div>
  );
}
