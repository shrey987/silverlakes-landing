'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';

export default function SignNdaPage() {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [sigMethod, setSigMethod] = useState<'drawn' | 'typed'>('drawn');
  const [typedSig, setTypedSig] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState('');
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const router = useRouter();

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const hasSignature = sigMethod === 'drawn'
    ? (sigCanvasRef.current && !sigCanvasRef.current.isEmpty())
    : typedSig.trim().length > 2;

  const canSubmit = fullName.trim().length > 1 && agreed && hasSignature;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    let signature_data = '';
    if (sigMethod === 'drawn') {
      signature_data = sigCanvasRef.current!.toDataURL('image/png');
    } else {
      // Render typed signature to canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400; canvas.height = 80;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 400, 80);
      ctx.font = 'italic 36px Georgia, serif';
      ctx.fillStyle = '#000';
      ctx.fillText(typedSig, 20, 54);
      signature_data = canvas.toDataURL('image/png');
    }

    const res = await fetch('/api/sign-nda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, organization, signature_data, signature_method: sigMethod }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
    router.push(data.redirect);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060C1A', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '10px' }}>THREE LIONS CAPITAL</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 400, color: '#fff' }}>Confidentiality Agreement</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Review and sign the NDA below to access the Silver Lakes data room.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
          {/* NDA PDF viewer */}
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,25,41,0.5)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Confidentiality and Use Agreement &mdash; NDA Version 4.17
            </div>
            <iframe
              src="/nda.pdf"
              style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
              title="NDA Document"
            />
          </div>

          {/* Signature panel */}
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ background: 'rgba(13,25,41,0.9)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px' }}>
              <form onSubmit={submit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelSt}>Full Legal Name *</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="First Last" style={inputSt} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelSt}>Organization / Entity</label>
                  <input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Company name" style={inputSt} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelSt}>Signature *</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {(['drawn', 'typed'] as const).map(m => (
                      <button key={m} type="button" onClick={() => setSigMethod(m)} style={{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: sigMethod === m ? 'rgba(196,154,60,0.2)' : 'transparent', border: `1px solid ${sigMethod === m ? '#C49A3C' : 'rgba(255,255,255,0.12)'}`, color: sigMethod === m ? '#C49A3C' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                        {m === 'drawn' ? 'Draw' : 'Type'}
                      </button>
                    ))}
                  </div>

                  {sigMethod === 'drawn' ? (
                    <div style={{ background: '#fff', borderRadius: '2px', position: 'relative' }}>
                      <SignatureCanvas
                        ref={sigCanvasRef}
                        penColor="#000"
                        canvasProps={{ width: 336, height: 120, style: { display: 'block' } }}
                      />
                      <button type="button" onClick={() => sigCanvasRef.current?.clear()} style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '10px', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>Clear</button>
                    </div>
                  ) : (
                    <input
                      value={typedSig}
                      onChange={e => setTypedSig(e.target.value)}
                      placeholder="Type your name"
                      style={{ ...inputSt, fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '18px' }}
                    />
                  )}
                </div>

                <div style={{ marginBottom: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  Signing on {now}
                </div>

                <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '24px' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px', accentColor: '#C49A3C' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    I have read and agree to the above Confidentiality and Use Agreement.
                  </span>
                </label>

                {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

                <button type="submit" disabled={!canSubmit || loading} style={{ width: '100%', padding: '16px', background: canSubmit ? '#C49A3C' : 'rgba(196,154,60,0.3)', color: canSubmit ? '#060C1A' : 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
                  {loading ? 'Processing...' : 'Sign & Access Data Room'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelSt: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' };
const inputSt: React.CSSProperties = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none' };
