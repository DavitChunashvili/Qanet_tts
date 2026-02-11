type StatusType = 'idle' | 'speaking' | 'stopped' | 'exporting' | 'done' | 'error';

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

  return (
    <div className={`status ${statusClass}`}>
      {message}
    </div>
  );
}
