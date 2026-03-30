export default function StatusBadge({ active, success, latencyMs, thresholdMs }) {
  if (!active) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontSize: '12px', fontWeight: '500',
        padding: '3px 10px', borderRadius: '20px',
        background: '#f3f4f6', color: '#6b7280'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
        Paused
      </span>
    );
  }

  const isDown = success === false;
  const isSlow = success === true && thresholdMs && latencyMs && latencyMs > thresholdMs;

  const config = isDown
    ? { bg: '#fee2e2', color: '#dc2626', dot: '#ef4444', label: 'Down' }
    : isSlow
    ? { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b', label: 'Slow' }
    : { bg: '#dcfce7', color: '#15803d', dot: '#22c55e', label: 'Healthy' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '12px', fontWeight: '500',
      padding: '3px 10px', borderRadius: '20px',
      background: config.bg, color: config.color
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: config.dot
      }} />
      {config.label}
    </span>
  );
}