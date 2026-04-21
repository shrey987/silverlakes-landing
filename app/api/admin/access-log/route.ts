import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdminSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabaseAdmin
    .from('sl_access_log')
    .select('*')
    .order('accessed_at', { ascending: false })
    .limit(500);

  return NextResponse.json({ log: data || [] });
}
