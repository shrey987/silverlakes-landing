import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import { addWatermark } from '@/lib/watermark';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filePath = req.nextUrl.searchParams.get('path') || '';
  const action = req.nextUrl.searchParams.get('action') || 'download';

  if (!filePath) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage
    .from('sl-data-room')
    .download(filePath);

  if (error || !data) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  const filename = filePath.split('/').pop() || 'file';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const isPdf = ext === 'pdf';

  let fileBuffer = Buffer.from(await data.arrayBuffer());

  if (isPdf) {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    fileBuffer = Buffer.from(await addWatermark(new Uint8Array(fileBuffer), session.email, today));
  }

  // Log access
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  supabaseAdmin.from('sl_access_log').insert({
    email: session.email,
    file_path: filePath,
    action,
    ip_address: ip,
  }).then(() => {}, () => {});

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const disposition = action === 'view' && isPdf ? 'inline' : `attachment; filename="${filename}"`;

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
