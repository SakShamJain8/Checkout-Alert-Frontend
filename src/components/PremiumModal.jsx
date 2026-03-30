import { useState } from 'react';
import { joinWaitlist } from '../api';

export default function PremiumModal({ onClose, userEmail }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const join = async () => {
        setLoading(true);
        setError('');
        try {
            await joinWaitlist();
            localStorage.setItem('waitlist', 'true');
            setSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 200
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px',
                padding: '32px', width: '420px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
            }}>
                {!submitted ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                borderRadius: '12px', background: '#f0fdf4',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',
                                fontSize: '24px'
                            }}>🔒</div>
                            <h2 style={{
                                fontSize: '18px', fontWeight: '700',
                                margin: '0 0 6px', color: '#1a1a1a'
                            }}>
                                You've reached the free limit
                            </h2>
                            <p style={{
                                fontSize: '13px', color: '#888',
                                margin: 0, lineHeight: '1.5'
                            }}>
                                Free accounts can monitor up to 5 endpoints.
                                Join the waitlist to unlock unlimited monitoring.
                            </p>
                        </div>

                        <div style={{
                            background: '#f9fafb', borderRadius: '10px',
                            padding: '14px 16px', marginBottom: '20px'
                        }}>
                            <div style={{
                                fontSize: '11px', fontWeight: '600',
                                color: '#888', letterSpacing: '0.07em',
                                textTransform: 'uppercase', marginBottom: '10px'
                            }}>
                                Premium includes
                            </div>
                            {[
                                'Unlimited endpoints',
                                'Slack + WhatsApp alerts',
                                '10 second ping interval',
                                'Team members',
                                'Monthly SLA reports',
                                'Priority support'
                            ].map(perk => (
                                <div key={perk} style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '8px', marginBottom: '7px',
                                    fontSize: '13px', color: '#555'
                                }}>
                                    <span style={{
                                        color: '#22c55e', fontWeight: '700'
                                    }}>✓</span>
                                    {perk}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '12px', color: '#92400e',
                            marginBottom: '20px', textAlign: 'center'
                        }}>
                            Early waitlist members get{' '}
                            <strong>50% off</strong> at launch
                        </div>

                        {error && (
                            <p style={{
                                color: '#dc2626', fontSize: '12px',
                                marginBottom: '12px', textAlign: 'center'
                            }}>{error}</p>
                        )}

                        <button
                            onClick={join}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '12px',
                                background: '#1a1a1a', color: '#fff',
                                border: 'none', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                marginBottom: '8px'
                            }}>
                            {loading ? 'Joining...' : 'Join premium waitlist'}
                        </button>

                        <button onClick={onClose} style={{
                            width: '100%', padding: '10px',
                            background: 'none', border: 'none',
                            color: '#aaa', fontSize: '13px',
                            cursor: 'pointer'
                        }}>
                            Remind me later
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '50%', background: '#f0fdf4',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '28px'
                        }}>✓</div>
                        <h2 style={{
                            fontSize: '18px', fontWeight: '700',
                            margin: '0 0 8px', color: '#1a1a1a'
                        }}>
                            You're on the waitlist!
                        </h2>
                        <p style={{
                            fontSize: '13px', color: '#888',
                            lineHeight: '1.6', marginBottom: '24px'
                        }}>
                            We'll email <strong>{userEmail}</strong> when
                            premium launches. Early members get 50% off.
                        </p>
                        <button onClick={onClose} style={{
                            padding: '10px 24px',
                            background: '#1a1a1a', color: '#fff',
                            border: 'none', borderRadius: '8px',
                            fontSize: '14px', cursor: 'pointer'
                        }}>
                            Back to dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
