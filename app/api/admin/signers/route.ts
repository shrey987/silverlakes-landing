import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdminSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('sl_nda_signatures')
    .select('id, full_name, email, organization, signed_at, ip_address, ip_city, ip_region, ip_country, pdf_storage_path')
    .order('signed_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ signers: data });
}
