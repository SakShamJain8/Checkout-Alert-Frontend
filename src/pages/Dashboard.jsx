import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEndpoints, deleteEndpoint, toggleEndpoint, getHistory, getUptime } from '../api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PremiumModal from '../components/PremiumModal';
import AddEndpointModal from '../components/AddEndpointModal';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [lastPings, setLastPings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [uptimeMap, setUptimeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await getEndpoints();
      const eps = res.data;
      setEndpoints(eps);

      const [pingResults, uptimeResults] = await Promise.all([
        Promise.all(
          eps.map(ep =>
            getHistory(ep.id)
              .then(r => ({ id: ep.id, last: r.data[0] ?? null }))
              .catch(() => ({ id: ep.id, last: null }))
          )
        ),
        Promise.all(
          eps.map(ep =>
            getUptime(ep.id)
              .then(r => ({ id: ep.id, uptime: r.data.uptimePercent }))
              .catch(() => ({ id: ep.id, uptime: null }))
          )
        )
      ]);

      const pingMap = {};
      pingResults.forEach(p => { pingMap[p.id] = p.last; });
      setLastPings(pingMap);

      const uMap = {};
      uptimeResults.forEach(u => { uMap[u.id] = u.uptime; });
      setUptimeMap(uMap);

    } catch (e) {
      console.error('Failed to load endpoints', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this endpoint?')) {
      await deleteEndpoint(id);
      load();
    }
  };

  const handleToggle = async (e, id) => {
    e.stopPropagation();
    await toggleEndpoint(id);
    load();
  };

  const total = endpoints.length;
  const active = endpoints.filter(e => e.active).length;
  const paused = total - active;
  const down = endpoints.filter(e => {
    const last = lastPings[e.id];
    return e.active && last && !last.success;
  }).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* stats row */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px', marginBottom: '24px'
        }}>
          {[
            { label: 'Total endpoints', value: total, icon: '📊' },
            { label: 'Active', value: active, icon: '✓' },
            { label: 'Paused', value: paused, icon: '⏸' },
            { label: 'Down now', value: down, icon: '⚠', alert: down > 0 }
          ].map(s => (
            <div key={s.label} className="stat-card" style={{
              background: '#fff', borderRadius: '10px',
              border: s.alert ? '1px solid #fca5a5' : '1px solid #e5e5e5',
              padding: '16px 20px'
            }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  fontSize: '14px',
                  color: s.label === 'Active' ? '#22c55e' : s.label === 'Paused' ? '#eab308' : s.label === 'Down now' ? '#dc2626' : 'inherit'
                }}>{s.icon}</span>
                {s.label}
              </div>
              <div className="stat-value" style={{
                fontSize: '28px', fontWeight: '600',
                color: s.alert ? '#dc2626' : '#1a1a1a'
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* header row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px'
        }}>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>
            Monitored endpoints
          </span>
          <button
            onClick={() => {
              if (total >= 5) {
                setShowPremium(true);
              } else {
                setShowModal(true);
              }
            }}
            style={{
              background: total >= 5 ? '#f5f5f5' : '#1a1a1a',
              color: total >= 5 ? '#888' : '#fff',
              border: total >= 5 ? '1px solid #e5e5e5' : 'none',
              padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}>
            {total >= 5 ? 'Limit reached — upgrade' : '+ Add endpoint'}
          </button>
        </div>

        {/* soft warning at 4 endpoints */}
        {total === 4 && (
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '8px', padding: '10px 16px',
            fontSize: '13px', color: '#92400e',
            marginBottom: '12px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              You're using 4 of 5 free endpoints.
              Adding one more will reach your limit.
            </span>
            <span
              onClick={() => setShowPremium(true)}
              style={{
                fontWeight: '600', cursor: 'pointer',
                textDecoration: 'underline', marginLeft: '12px',
                whiteSpace: 'nowrap'
              }}>
              View premium
            </span>
          </div>
        )}

        {/* endpoint cards */}
        {loading ? (
          <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
        ) : endpoints.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: '10px',
            border: '1px solid #e5e5e5', padding: '48px',
            textAlign: 'center', color: '#888'
          }}>
            No endpoints yet. Add your first one.
          </div>
        ) : endpoints.map(ep => {
          const last = lastPings[ep.id];
          const isDown = ep.active && last && !last.success;

          return (
            <div key={ep.id}
              className="endpoint-card"
              onClick={() => navigate(`/endpoint/${ep.id}`)}
              style={{
                background: '#fff', borderRadius: '10px',
                border: isDown ? '1px solid #fca5a5' : '1px solid #e5e5e5',
                padding: '16px 20px', marginBottom: '10px',
                cursor: 'pointer', transition: 'border-color 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = isDown ? '#ef4444' : '#aaa'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isDown ? '#fca5a5' : '#e5e5e5'}
            >
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '10px', marginBottom: '4px'
                  }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>
                      {ep.name}
                    </span>
                    <StatusBadge
                      active={ep.active}
                      success={last ? last.success : null}
                      latencyMs={last ? last.latencyMs : null}
                      thresholdMs={ep.thresholdMs}
                    />
                    {last && (
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        {last.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{ep.url}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                    Method: {ep.httpMethod} · Expected: {ep.expectedStatus} · Threshold: {ep.thresholdMs}ms
                    {last && (
                      <span style={{ marginLeft: '8px' }}>
                        · Last checked: {new Date(last.pingedAt).toLocaleTimeString()}
                      </span>
                    )}
                    {uptimeMap[ep.id] !== null && uptimeMap[ep.id] !== undefined && (
                      <span style={{
                        marginLeft: '8px',
                        color: uptimeMap[ep.id] >= 99 ? '#15803d' : '#dc2626',
                        fontWeight: '500'
                      }}>
                        · {uptimeMap[ep.id]}% uptime
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button onClick={(e) => handleToggle(e, ep.id)} style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                    border: '1px solid #e5e5e5', background: '#fff',
                    cursor: 'pointer', color: '#555'
                  }}>
                    {ep.active ? 'Pause' : 'Resume'}
                  </button>
                  <button onClick={(e) => handleDelete(e, ep.id)} style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                    border: '1px solid #fee2e2', background: '#fff',
                    cursor: 'pointer', color: '#dc2626'
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />

      {showModal && (
        <AddEndpointModal
          onClose={() => setShowModal(false)}
          onAdded={load}
          onLimitReached={() => {
            setShowModal(false);
            setShowPremium(true);
          }}
        />
      )}

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          userEmail={email}
        />
      )}

    </div>
  );
}