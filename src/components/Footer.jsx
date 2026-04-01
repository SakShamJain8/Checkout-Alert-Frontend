import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            background: '#fff',
            borderTop: '1px solid #e5e5e5',
            padding: '20px 24px',
            marginTop: 'auto',
            textAlign: 'center',
            fontSize: '13px',
            color: '#888'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <p>&copy; 2026 CheckoutAlert. All rights reserved.</p>
                <div className="footer-links" style={{ marginTop: '8px' }}>
                    <Link to="/privacy" style={{
                        color: '#555', textDecoration: 'none', margin: '0 12px'
                    }}>
                        Privacy Policy
                    </Link>
                    <Link to="/terms" style={{
                        color: '#555', textDecoration: 'none', margin: '0 12px'
                    }}>
                        Terms of Service
                    </Link>
                    <a href="mailto:checkoutalertt@gmail.com" style={{
                        color: '#555', textDecoration: 'none', margin: '0 12px'
                    }}>
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
}