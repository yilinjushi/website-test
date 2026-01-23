
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 0. 检查密码
  const serverPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const clientPassword = req.headers['x-admin-password'];

  if (clientPassword !== serverPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  // 1. 检查 Blob 是否配置
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const errorMsg = '未检测到 Blob 存储连接: 请进入 Vercel 项目的 [Storage] 选项卡，找到您的 Blob Store 并点击 [Connect] 按钮。连接后必须 Redeploy。';
    return res.status(500).json({ error: errorMsg });
  }

  try {
    const filename = req.query.filename || 'image.png';

    // 2. 将上传限制在 4.5MB 以内 (Vercel Serverless 限制)
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 4500000) {
        return res.status(413).json({ error: '图片过大: 请上传小于 4.5MB 的图片' });
    }

    // 3. 执行上传
    const blob = await put(filename, req.body, {
      access: 'public',
      contentType: req.headers['content-type']
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: `上传失败: ${error.message}` });
  }
}
