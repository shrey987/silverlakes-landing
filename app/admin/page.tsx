'use client';

import { useState, useEffect } from 'react';

type Tab = 'signers' | 'allowlist' | 'access-log';

interface Signer { id: string; full_name: string; email: string; organization: string; signed_at: string; ip_address: string; ip_city: string; ip_region: string; ip_country: string; pdf_storage_path: string; }
interface AllowlistEntry { id: string; email: string; notes: string; added_at: string; }
interface LogEntry { id: string; email: string; file_path: string; action: string; ip_address: string; accessed_at: string; }

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('signers');
  const [signers, setSigners] = useState<Signer[]>([]);
  const [allowlist, setAllowlist] = useState<AllowlistEntry[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTab(tab); }, [tab]);

  async function loadTab(t: Tab) {
    setLoading(true);
    if (t === 'signers') {
      const r = await fetch('/api/admin/signers'); const d = await r.json(); setSigners(d.signers || []);
    } else if (t === 'allowlist') {
      const r = await fetch('/api/admin/allowlist'); const d = await r.json(); setAllowlist(d.allowlist || []);
    } else {
      const r = await fetch('/api/admin/access-log'); const d = await r.json(); setLog(d.log || []);
    }
    setLoading(false);
  }

  async function addAllowlist(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/allowlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail, notes: newNotes }) });
    setNewEmail(''); setNewNotes('');
    loadTab('allowlist');
  }

  async function removeAllowlist(id: string) {
    await fetch(`/api/admin/allowlist?id=${id}`, { method: 'DELETE' });
    loadTab('allowlist');
  }

  function downloadNda(id: string) { window.open(`/api/admin/download-nda?id=${id}`, '_blank'); }

  const fmt = (d: string) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#060C1A', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '8px' }}>THREE LIONS CAPITAL</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400, color: '#fff' }}>Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {(['signers', 'allowlist', 'access-log'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #C49A3C' : '2px solid transparent', color: tab === t ? '#C49A3C' : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '-1px' }}>
              {t === 'access-log' ? 'Access Log' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px', textAlign: 'center' }}>Loading...</div>}

        {/* SIGNERS */}
        {!loading && tab === 'signers' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>{signers.length} signer{signers.length !== 1 ? 's' : ''}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Name', 'Email', 'Organization', 'Signed At', 'Location', 'IP', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signers.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={tdSt}>{s.full_name}</td>
                    <td style={tdSt}>{s.email}</td>
                    <td style={tdSt}>{s.organization || '—'}</td>
                    <td style={tdSt}>{fmt(s.signed_at)}</td>
                    <td style={tdSt}>{[s.ip_city, s.ip_country].filter(Boolean).join(', ') || '—'}</td>
                    <td style={{ ...tdSt, fontFamily: 'monospace', fontSize: '11px' }}>{s.ip_address || '—'}</td>
                    <td style={tdSt}>
                      <button onClick={() => downloadNda(s.id)} style={{ padding: '5px 14px', background: '#1B6B8A', color: '#fff', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Download NDA</button>
                    </td>
                  </tr>
                ))}
                {signers.length === 0 && <tr><td colSpan={7} style={{ ...tdSt, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px' }}>No signers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ALLOWLIST */}
        {!loading && tab === 'allowlist' && (
          <div>
            <form onSubmit={addAllowlist} style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" required placeholder="investor@firm.com" style={{ ...inputSt, flex: '1', minWidth: '200px' }} />
              <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Notes (optional)" style={{ ...inputSt, flex: '1', minWidth: '200px' }} />
              <button type="submit" style={{ padding: '12px 24px', background: '#C49A3C', color: '#060C1A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Add Email</button>
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Email', 'Notes', 'Added', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {allowlist.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={tdSt}>{a.email}</td>
                    <td style={{ ...tdSt, color: 'rgba(255,255,255,0.4)' }}>{a.notes || '—'}</td>
                    <td style={tdSt}>{fmt(a.added_at)}</td>
                    <td style={tdSt}><button onClick={() => removeAllowlist(a.id)} style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '11px', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>Remove</button></td>
                  </tr>
                ))}
                {allowlist.length === 0 && <tr><td colSpan={4} style={{ ...tdSt, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px' }}>No allowlisted emails.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ACCESS LOG */}
        {!loading && tab === 'access-log' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Last {log.length} records</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Email', 'File', 'Action', 'IP', 'Time'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {log.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={tdSt}>{l.email}</td>
                    <td style={{ ...tdSt, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.6)' }}>{l.file_path}</td>
                    <td style={{ ...tdSt, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', color: l.action === 'download' ? '#C49A3C' : '#2590B8' }}>{l.action}</td>
                    <td style={{ ...tdSt, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l.ip_address || '—'}</td>
                    <td style={{ ...tdSt, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{fmt(l.accessed_at)}</td>
                  </tr>
                ))}
                {log.length === 0 && <tr><td colSpan={5} style={{ ...tdSt, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '40px' }}>No access events yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const tdSt: React.CSSProperties = { padding: '12px', color: 'rgba(255,255,255,0.75)', verticalAlign: 'top' };
const inputSt: React.CSSProperties = { padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Inter',sans-serif", outline: 'none' };
