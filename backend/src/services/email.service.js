import { Resend } from "resend";

let client = null;

const getClient = () => {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    throw new Error("RESEND_API_KEY missing. Check your .env file in backend root");
  }

  if (!client) {
    client = new Resend(key);
  }

  return client;
};

export const sendMail = async ({ to, subject, html }) => {
  try {
    const resend = getClient();

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("[email] SENT ✔");
    console.log("[email] ID:", result?.data?.id);
    console.log("[email] RESPONSE:", JSON.stringify(result, null, 2));

    return result;
  } catch (err) {
    console.error("[email] SEND FAILED:", err.message);
    throw err;
  }
};

export const verifyEmailConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const resend = getClient();

    // lightweight sanity check (optional but useful)
    if (!resend) throw new Error("Resend client failed to initialize");

    console.log("[email] Resend ready ✔");
    return true;
  } catch (err) {
    console.error("[email] not ready:", err.message);
    return false;
  }
};