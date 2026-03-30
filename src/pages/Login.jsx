import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    loginSendOtp, loginVerifyOtp,
    registerSendOtp, registerVerifyOtp
} from '../api';

export default function Login() {
    const [mode, setMode] = useState('login');
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const switchMode = (newMode) => {
        setMode(newMode);
        setStep(1);
        setError('');
        setResendCooldown(0);
        setForm({ name: '', email: '', password: '', otp: '' });
    };

    const startCooldown = () => {
        setResendCooldown(60);
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const sendOtp = async () => {
        setError('');
        if (!form.email || !form.password) {
            setError('Email and password are required'); return;
        }
        if (mode === 'register' && !form.name) {
            setError('Name is required'); return;
        }
        setLoading(true);
        try {
            const fn = mode === 'login' ? loginSendOtp : registerSendOtp;
            await fn(form);
            setStep(2);
            startCooldown();
        } catch (err) {
            const data = err.response?.data;
            setError(typeof data === 'string' ? data : data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    const resendOtp = async () => {
        if (resendCooldown > 0) return;
        setError('');
        setLoading(true);
        try {
            const fn = mode === 'login' ? loginSendOtp : registerSendOtp;
            await fn(form);
            setForm(prev => ({ ...prev, otp: '' }));
            startCooldown();
        } catch (err) {
            const data = err.response?.data;
            setError(typeof data === 'string' ? data : data?.message || 'Failed to resend OTP');
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
    setError('');
    if (!form.otp || form.otp.length !== 6) {
        setError('Enter the 6-digit OTP'); return;
    }
    setLoading(true);
    try {
        const fn = mode === 'login' ? loginVerifyOtp : registerVerifyOtp;
        const res = await fn(form);
        // only save email — token is now in httpOnly cookie
        localStorage.setItem('email', res.data.email);
        navigate('/');
    } catch (err) {
        const data = err.response?.data;
        setError(typeof data === 'string' ? data : data?.message || 'Invalid OTP');
    }
    setLoading(false);
};

    const inputStyle = {
        width: '100%', padding: '10px 14px',
        borderRadius: '8px', border: '1px solid #e5e5e5',
        fontSize: '14px', outline: 'none', marginBottom: '12px',
        fontFamily: 'inherit'
    };

    const btnStyle = {
        width: '100%', padding: '11px',
        background: '#1a1a1a', color: '#fff',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        fontFamily: 'inherit'
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px',
                border: '1px solid #e5e5e5', padding: '36px',
                width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            }}>
                {/* logo */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '8px', marginBottom: '28px'
                }}>
                    <div style={{
                        width: '8px', height: '8px',
                        borderRadius: '50%', background: '#22c55e'
                    }} />
                    <span style={{ fontWeight: '700', fontSize: '18px' }}>
                        CheckoutAlert
                    </span>
                </div>

                {/* step indicator */}
                <div style={{
                    display: 'flex', gap: '8px',
                    marginBottom: '20px', alignItems: 'center'
                }}>
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: '#1a1a1a', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '600'
                    }}>1</div>
                    <div style={{
                        flex: 1, height: '1px',
                        background: step === 2 ? '#1a1a1a' : '#e5e5e5',
                        transition: 'background 0.3s'
                    }} />
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: step === 2 ? '#1a1a1a' : '#e5e5e5',
                        color: step === 2 ? '#fff' : '#aaa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '600',
                        transition: 'background 0.3s'
                    }}>2</div>
                </div>

                <h2 style={{
                    fontSize: '15px', fontWeight: '600',
                    marginBottom: '20px', color: '#1a1a1a'
                }}>
                    {step === 1
                        ? mode === 'login' ? 'Sign in to your account' : 'Create your account'
                        : 'Verify your email'
                    }
                </h2>

                {/* Step 1 — credentials */}
                {step === 1 && (
                    <>
                        {mode === 'register' && (
                            <input style={inputStyle} name="name"
                                placeholder="Your name"
                                value={form.name} onChange={handle} />
                        )}
                        <input style={inputStyle} name="email"
                            placeholder="Email" type="email"
                            value={form.email} onChange={handle} />
                        <input style={inputStyle} name="password"
                            placeholder="Password" type="password"
                            value={form.password} onChange={handle}
                            onKeyDown={e => e.key === 'Enter' && sendOtp()} />

                        {error && (
                            <p style={{
                                color: '#dc2626', fontSize: '12px',
                                marginBottom: '12px'
                            }}>{error}</p>
                        )}

                        <button onClick={sendOtp} disabled={loading} style={btnStyle}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>

                        <p style={{
                            textAlign: 'center', fontSize: '13px',
                            color: '#888', marginTop: '16px'
                        }}>
                            {mode === 'login'
                                ? "Don't have an account? "
                                : 'Already have an account? '}
                            <span
                                onClick={() => switchMode(
                                    mode === 'login' ? 'register' : 'login'
                                )}
                                style={{
                                    color: '#1a1a1a', fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </span>
                        </p>
                    </>
                )}

                {/* Step 2 — OTP */}
                {step === 2 && (
                    <>
                        <div style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '13px', color: '#15803d', marginBottom: '16px'
                        }}>
                            {mode === 'register'
                                ? 'If this email is available, an OTP has been sent. Check your inbox.'
                                : `OTP sent to ${form.email}. Check your inbox. Expires in 5 minutes.`
                            }
                        </div>

                        <input
                            style={{
                                ...inputStyle,
                                fontSize: '24px', textAlign: 'center',
                                letterSpacing: '8px', fontWeight: '600'
                            }}
                            name="otp"
                            placeholder="000000"
                            maxLength={6}
                            value={form.otp}
                            onChange={handle}
                            onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                            autoFocus
                        />

                        {error && (
                            <p style={{
                                color: '#dc2626', fontSize: '12px',
                                marginBottom: '12px'
                            }}>{error}</p>
                        )}

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            style={btnStyle}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginTop: '12px'
                        }}>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setError('');
                                    setForm(prev => ({ ...prev, otp: '' }));
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#888', fontSize: '13px',
                                    cursor: 'pointer', padding: 0
                                }}>
                                ← Back
                            </button>

                            <span style={{ fontSize: '12px', color: '#888' }}>
                                Didn't receive it?{' '}
                                {resendCooldown > 0 ? (
                                    <span style={{ color: '#aaa' }}>
                                        Resend in {resendCooldown}s
                                    </span>
                                ) : (
                                    <span
                                        onClick={resendOtp}
                                        style={{
                                            color: loading ? '#aaa' : '#1a1a1a',
                                            fontWeight: '500',
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}>
                                        Resend OTP
                                    </span>
                                )}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}