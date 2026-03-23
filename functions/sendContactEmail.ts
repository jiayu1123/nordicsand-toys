import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, company, phone, subject, message } = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const emailBody = [
      `New contact form submission from HXToys website.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "N/A"}`,
      `Phone / WhatsApp: ${phone || "N/A"}`,
      `Subject: ${subject}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    const rawEmail = [
      `To: jiayuzou1123@gmail.com`,
      `Subject: [HXToys Inquiry] ${subject} — from ${name}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      emailBody,
    ].join("\n");

    const encoded = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encoded }),
    });

    if (!res.ok) {
      const err = await res.json();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});