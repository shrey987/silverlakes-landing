'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) { setError('Invalid password'); return; }
    router.push('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060C1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '10px' }}>THREE LIONS CAPITAL</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400, color: '#fff' }}>Admin Access</h1>
        </div>
        <form onSubmit={login} style={{ background: 'rgba(13,25,41,0.9)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none', marginBottom: '20px' }} />
          {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#C49A3C', color: '#060C1A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
