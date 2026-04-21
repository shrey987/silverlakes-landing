import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdminSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabaseAdmin
    .from('sl_allowlist')
    .select('*')
    .order('added_at', { ascending: false });

  return NextResponse.json({ allowlist: data || [] });
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email, notes } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('sl_allowlist')
    .upsert({ email: email.toLowerCase().trim(), notes }, { onConflict: 'email' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await supabaseAdmin.from('sl_allowlist').delete().eq('id', id);
  return NextResponse.json({ success: true });
}
