import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession, signSession } from '@/lib/session';
import { generateSignedNda } from '@/lib/nda-pdf';
import { sendInvestorNdaCopy, sendAdminNotification } from '@/lib/resend';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { full_name, organization, signature_data, signature_method } = await req.json();

  if (!full_name || !signature_data) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Idempotency: check if already signed
  const { data: existing } = await supabaseAdmin
    .from('sl_nda_signatures')
    .select('id')
    .eq('email', session.email)
    .limit(1);

  if (existing && existing.length > 0) {
    const newToken = await signSession({ ...session, signed: true });
    const response = NextResponse.json({ redirect: '/data-room' });
    response.cookies.set('sl_session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  }

  // Get IP and geolocation
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '0.0.0.0';

  let geo = { country: '', city: '', region: '' };
  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName`);
    const geoData = await geoRes.json();
    geo = { country: geoData.country || '', city: geoData.city || '', region: geoData.regionName || '' };
  } catch {
    // geo lookup failed, continue
  }

  const userAgent = req.headers.get('user-agent') || '';
  const signedAt = new Date().toISOString();

  const auditData = {
    full_name,
    organization: organization || '',
    email: session.email,
    signed_at: signedAt,
    ip_address: ip,
    ip_city: geo.city,
    ip_region: geo.region,
    ip_country: geo.country,
    user_agent: userAgent,
    signature_method: signature_method || 'drawn',
    signature_data,
    nda_version: '4.17',
  };

  // Generate PDF
  const pdfBytes = await generateSignedNda(auditData);
  const pdfBuffer = Buffer.from(pdfBytes);

  // Upload to storage
  const storagePath = `${session.email}/${crypto.randomUUID()}.pdf`;
  await supabaseAdmin.storage
    .from('sl-signed-ndas')
    .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

  // Get investor ID
  const { data: investor } = await supabaseAdmin
    .from('sl_investors')
    .select('id')
    .eq('email', session.email)
    .single();

  // Insert signature record
  await supabaseAdmin.from('sl_nda_signatures').insert({
    investor_id: investor?.id,
    email: session.email,
    full_name,
    organization: organization || null,
    signed_at: signedAt,
    ip_address: ip,
    user_agent: userAgent,
    ip_country: geo.country,
    ip_city: geo.city,
    ip_region: geo.region,
    signature_method: signature_method || 'drawn',
    signature_data,
    nda_version: '4.17',
    pdf_storage_path: storagePath,
    audit_json: auditData,
  });

  // Update investor name/org
  await supabaseAdmin
    .from('sl_investors')
    .update({ full_name, organization: organization || null })
    .eq('email', session.email);

  // Send emails (fire and forget)
  sendInvestorNdaCopy(session.email, full_name, pdfBuffer).catch(() => {});
  sendAdminNotification({
    full_name,
    email: session.email,
    organization: organization || '',
    ip_address: ip,
    ip_city: geo.city,
    ip_region: geo.region,
    ip_country: geo.country,
    signed_at: signedAt,
  }).catch(() => {});

  // Update session
  const newToken = await signSession({ ...session, signed: true });
  const response = NextResponse.json({ redirect: '/data-room' });
  response.cookies.set('sl_session', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
