import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    // 1. Decode Pub/Sub notification
    const decoded = JSON.parse(atob(body.data.message.data));
    const currentHistoryId = String(decoded.historyId);

    // 2. Get Gmail access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // 3. Load previous historyId from SyncState entity
    const existing = await base44.asServiceRole.entities.SyncState.list();
    const syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      // First run: save baseline historyId
      await base44.asServiceRole.entities.SyncState.create({ history_id: currentHistoryId });
      return Response.json({ status: 'initialized' });
    }

    // 4. Fetch new messages since last historyId
    const prevHistoryId = syncRecord.history_id;
    const historyRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${prevHistoryId}&historyTypes=messageAdded`,
      { headers: authHeader }
    );
    if (!historyRes.ok) {
      return Response.json({ status: 'history_error', detail: await historyRes.text() });
    }
    const historyData = await historyRes.json();

    const addedMessages = (historyData.history || [])
      .flatMap(h => h.messagesAdded || [])
      .map(m => m.message);

    // 5. For each new message, fetch details and send notification email
    for (const msg of addedMessages) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
        { headers: authHeader }
      );
      if (!msgRes.ok) continue;
      const msgData = await msgRes.json();

      const headers = msgData.payload?.headers || [];
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
      const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';

      // Send notification email
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'jiayuzou1123@gmail.com',
        subject: `📬 New Inquiry: ${subject}`,
        body: `A new email has arrived in your inbox that may be a customer inquiry.\n\nFrom: ${from}\nSubject: ${subject}\n\nLog in to Gmail to view and reply.`,
      });
    }

    // 6. Update stored historyId
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { history_id: currentHistoryId });

    return Response.json({ status: 'ok', processed: addedMessages.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});