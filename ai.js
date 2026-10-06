// Vercel serverless function: POST /api/ai
// Uses Google Gemini with a server-side key. Set GEMINI_API_KEY in Vercel → Settings → Environment Variables.
// The browser never sees the key. Model defaults to gemini-flash-latest; override with GEMINI_MODEL.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY is not set in Vercel environment variables' });
  const { system, prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
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
    const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || []).map(p => p.text).join('');
    return res.status(200).json({ text });
  } catch (e) { return res.status(500).json({ error: String(e.message || e) }); }
}
