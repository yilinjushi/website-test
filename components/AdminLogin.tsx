
import React, { useState, useEffect, useRef } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动聚焦输入框
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setLoading(false);
        onLogin(password);
      } else {
        // 错误处理：显示错误状态，清空密码，3秒后自动关闭
        setLoading(false);
        setError(true);
        setPassword(''); 
        setTimeout(() => {
            onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Auth failed', err);
      setLoading(false);
      setError(true);
      setTimeout(() => {
          onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* 蓝色边框容器，匹配截图风格 */}
      <div className="w-full max-w-[500px] p-12 bg-black border-2 border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.2)] relative">
        
        <h2 className="text-2xl font-bold tracking-[0.4em] uppercase mb-12 text-center text-white">管理员登录</h2>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">管理密码</label>
            <div className="relative">
                <input 
                  ref={inputRef}
                  type="password" 
                  className={`w-full bg-zinc-950 border ${error ? 'border-red-500 text-red-500' : 'border-zinc-800 focus:border-blue-600'} py-4 px-5 text-white placeholder-zinc-700 outline-none transition-all duration-300 tracking-widest text-lg`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
            </div>
            {/* 错误提示区域 */}
            <div className={`h-4 overflow-hidden transition-all duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                   密码不正确 (3秒后自动关闭)
                </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className="py-4 border border-zinc-800 text-zinc-400 text-[10px] font-bold tracking-[0.2em] hover:border-zinc-600 hover:text-white transition-all uppercase"
            >
              取消
            </button>
            <button 
              type="submit"
              disabled={loading}
              className={`py-4 text-[10px] font-bold tracking-[0.2em] transition-all uppercase flex justify-center items-center ${
                loading 
                  ? 'bg-zinc-600 text-zinc-300 cursor-wait' 
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
