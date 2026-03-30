import { useState } from 'react';
import { addEndpoint } from '../api';

export default function AddEndpointModal({ onClose, onAdded, onLimitReached }) {
  const [form, setForm] = useState({
    name: '', url: '', httpMethod: 'GET',
    expectedStatus: 200, thresholdMs: 1000,
    alertEmail: '', customHeaders: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.url || !form.alertEmail) {
      setError('Name, URL and email are required'); return;
    }
    setLoading(true);
    try {
      await addEndpoint(form);
      onAdded();
      onClose();
    } catch (err) {
      if (err.response?.status === 403 &&
          err.response?.data === 'LIMIT_REACHED') {
        onClose();
        onLimitReached();
      } else {
        const data = err.response?.data;
        setError(typeof data === 'string' ? data : 'Failed to add endpoint');
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #e5e5e5', fontSize: '13px',
    outline: 'none', marginBottom: '12px', fontFamily: 'inherit'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px',
        padding: '24px', width: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}>

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px'
        }}>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>
            Add endpoint
          </span>
          <button onClick={onClose} style={{
            border: 'none', background: 'none',
            cursor: 'pointer', fontSize: '20px', color: '#888',
            lineHeight: 1
          }}>×</button>
        </div>

        {/* name */}
        <input style={inputStyle} name="name"
          placeholder="Name (e.g. Checkout API)"
          value={form.name} onChange={handle} />

        {/* url */}
        <input style={inputStyle} name="url"
          placeholder="URL (e.g. https://mystore.com/checkout)"
          value={form.url} onChange={handle} />

        {/* alert email */}
        <input style={inputStyle} name="alertEmail"
          placeholder="Alert email"
          value={form.alertEmail} onChange={handle} />

        {/* method + expected status */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <select name="httpMethod" value={form.httpMethod} onChange={handle}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}>
            <option>GET</option>
            <option>POST</option>
          </select>
          <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            name="expectedStatus" type="number"
            placeholder="Expected status"
            value={form.expectedStatus} onChange={handle} />
        </div>

        {/* threshold */}
        <input style={inputStyle} name="thresholdMs" type="number"
          placeholder="Latency threshold (ms)"
          value={form.thresholdMs} onChange={handle} />

        {/* custom headers */}
        <input style={inputStyle} name="customHeaders"
          placeholder='Custom headers (JSON) e.g. {"Authorization": "Bearer token"}'
          value={form.customHeaders} onChange={handle} />
        <div style={{
          fontSize: '11px', color: '#aaa',
          marginTop: '-8px', marginBottom: '12px'
        }}>
          Optional — for authenticated endpoints
        </div>

        {/* error */}
        {error && (
          <p style={{
            color: '#dc2626', fontSize: '12px',
            marginBottom: '12px', marginTop: 0
          }}>{error}</p>
        )}

        {/* submit */}
        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          background: '#1a1a1a', color: '#fff', border: 'none',
          fontSize: '14px', fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Adding...' : 'Add endpoint'}
        </button>

      </div>
    </div>
  );
}