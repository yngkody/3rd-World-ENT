// B O R N — release the Evey viewing URL at 8:30 PM EDT, October 2, 2026.
// IMPORTANT: This is a time gate, not ticket authentication. Evey must restrict ticket access.
const UNLOCK_AT = Date.parse("2026-10-02T20:00:00Z");

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const now = Date.now();
  if (now < UNLOCK_AT) {
    return res.status(200).json({ unlocked: false, unlockAt: new Date(UNLOCK_AT).toISOString(), serverNow: new Date(now).toISOString() });
  }
  const url = process.env.EVEY_EVENT_URL;
  if (!url) return res.status(503).json({ unlocked: false, error: 'Viewing link is not configured yet.' });
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') throw new Error('HTTPS required');
  } catch {
    return res.status(503).json({ unlocked: false, error: 'Viewing link configuration is invalid.' });
  }
  return res.status(200).json({ unlocked: true, url });
};

