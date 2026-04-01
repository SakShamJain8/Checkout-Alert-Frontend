import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api';

export default function Navbar() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        <>
        <nav className="navbar" style={{
            background: '#fff', borderBottom: '1px solid #e5e5e5',
            padding: '0 24px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src="/favicon.png" alt="CheckoutAlert" className="navbar-desktop-logo" style={{
                    width: '24px', height: '24px',
                    display: 'block'
                }} />
                <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%', background: '#22c55e',
                    display: 'none'
                }} className="navbar-dot" />
                <span className="navbar-brand" style={{ fontWeight: '600', fontSize: '16px' }}>
                    CheckoutAlert
                </span>
                <img src="/favicon.png" alt="CheckoutAlert" className="navbar-mobile-logo" style={{
                    width: '28px', height: '28px',
                    display: 'none'
                }} />
            </div>
            <button className="navbar-incidents-btn" onClick={() => navigate('/incidents')} style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer', fontSize: '16px', color: '#1a1a1a',
                padding: 0, borderRadius: 0,
                margin: 0,
                fontFamily: 'inherit',
                fontWeight: '600'
            }}>
                Incidents
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="navbar-email" style={{ fontSize: '13px', color: '#888' }}>{email}</span>
                <button className="navbar-button navbar-logout-btn" onClick={handleLogout} style={{
                    fontSize: '13px', padding: '8px 12px',
                    border: '1px solid #e5e5e5', borderRadius: '6px',
                    background: '#fff', cursor: 'pointer', color: '#555',
                    margin: 0,
                    fontFamily: 'inherit'
                }}>
                    Logout
                </button>
                <button 
                    className="navbar-avatar-btn"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    style={{
                        display: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '14px',
                        margin: 0,
                        padding: 0,
                        marginLeft: '12px'
                    }}
                >
                    {email ? email.charAt(0).toUpperCase() : 'U'}
                </button>
            </div>
        </nav>
        
        {showMobileMenu && (
            <div style={{
                display: 'none',
                position: 'absolute',
                top: '56px',
                right: '0',
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '200px'
            }} className="navbar-mobile-menu">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', fontSize: '13px', color: '#555' }}>
                    {email}
                </div>
                <button 
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#dc2626',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                    }}
                >
                    Logout
                </button>
            </div>
        )}
        </>
    );
}