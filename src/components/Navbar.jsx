import { useNavigate } from 'react-router-dom';
import { logout } from '../api';

export default function Navbar() {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');

    const handleLogout = async () => {
        try {
            await logout(); // clears httpOnly cookie on server
        } finally {
            localStorage.removeItem('email');
            navigate('/login');
        }
    };

    return (
        <nav style={{
            background: '#fff', borderBottom: '1px solid #e5e5e5',
            padding: '0 24px', height: '56px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%', background: '#22c55e'
                }} />
                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    CheckoutAlert
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => navigate('/incidents')} style={{
                    border: 'none', background: 'none',
                    cursor: 'pointer', fontSize: '13px', color: '#555',
                    padding: '4px 8px', borderRadius: '6px'
                }}>
                    Incidents
                </button>
                <span style={{ fontSize: '13px', color: '#888' }}>{email}</span>
                <button onClick={handleLogout} style={{
                    fontSize: '12px', padding: '5px 12px',
                    border: '1px solid #e5e5e5', borderRadius: '6px',
                    background: '#fff', cursor: 'pointer', color: '#555'
                }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}