import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? "Castmark <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your Castmark password",
    html: `
      <p>Someone requested a password reset for your Castmark account.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });
}
