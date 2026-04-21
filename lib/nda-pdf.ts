import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

interface AuditData {
  full_name: string;
  organization: string;
  email: string;
  signed_at: string;
  ip_address: string;
  ip_city: string;
  ip_region: string;
  ip_country: string;
  user_agent: string;
  signature_method: string;
  signature_data?: string;
  nda_version: string;
}

export async function generateSignedNda(audit: AuditData): Promise<Uint8Array> {
  const ndaPath = path.join(process.cwd(), 'public', 'nda.pdf');
  const ndaBytes = fs.readFileSync(ndaPath);
  const doc = await PDFDocument.load(ndaBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Overlay investor name on page 1 at the blank line
  const page1 = doc.getPage(0);
  const { height } = page1.getSize();
  page1.drawText(audit.full_name, {
    x: 280,
    y: height - 668,
    size: 11,
    font: helvetica,
    color: rgb(0, 0, 0),
  });

  // Append audit page
  const auditPage = doc.addPage([612, 792]);
  const margin = 50;
  let y = 750;

  const line = (label: string, value: string, bold = false) => {
    auditPage.drawText(label, {
      x: margin,
      y,
      size: 9,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    auditPage.drawText(value || '—', {
      x: margin + 160,
      y,
      size: 9,
      font: bold ? helveticaBold : helvetica,
      color: rgb(0, 0, 0),
    });
    y -= 18;
  };

  auditPage.drawText('SIGNATURE AUDIT RECORD', {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: rgb(0.06, 0.47, 0.27),
  });
  y -= 8;
  auditPage.drawLine({ start: { x: margin, y }, end: { x: 562, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  y -= 22;

  line('Full Name:', audit.full_name);
  line('Organization:', audit.organization || '');
  line('Email:', audit.email);
  line('Signed At (UTC):', audit.signed_at);
  line('IP Address:', audit.ip_address || '');
  line('Location:', [audit.ip_city, audit.ip_region, audit.ip_country].filter(Boolean).join(', '));
  line('Signature Method:', audit.signature_method);
  line('NDA Version:', audit.nda_version);
  y -= 10;
  auditPage.drawText('User Agent:', { x: margin, y, size: 9, font: helveticaBold, color: rgb(0.2, 0.2, 0.2) });
  y -= 14;
  const ua = audit.user_agent || '';
  for (let i = 0; i < ua.length; i += 90) {
    auditPage.drawText(ua.slice(i, i + 90), { x: margin, y, size: 8, font: helvetica, color: rgb(0.3, 0.3, 0.3) });
    y -= 12;
  }

  // Embed signature image if drawn
  if (audit.signature_method === 'drawn' && audit.signature_data) {
    try {
      const base64Data = audit.signature_data.replace(/^data:image\/png;base64,/, '');
      const imgBytes = Buffer.from(base64Data, 'base64');
      const img = await doc.embedPng(imgBytes);
      y -= 10;
      auditPage.drawText('Signature:', { x: margin, y, size: 9, font: helveticaBold, color: rgb(0.2, 0.2, 0.2) });
      y -= 70;
      auditPage.drawImage(img, { x: margin, y, width: 200, height: 60 });
      y -= 10;
    } catch {
      // skip if image embed fails
    }
  }

  y -= 20;
  auditPage.drawText(
    'This audit record was generated automatically by silverlakes-landing.vercel.app.',
    { x: margin, y, size: 8, font: helvetica, color: rgb(0.5, 0.5, 0.5) }
  );

  return doc.save();
}
