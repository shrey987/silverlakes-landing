import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdminSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data: sig } = await supabaseAdmin
    .from('sl_nda_signatures')
    .select('pdf_storage_path, full_name, email')
    .eq('id', id)
    .single();

  if (!sig?.pdf_storage_path) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error } = await supabaseAdmin.storage
    .from('sl-signed-ndas')
    .download(sig.pdf_storage_path);

  if (error || !data) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  const fileBuffer = Buffer.from(await data.arrayBuffer());
  const filename = `NDA-${sig.full_name.replace(/\s+/g, '-')}-${sig.email}.pdf`;

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
