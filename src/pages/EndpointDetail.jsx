import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getHistory, getEndpoints, getUptime } from '../api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function EndpointDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uptime, setUptime] = useState(null);
  const [endpoint, setEndpoint] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [epRes, histRes, uptimeRes] = await Promise.all([getEndpoints(), getHistory(id), getUptime(id)]);
      setEndpoint(epRes.data.find(e => e.id === id));
      setHistory(histRes.data.reverse());
      setUptime(uptimeRes.data);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [id]);

  if (!endpoint) return <div style={{ padding: '40px', color: '#888' }}>Loading...</div>;

  const lastPing = history[history.length - 1];
  const avgLatency = history.length
    ? Math.round(history.reduce((s, h) => s + h.latencyMs, 0) / history.length)
    : 0;
  const errorCount = history.filter(h => !h.success).length;

  const chartData = history.map(h => ({
    time: new Date(h.pingedAt).toLocaleTimeString(),
    latency: h.latencyMs,
    status: h.statusCode
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        <button onClick={() => navigate('/')} style={{
          border: 'none', background: 'none', cursor: 'pointer',
          color: '#888', fontSize: '13px', marginBottom: '16px', padding: 0
        }}>← Back to dashboard</button>

        {/* endpoint header */}
        <div style={{
          background: '#fff', borderRadius: '10px',
          border: '1px solid #e5e5e5', padding: '20px 24px', marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: '700', fontSize: '18px' }}>{endpoint.name}</span>
            <StatusBadge active={endpoint.active} success={lastPing?.success} latencyMs={lastPing?.latencyMs}thresholdMs={endpoint.thresholdMs}/>
          </div>
          <div style={{ fontSize: '13px', color: '#888' }}>{endpoint.url}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
            Alert email: {endpoint.alertEmail}
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Uptime', value: uptime ? uptime.uptimePercent + '%' : '—',alert: uptime && uptime.uptimePercent < 99 },
            { label: 'Avg latency', value: avgLatency + 'ms' },
            { label: 'Last status', value: lastPing?.statusCode ?? '—' },
            { label: 'Errors (last 10)', value: errorCount }
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: '10px',
              border: '1px solid #e5e5e5', padding: '16px 20px'
            }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* latency chart */}
        {history.length > 0 && (
          <div style={{
            background: '#fff', borderRadius: '10px',
            border: '1px solid #e5e5e5', padding: '20px', marginBottom: '16px'
          }}>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>
              Latency (last 10 pings)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="ms" />
                <Tooltip formatter={(v) => v + 'ms'} />
                <Line type="monotone" dataKey="latency"
                  stroke="#1a1a1a" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ping history table */}
        <div style={{
          background: '#fff', borderRadius: '10px',
          border: '1px solid #e5e5e5', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e5e5', fontWeight: '600', fontSize: '14px' }}>
            Ping history
          </div>
          {history.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
              No pings yet — check back in 30 seconds
            </div>
          ) : [...history].reverse().map(h => (
            <div key={h.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', borderBottom: '1px solid #f0f0f0',
              fontSize: '13px'
            }}>
              <span style={{ color: h.success ? '#15803d' : '#dc2626', fontWeight: '500' }}>
                {h.statusCode}
              </span>
              <span style={{ color: '#555' }}>{h.latencyMs}ms</span>
              <span style={{ color: '#aaa', fontSize: '12px' }}>
                {new Date(h.pingedAt).toLocaleTimeString()}
              </span>
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                background: h.success ? '#dcfce7' : '#fee2e2',
                color: h.success ? '#15803d' : '#dc2626'
              }}>
                {h.success ? 'OK' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}