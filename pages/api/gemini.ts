import type { NextApiRequest, NextApiResponse } from 'next';

// Generic AI proxy endpoint
// Environment variables supported:
// - ALIYUN_AI_API_URL: The full HTTP endpoint to call (required)
// - ALIYUN_AI_API_KEY: API key used for Authorization header (optional)
// - ALIYUN_AI_API_KEY_HEADER: Header name to send the key in (defaults to 'Authorization')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  const endpoint = process.env.ALIYUN_AI_API_URL;
  if (!endpoint) {
    console.error('ALIYUN_AI_API_URL not set');
    return res.status(500).json({ error: 'Server misconfigured: missing endpoint' });
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const key = process.env.ALIYUN_AI_API_KEY;
    const keyHeader = process.env.ALIYUN_AI_API_KEY_HEADER || 'Authorization';
    if (key) {
      // Default to Bearer scheme if Authorization header is used
      headers[keyHeader] = keyHeader.toLowerCase() === 'authorization' && !/^bearer /i.test(key) ? `Bearer ${key}` : key;
    }

    // Forward message as JSON. Adjust body shape if your provider expects different fields.
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('AI provider error', resp.status, txt);
      return res.status(502).json({ error: 'AI provider error' });
    }

    const data = await resp.json();
    // Expect provider to return { text: '...' } or similar. Let caller decide mapping.
    const text = data?.text ?? data?.result ?? data?.answer ?? JSON.stringify(data);
    return res.status(200).json({ text });

  } catch (err) {
    console.error('AI proxy error', err);
    return res.status(500).json({ error: 'AI proxy error' });
  }
}
