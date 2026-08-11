import nodemailer from 'nodemailer';
import { env, isSmtpConfigured } from '../config/env.js';

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (!transporter) {
    console.log(`✉️  [email skipped — SMTP not configured] To: ${to} | Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
}

export function isEmailConfigured(): boolean {
  return isSmtpConfigured;
}
