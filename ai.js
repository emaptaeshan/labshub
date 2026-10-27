// Vercel serverless function: /api/ai  (CommonJS so it runs without a package.json)
// GET  /api/ai            -> health check: tells you whether the key is set
// POST /api/ai {prompt,system} -> {text}
module.exports = async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  if (req.method === 'GET') return res.status(200).json({ ok: true, hasKey: !!key, model });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables and redeploy.' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { system, prompt } = body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system || '' }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: (data.error && data.error.message) || 'Model error' });
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    return res.status(200).json({ text: parts.map(p => p.text).join('') });
  } catch (e) { return res.status(500).json({ error: String(e.message || e) }); }
};
