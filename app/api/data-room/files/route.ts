import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const folderPath = req.nextUrl.searchParams.get('path') || '';

  const { data, error } = await supabaseAdmin.storage
    .from('sl-data-room')
    .list(folderPath, { limit: 500, sortBy: { column: 'name', order: 'asc' } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data || [] });
}
