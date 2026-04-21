import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';
import DataRoomBrowser from './DataRoomBrowser';

export default async function DataRoomPage() {
  const session = await getSession();
  if (!session) redirect('/access');

  // Check NDA signed or allowlisted
  const [{ data: sig }, { data: allowed }] = await Promise.all([
    supabaseAdmin.from('sl_nda_signatures').select('id').eq('email', session.email).limit(1),
    supabaseAdmin.from('sl_allowlist').select('id').eq('email', session.email).limit(1),
  ]);

  if ((!sig || sig.length === 0) && (!allowed || allowed.length === 0)) {
    redirect('/sign-nda');
  }

  return <DataRoomBrowser email={session.email} />;
}
