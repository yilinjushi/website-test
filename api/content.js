
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
      // 设置缓存控制头：禁用 CDN 缓存，因为内容是可变的
      // 使用 private, no-cache 确保每次请求都验证内容是否最新
      // 避免管理员更新后 CDN 返回旧缓存的问题
      res.setHeader('Cache-Control', 'private, no-cache, must-revalidate');
      res.setHeader('Content-Type', 'application/json');
      
      // 1. 在 Blob 中查找文件
      const { blobs } = await list({ prefix: DB_FILENAME, limit: 1 });
      
      // 2. 如果没找到，返回 null (使用前端默认内容)
      if (!blobs || blobs.length === 0) {
        return res.status(200).json(null);
      }

      // 3. 如果找到了，获取下载链接并读取内容
      // 添加时间戳参数避免缓存（包括 CDN 和服务端缓存）
      // 由于使用 addRandomSuffix: false，同一个 URL 会被重复使用，需要时间戳来确保缓存失效
      const blobUrl = blobs[0].url;
      const response = await fetch(`${blobUrl}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (!response.ok) {
        throw new Error('无法从 Blob 读取内容');
      }

      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    // POST: 保存内容
    if (req.method === 'POST') {
      // 安全检查：验证密码
      const serverPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const clientPassword = req.headers['x-admin-password'];

      if (clientPassword !== serverPassword) {
        return res.status(401).json({ error: 'Unauthorized: Invalid password' });
      }

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

