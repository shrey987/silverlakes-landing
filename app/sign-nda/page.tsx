'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SignatureCanvas from 'react-signature-canvas';

const NdaPdfViewer = dynamic(() => import('./NdaPdfViewer'), { ssr: false });

export default function SignNdaPage() {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [sigMethod, setSigMethod] = useState<'drawn' | 'typed'>('drawn');
  const [typedSig, setTypedSig] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(320);
  const sigContainerRef = useRef<HTMLDivElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const router = useRouter();

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width) - 64;
        setCanvasWidth(Math.max(180, Math.min(w, 480)));
      }
    });
    if (sigContainerRef.current) obs.observe(sigContainerRef.current);
    return () => obs.disconnect();
  }, []);

  const handlePdfWidth = useCallback(() => {}, []);

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        body { margin: 0; }

        .nda-wrap {
          min-height: 100vh;
          background: #060C1A;
          font-family: 'Inter', sans-serif;
        }

        .nda-header {
          text-align: center;
          padding: 52px 24px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nda-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 14px;
        }

        .nda-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 400;
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.15;
        }

        .nda-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin: 0;
          line-height: 1.6;
        }

        .nda-body {
          display: grid;
          grid-template-columns: 1fr 400px;
          max-width: 1180px;
          margin: 0 auto;
          padding: 44px 36px;
          gap: 48px;
          align-items: start;
        }

        .pdf-col {}

        .pdf-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 14px;
        }

        .pdf-container {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          overflow-y: auto;
          max-height: calc(100vh - 240px);
          min-height: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.12) transparent;
        }

        .pdf-container::-webkit-scrollbar { width: 4px; }
        .pdf-container::-webkit-scrollbar-track { background: transparent; }
        .pdf-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.12);
          border-radius: 4px;
        }

        .pdf-page-wrap {
          box-shadow: 0 4px 24px rgba(0,0,0,0.6);
          border-radius: 2px;
          overflow: hidden;
          line-height: 0;
        }

        .form-col {
          position: sticky;
          top: 32px;
        }

        .form-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 36px 28px;
        }

        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 4px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }

        .field-input:focus {
          border-color: rgba(196,154,60,0.45);
          background: rgba(255,255,255,0.06);
        }

        .field-input::placeholder { color: rgba(255,255,255,0.18); }

        .field-group { margin-bottom: 20px; }

        .sig-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .sig-tab {
          flex: 1;
          padding: 9px 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Inter', sans-serif;
        }

        .sig-tab.active {
          background: rgba(196,154,60,0.12);
          border: 1px solid rgba(196,154,60,0.55);
          color: #C49A3C;
        }

        .sig-tab.inactive {
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          background: transparent;
        }

        .sig-canvas-wrap {
          background: #fff;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .sig-canvas-wrap canvas {
          display: block;
          width: 100% !important;
          height: 110px !important;
        }

        .sig-clear {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          padding: 0;
          letter-spacing: 0;
        }

        .timestamp-box {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          padding: 10px 12px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          background: rgba(255,255,255,0.02);
          margin-bottom: 20px;
        }

        .agree-label {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          cursor: pointer;
          margin-bottom: 24px;
        }

        .agree-label input[type=checkbox] {
          margin-top: 2px;
          accent-color: #C49A3C;
          flex-shrink: 0;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        .agree-text {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          line-height: 1.65;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: none;
          border-radius: 4px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .submit-btn.active {
          background: #C49A3C;
          color: #060C1A;
          cursor: pointer;
        }

        .submit-btn.active:hover {
          background: #d4a93f;
        }

        .submit-btn.disabled {
          background: rgba(196,154,60,0.15);
          color: rgba(255,255,255,0.18);
          cursor: not-allowed;
        }

        .error-msg {
          color: #f87171;
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .nda-body {
            grid-template-columns: 1fr;
            padding: 28px 20px;
            gap: 28px;
          }

          .form-col {
            position: static;
          }

          .nda-title { font-size: 30px; }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .nda-header { padding: 32px 16px 28px; }
          .nda-title { font-size: 26px; }
          .nda-subtitle { font-size: 12px; }
          .nda-body { padding: 20px 14px; gap: 20px; }
          .form-card { padding: 22px 18px; }
          .pdf-container { max-height: 360px; min-height: 260px; padding: 8px; }
        }
      `}</style>

      <div className="nda-wrap">
        <div className="nda-header">
          <p className="nda-eyebrow">Three Lions Capital</p>
          <h1 className="nda-title">Confidentiality Agreement</h1>
          <p className="nda-subtitle">Review and sign the NDA below to access the Silver Lakes data room.</p>
        </div>

        <div className="nda-body">
          {/* PDF viewer */}
          <div className="pdf-col">
            <div className="pdf-label">Confidentiality and Use Agreement — NDA Version 4.17</div>
            <NdaPdfViewer onWidthChange={handlePdfWidth} />
          </div>

          {/* Signature form */}
          <div className="form-col" ref={sigContainerRef}>
            <div className="form-card">
              <form onSubmit={submit}>
                <div className="field-group">
                  <label className="field-label">Full Legal Name *</label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="First Last"
                    className="field-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Organization / Entity</label>
                  <input
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="Company name"
                    className="field-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Signature *</label>
                  <div className="sig-toggle">
                    {(['drawn', 'typed'] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSigMethod(m)}
                        className={`sig-tab ${sigMethod === m ? 'active' : 'inactive'}`}
                      >
                        {m === 'drawn' ? 'Draw' : 'Type'}
                      </button>
                    ))}
                  </div>

                  {sigMethod === 'drawn' ? (
                    <div className="sig-canvas-wrap">
                      <SignatureCanvas
                        ref={sigCanvasRef}
                        penColor="#000"
                        canvasProps={{
                          width: canvasWidth,
                          height: 110,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => sigCanvasRef.current?.clear()}
                        className="sig-clear"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <input
                      value={typedSig}
                      onChange={e => setTypedSig(e.target.value)}
                      placeholder="Type your name"
                      className="field-input"
                      style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '18px' }}
                    />
                  )}
                </div>

                <div className="timestamp-box">Signing on {now}</div>

                <label className="agree-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                  />
                  <span className="agree-text">
                    I have read and agree to the above Confidentiality and Use Agreement.
                  </span>
                </label>

                {error && <div className="error-msg">{error}</div>}

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className={`submit-btn ${canSubmit && !loading ? 'active' : 'disabled'}`}
                >
                  {loading ? 'Processing...' : 'Sign & Access Data Room'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
