import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);
export const FROM = process.env.RESEND_FROM!;

export async function sendOtpEmail(email: string, otp: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Silver Lakes Data Room Access Code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;">
        <h2 style="color:#060C1A;margin-bottom:8px;">Silver Lakes Sports Park</h2>
        <p style="color:#444;margin-bottom:24px;">Your one-time access code:</p>
        <div style="background:#f5f5f5;border-radius:8px;padding:24px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:bold;color:#060C1A;">${otp}</div>
        <p style="color:#888;font-size:13px;margin-top:24px;">Valid for 15 minutes. Do not share this code.</p>
      </div>
    `,
  });
}

export async function sendInvestorNdaCopy(email: string, name: string, pdfBuffer: Buffer) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Signed NDA — Silver Lakes Sports Park',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#060C1A;">Thank you for signing, ${name}.</h2>
        <p style="color:#444;">Your executed Confidentiality and Use Agreement for Silver Lakes Sports Park is attached. You now have access to the investor data room.</p>
        <p style="color:#888;font-size:13px;margin-top:24px;">Three Lions Capital Management, LLC</p>
      </div>
    `,
    attachments: [{ filename: 'Silver-Lakes-NDA-Signed.pdf', content: pdfBuffer }],
  });
}

export async function sendAdminNotification(data: {
  full_name: string;
  email: string;
  organization: string;
  ip_address: string;
  ip_city: string;
  ip_region: string;
  ip_country: string;
  signed_at: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_NOTIFICATION_EMAIL!,
    subject: `NDA Signed — ${data.full_name}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;">
        <h3>New NDA Signature — Silver Lakes</h3>
        <table style="border-collapse:collapse;">
          ${Object.entries(data).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#444;">${k}</td><td style="padding:4px 0;color:#000;">${v}</td></tr>`).join('')}
        </table>
      </div>
    `,
  });
}
