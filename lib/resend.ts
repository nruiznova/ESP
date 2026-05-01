import { Resend } from "resend";

const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Elite Superior Construction <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

interface LeadEmailData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budgetRange?: string;
}

export async function sendLeadNotification(data: LeadEmailData) {
  const resend = getResend();
  const to = process.env.CONTACT_EMAIL;
  if (!resend || !to) return;

  const { name, email, phone, projectType, description, budgetRange } = data;

  await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: `New Project Inquiry — ${name} (${projectType})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1C1410; padding: 24px; border-left: 4px solid #C0392B;">
          <h1 style="color: #F2EDE4; margin: 0; font-size: 24px;">New Project Inquiry</h1>
          <p style="color: #A89880; margin: 4px 0 0;">Elite Superior Construction</p>
        </div>
        <div style="padding: 24px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Project Type</td><td style="padding: 8px 0; text-transform: capitalize;">${projectType}</td></tr>
            ${budgetRange ? `<tr><td style="padding: 8px 0; color: #666;">Budget Range</td><td style="padding: 8px 0;">${budgetRange}</td></tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
            <p style="color: #666; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="margin: 0;">${description}</p>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
          Elite Superior Construction · Upstate South Carolina
        </div>
      </div>
    `,
  });
}
