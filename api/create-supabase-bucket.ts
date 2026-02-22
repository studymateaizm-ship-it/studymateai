import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(400).json({ success: false, error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL in environment' });
    }

    const bucketName = 'study-materials';

    const resp = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ name: bucketName, public: true }),
    });

    const json = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ success: false, error: json });
    }

    return res.status(200).json({ success: true, data: json });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
