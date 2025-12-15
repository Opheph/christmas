import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const DEFAULT_BASE = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;
  const baseURL = process.env.DASHSCOPE_BASE_URL || DEFAULT_BASE;
  const model = process.env.DASHSCOPE_MODEL || 'qwen-plus';

  if (!apiKey) {
    // Developer convenience: echo in dev when key not provided.
    if (process.env.NODE_ENV === 'development') {
      console.warn('DASHSCOPE_API_KEY not set — returning echo in development');
      return res.status(200).json({ text: `Echo (dev): ${message}` });
    }
    console.error('DASHSCOPE_API_KEY not set');
    return res.status(500).json({ error: 'Server misconfigured: missing DASHSCOPE_API_KEY' });
  }

  try {
    const client = new OpenAI({ apiKey, baseURL });

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
    });

    const text = completion?.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ text });
  } catch (err: any) {
    console.error('Dashscope API error', err?.message ?? err);
    if (process.env.NODE_ENV === 'development') {
      return res.status(502).json({ error: 'AI provider error', details: String(err) });
    }
    return res.status(502).json({ error: 'AI provider error' });
  }
}
