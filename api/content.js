
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 获取当前环境所有变量名（不包含值，安全）
  const envKeys = Object.keys(process.env).filter(key => key.startsWith('KV_') || key.startsWith('BLOB_'));
  
  // 1. 检查 KV 是否配置
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    const debugInfo = envKeys.length > 0 ? `检测到的变量: ${envKeys.join(', ')}` : '未检测到任何 KV/Blob 变量';
    
    const errorMsg = `数据库连接失败。\n\n原因：当前部署版本未包含数据库密钥。\n\n调试信息：${debugInfo}\n\n解决方法：请不要刷新旧链接。请回到 Vercel Dashboard，点击最新一次部署（刚刚 Redeploy 的那个）产生的【Visit】按钮访问新地址。`;
    
    console.error(errorMsg);
    
    // 如果是 GET 请求，返回 null 让前端使用默认内容
    if (req.method === 'GET') {
       return res.status(200).json(null); 
    }
    // 如果是 POST 请求，返回具体错误
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
    console.error('KV Operation Error:', error);
    return res.status(500).json({ error: 'Database Error: ' + error.message });
  }
}
