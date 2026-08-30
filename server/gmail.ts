import { google } from "googleapis";

/**
 * Gmail service using standard Google OAuth2 credentials.
 *
 * Required env vars:
 *   GMAIL_CLIENT_ID        - Google OAuth client ID
 *   GMAIL_CLIENT_SECRET    - Google OAuth client secret
 *   GMAIL_REFRESH_TOKEN    - OAuth2 refresh token (from consent flow)
 *   GMAIL_SENDER_EMAIL     - "From" address for outgoing mail
 */

function getOAuth2Client() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Gmail OAuth credentials not configured. " +
        "Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN env vars."
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function buildRawEmail(to: string, subject: string, htmlBody: string): string {
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || "noreply@truenorthugc.com";
  const boundary = "boundary_" + Date.now();
  const lines = [
    `From: TrueNorthUGC <${senderEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ];
  const raw = lines.join("\r\n");
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const auth = getOAuth2Client();
    const gmail = google.gmail({ version: "v1", auth });
    const raw = buildRawEmail(to, subject, htmlBody);
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
    return { success: true, messageId: result.data.id ?? undefined };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendBulkEmails(
  emails: string[],
  subject: string,
  htmlBody: string
): Promise<Array<{ email: string; success: boolean; messageId?: string; error?: string }>> {
  const results = [];
  for (const email of emails) {
    const result = await sendEmail(email, subject, htmlBody);
    results.push({ email, ...result });
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return results;
}
