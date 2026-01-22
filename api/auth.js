
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    
    // 从 Vercel 环境变量获取密码，如果没有设置，默认为 'admin123'
    // 建议在 Vercel 后台 Settings > Environment Variables 中添加 ADMIN_PASSWORD
    const serverPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === serverPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
