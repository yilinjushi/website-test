
import { put } from '@vercel/blob';

// 将请求流转换为 Buffer 的辅助函数
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

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
    // 从查询参数获取原始 Content-Type，如果没有则从请求头获取，最后使用默认值
    const contentType = req.query.contentType || req.headers['content-type'] || 'application/octet-stream';

    // 2. 将上传限制在 4.5MB 以内 (Vercel Serverless 限制)
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 4500000) {
        return res.status(413).json({ error: '图片过大: 请上传小于 4.5MB 的图片' });
    }

    // 3. 读取请求体
    // 在 Vercel Functions 中，对于 application/octet-stream，req.body 会自动是 Buffer
    // 对于其他类型，可能需要手动处理
    let body;
    
    try {
      // 尝试访问 req.body（Vercel helper）
      if (req.body !== undefined && req.body !== null) {
        if (Buffer.isBuffer(req.body)) {
          // 如果已经是 Buffer，直接使用
          body = req.body;
        } else if (typeof req.body === 'string') {
          // 如果是字符串，转换为 Buffer（使用 binary 编码以保持二进制数据）
          body = Buffer.from(req.body, 'binary');
        } else {
          // 其他情况，尝试转换
          body = Buffer.from(req.body);
        }
      }
    } catch (bodyError) {
      // 如果访问 req.body 抛出错误（例如 JSON 解析错误），从流中读取
      console.log('req.body access error, reading from stream:', bodyError.message);
    }
    
    // 如果 req.body 不存在、为空或不是 Buffer，从请求流中读取
    if (!body || (Buffer.isBuffer(body) && body.length === 0)) {
      // 在 Vercel Functions 中，req 本身可能是一个可读流
      if (typeof req.on === 'function') {
        body = await streamToBuffer(req);
      } else {
        // 如果 req 不是流，返回错误
        console.error('Cannot read request body:', {
          hasBody: req.body !== undefined,
          bodyType: typeof req.body,
          contentType: contentType
        });
        return res.status(400).json({ error: '上传失败: 无法读取请求体，请检查文件是否正确上传。' });
      }
    }

    // 4. 验证 body 是否存在且不为空
    if (!body || (Buffer.isBuffer(body) && body.length === 0)) {
      console.error('Request body is empty or invalid:', {
        hasBody: req.body !== undefined,
        bodyType: typeof req.body,
        isBuffer: Buffer.isBuffer(req.body),
        contentLength: req.headers['content-length'],
        contentType: contentType
      });
      return res.status(400).json({ error: '上传失败: 请求体为空，请确保选择了有效的图片文件。' });
    }

    // 5. 执行上传
    const blob = await put(filename, body, {
      access: 'public',
      contentType: contentType
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      bodyExists: req.body !== undefined,
      bodyType: typeof req.body,
      isBuffer: Buffer.isBuffer(req.body),
      contentType: req.headers['content-type']
    });
    return res.status(500).json({ error: `上传失败: ${error.message}` });
  }
}
