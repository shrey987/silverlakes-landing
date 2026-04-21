'use client';

import { useState, useEffect } from 'react';

interface FileItem {
  name: string;
  id: string | null;
  metadata?: { size?: number; mimetype?: string };
}

function getExt(name: string) { return name.split('.').pop()?.toLowerCase() || ''; }
function isFolder(item: FileItem) { return item.id === null; }
function isUrl(name: string) { return getExt(name) === 'url'; }
function isPdf(name: string) { return getExt(name) === 'pdf'; }
function isImage(name: string) { return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(getExt(name)); }
function isVideo(name: string) { return ['mp4', 'mov', 'avi'].includes(getExt(name)); }
function isSpreadsheet(name: string) { return ['xlsx', 'xls', 'csv'].includes(getExt(name)); }

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(name: string) {
  if (isPdf(name)) return '📄';
  if (isSpreadsheet(name)) return '📊';
  if (isImage(name)) return '🖼️';
  if (isVideo(name)) return '🎬';
  if (isUrl(name)) return '🔗';
  return '📎';
}

export default function DataRoomBrowser({ email }: { email: string }) {
  const [path, setPath] = useState('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    load(path);
  }, [path]);

  async function load(p: string) {
    setLoading(true);
    const res = await fetch(`/api/data-room/files?path=${encodeURIComponent(p)}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  function navigate(folderName: string) {
    const newPath = path ? `${path}/${folderName}` : folderName;
    setPath(newPath);
    setBreadcrumbs(newPath.split('/').filter(Boolean));
  }

  function goToBreadcrumb(idx: number) {
    const parts = breadcrumbs.slice(0, idx + 1);
    const newPath = parts.join('/');
    setPath(newPath);
    setBreadcrumbs(parts);
  }

  function goHome() { setPath(''); setBreadcrumbs([]); }

  async function handleDownload(name: string, action: 'view' | 'download') {
    const filePath = path ? `${path}/${name}` : name;
    const url = `/api/data-room/download?path=${encodeURIComponent(filePath)}&action=${action}`;
    if (action === 'view') {
      window.open(url, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060C1A', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '8px' }}>THREE LIONS CAPITAL</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400, color: '#fff' }}>Investor Data Room</h1>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
            <div>{email}</div>
            <div style={{ marginTop: '4px', fontSize: '10px', color: 'rgba(196,154,60,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>NDA Signed</div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button onClick={goHome} style={crumbBtn(path === '')}>Data Room</button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>/</span>
              <button onClick={() => goToBreadcrumb(i)} style={crumbBtn(i === breadcrumbs.length - 1)}>{crumb}</button>
            </span>
          ))}
        </div>

        {/* File list */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,25,41,0.5)' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>This folder is empty.</div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px', marginRight: '14px', flexShrink: 0 }}>
                  {isFolder(item) ? '📁' : fileIcon(item.name)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isFolder(item) ? (
                    <button onClick={() => navigate(item.name)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                      {item.name}
                    </button>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{item.name}</span>
                  )}
                  {!isFolder(item) && item.metadata?.size && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{formatSize(item.metadata.size)}</div>
                  )}
                </div>

                {/* Actions */}
                {!isFolder(item) && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    {isUrl(item.name) ? (
                      <UrlLinkButton path={path} name={item.name} />
                    ) : (
                      <>
                        {(isPdf(item.name) || isImage(item.name)) && (
                          <button onClick={() => handleDownload(item.name, 'view')} style={actionBtn('#1B6B8A')}>View</button>
                        )}
                        <button onClick={() => handleDownload(item.name, 'download')} style={actionBtn('#C49A3C')}>Download</button>
                      </>
                    )}
                  </div>
                )}

                {isFolder(item) && (
                  <button onClick={() => navigate(item.name)} style={{ ...actionBtn('transparent'), border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}>
                    Open →
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
          Confidential &middot; PDFs are watermarked with your email address &middot; Do not distribute
        </div>
      </div>
    </div>
  );
}

function UrlLinkButton({ path, name }: { path: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const filePath = path ? `${path}/${name}` : name;
    fetch(`/api/data-room/download?path=${encodeURIComponent(filePath)}&action=view`)
      .then(r => r.text())
      .then(text => {
        const match = text.match(/URL=(.+)/i);
        if (match) setUrl(match[1].trim());
      })
      .catch(() => {});
  }, [path, name]);

  if (!url) return <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Loading...</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ ...actionBtn('#1B6B8A'), textDecoration: 'none' }}>
      Watch Video →
    </a>
  );
}

function crumbBtn(active: boolean): React.CSSProperties {
  return { background: 'none', border: 'none', color: active ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', fontWeight: active ? 600 : 400, padding: '0' };
}

function actionBtn(bg: string): React.CSSProperties {
  return { padding: '6px 16px', background: bg, color: bg === 'transparent' ? undefined : '#060C1A', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' };
}
