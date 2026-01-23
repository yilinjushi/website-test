
import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // 1. 检查 Blob Token (我们在截图中确认这个是存在的)
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const errorMsg = '严重错误: Blob Token 丢失。请确保在 Vercel Storage 中连接了 Blob 数据库。';
    console.error(errorMsg);
    return res.status(500).json({ error: errorMsg });
  }

  const DB_FILENAME = 'vscode_landing_content.json';

  try {
    // GET: 读取内容
    if (req.method === 'GET') {
      // 1. 在 Blob 中查找文件
      const { blobs } = await list({ prefix: DB_FILENAME, limit: 1 });
      
      // 2. 如果没找到，返回 null (使用前端默认内容)
      if (!blobs || blobs.length === 0) {
        return res.status(200).json(null);
      }

      // 3. 如果找到了，获取下载链接并读取内容
      // 添加时间戳参数避免缓存
      const response = await fetch(`${blobs[0].url}?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('无法从 Blob 读取内容');
      }

      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    // POST: 保存内容
    if (req.method === 'POST') {
      const content = req.body;
      
      // 使用 put 覆盖上传同名文件，实现“数据库”更新效果
      // addRandomSuffix: false 确保文件名固定，像数据库一样
      await put(DB_FILENAME, JSON.stringify(content), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Storage Error:', error);
    return res.status(500).json({ error: 'Storage Error: ' + error.message });
  }
}

