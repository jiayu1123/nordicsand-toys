import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, company, phone, subject, message } = await req.json();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: "jiayuzou1123@gmail.com",
      subject: `[HXToys Inquiry] ${subject} — from ${name}`,
      body: `New contact form submission from HXToys website.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\nPhone / WhatsApp: ${phone || "N/A"}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});