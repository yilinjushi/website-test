
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await kv.get('vscode_landing_content');
      return res.status(200).json(data || null);
    } 
    
    if (req.method === 'POST') {
      const content = req.body;
      await kv.set('vscode_landing_content', content);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
