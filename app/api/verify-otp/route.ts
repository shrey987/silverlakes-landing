import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { signSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  const normalizedEmail = email.toLowerCase().trim();

  // Get most recent unused, non-expired OTP
  const { data: records } = await supabaseAdmin
    .from('sl_email_verifications')
    .select('*')
    .eq('email', normalizedEmail)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (!records || records.length === 0) {
    return NextResponse.json({ error: 'Code expired or not found. Request a new one.' }, { status: 400 });
  }

  const record = records[0];

  if (record.attempts >= 5) {
    return NextResponse.json({ error: 'Too many wrong attempts. Request a new code.' }, { status: 400 });
  }

  const valid = await bcrypt.compare(otp, record.token);

  if (!valid) {
    await supabaseAdmin
      .from('sl_email_verifications')
      .update({ attempts: record.attempts + 1 })
      .eq('id', record.id);
    return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 });
  }

  // Mark used
  await supabaseAdmin
    .from('sl_email_verifications')
    .update({ used_at: new Date().toISOString() })
    .eq('id', record.id);

  // Upsert investor
  await supabaseAdmin
    .from('sl_investors')
    .upsert({ email: normalizedEmail, email_verified_at: new Date().toISOString() }, { onConflict: 'email' });

  // Check if already signed NDA
  const { data: existing } = await supabaseAdmin
    .from('sl_nda_signatures')
    .select('id')
    .eq('email', normalizedEmail)
    .limit(1);

  // Check allowlist
  const { data: allowlisted } = await supabaseAdmin
    .from('sl_allowlist')
    .select('id')
    .eq('email', normalizedEmail)
    .limit(1);

  const alreadySigned = (existing?.length ?? 0) > 0 || (allowlisted?.length ?? 0) > 0;

  const token = await signSession({
    email: normalizedEmail,
    verified_at: new Date().toISOString(),
    signed: alreadySigned,
  });

  const response = NextResponse.json({
    redirect: alreadySigned ? '/data-room' : '/sign-nda',
  });

  response.cookies.set('sl_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
