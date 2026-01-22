
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. 检查 KV 是否配置
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    const errorMsg = '环境配置未加载: 请在 Vercel 控制台进入 Deployments 页面，点击最新部署右侧的三个点，选择 Redeploy 以加载数据库密钥。';
    console.error(errorMsg);
    
    // 如果是 GET 请求，返回 null 防止前端白屏
    if (req.method === 'GET') {
       return res.status(200).json(null); 
    }
    // 如果是保存请求，返回具体错误
    return res.status(500).json({ error: errorMsg });
  }

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
    console.error('KV Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
