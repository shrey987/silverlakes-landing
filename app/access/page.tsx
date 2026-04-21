'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setStep('otp');
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(data.redirect);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060C1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '12px' }}>
            THREE LIONS CAPITAL
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
            {step === 'email' ? 'Access the Data Room' : 'Verify Your Email'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            {step === 'email'
              ? 'Enter your email to receive a one-time access code.'
              : `We sent a 6-digit code to ${email}. Enter it below.`}
          </p>
        </div>

        <div style={{ background: 'rgba(13,25,41,0.9)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px' }}>
          {step === 'email' ? (
            <form onSubmit={sendOtp}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                style={inputStyle}
              />
              {error && <div style={errorStyle}>{error}</div>}
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <label style={labelStyle}>Access Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="123456"
                maxLength={6}
                style={{ ...inputStyle, letterSpacing: '0.4em', fontSize: '22px', textAlign: 'center' }}
                autoFocus
              />
              {error && <div style={errorStyle}>{error}</div>}
              <button type="submit" disabled={loading || otp.length < 6} style={btnStyle}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                style={{ marginTop: '12px', width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer' }}
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          Confidential &middot; For Qualified Investors Only
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '20px', fontFamily: "'Inter', sans-serif" };
const btnStyle: React.CSSProperties = { width: '100%', padding: '16px', background: '#C49A3C', color: '#060C1A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' };
const errorStyle: React.CSSProperties = { color: '#f87171', fontSize: '13px', marginBottom: '16px', marginTop: '-12px' };
