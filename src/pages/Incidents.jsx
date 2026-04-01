import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIncidents } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getIncidents()
      .then(r => setIncidents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => navigate('/')} style={{
            border: 'none', background: 'none', cursor: 'pointer',
            color: '#888', fontSize: '13px', padding: 0
          }}>← Dashboard</button>
          <span style={{ color: '#ddd' }}>|</span>
          <span style={{ fontWeight: '600', fontSize: '18px' }}>Incident history</span>
          <span style={{
            background: '#fee2e2', color: '#dc2626',
            fontSize: '12px', padding: '2px 9px', borderRadius: '20px'
          }}>
            {incidents.length} total
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Loading...</p>
        ) : incidents.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: '10px',
            border: '1px solid #e5e5e5', padding: '48px',
            textAlign: 'center', color: '#888'
          }}>
            No incidents yet — all your endpoints are healthy.
          </div>
        ) : incidents.map(inc => (
          <div key={inc.id} style={{
            background: '#fff', borderRadius: '10px',
            border: '1px solid #fca5a5',
            padding: '16px 20px', marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: '#fee2e2', color: '#dc2626',
                  fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                  fontWeight: '500'
                }}>
                  {inc.statusCode}
                </span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                  {inc.endpointName}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa' }}>
                {new Date(inc.detectedAt).toLocaleString()}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              {inc.endpointUrl}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>
                Latency: <strong>{inc.latencyMs}ms</strong>
              </span>
              {inc.baselineMs > 0 && (
                <span style={{ fontSize: '12px', color: '#555' }}>
                  Baseline: <strong>{Math.round(inc.baselineMs)}ms</strong>
                </span>
              )}
            </div>

            <div style={{
              background: '#fafafa', borderRadius: '8px',
              border: '1px solid #f0f0f0', padding: '10px 12px',
              fontSize: '13px', color: '#555', lineHeight: '1.5'
            }}>
              <span style={{ fontSize: '11px', color: '#aaa', display: 'block', marginBottom: '3px' }}>
                Gemini diagnosis
              </span>
              {inc.geminiDiagnosis}
            </div>
          </div>
        ))}
      </div>

      <Footer />

    </div>
  );
}