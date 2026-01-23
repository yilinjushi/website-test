
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Feature } from './components/Feature';
import { Specs } from './components/Specs';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';

export interface PageContent {
  navbar: {
    links: Array<{ label: string; id: string }>;
    login: string;
    action: string;
  };
  hero: { title: string; subtitle: string; bg: string };
  features: Array<{ title: string; subtitle: string; description: string; image: string; reverse: boolean }>;
  global: { title: string; subtitle: string; image: string };
  testimonials: Array<{ quote: string; author: string; company: string }>;
  specs: Array<{ label: string; value: string }>;
  specsFooter: {
    disclaimer: string;
    buttonText: string;
  };
}

const DEFAULT_CONTENT: PageContent = {
  navbar: {
    links: [
      { label: "功能特性", id: "features" },
      { label: "技术规格", id: "specs" },
      { label: "开发者评价", id: "testimonials" },
      { label: "帮助与支持", id: "footer" }
    ],
    login: "登录",
    action: "立即获取"
  },
  hero: { 
    title: "TERMINAL", 
    subtitle: "Engineered for Speed. Built for Builders.", 
    bg: "https://picsum.photos/id/2/1920/1080" 
  },
  features: [
    { 
      title: "核心动力", 
      subtitle: "一站式工作流体验", 
      description: "无缝衔接代码编写与指令执行。VS Code 终端将高速 Shell 直接带入您的工作区，彻底消除碎片化的上下文切换，极大提升生产力。", 
      image: "https://picsum.photos/id/1/1600/900", 
      reverse: false 
    },
    { 
      title: "极致低延迟", 
      subtitle: "基于 xterm.js 的顶级性能", 
      description: "通过 GPU 加速渲染引擎体验瞬时反馈。无论是运行复杂的构建任务还是监控实时日志，终端始终能跟上您的思维速度。", 
      image: "https://picsum.photos/id/60/1600/900", 
      reverse: true 
    },
    { 
      title: "无限自定义", 
      subtitle: "定制您的专属环境", 
      description: "从 ZSH 到 PowerShell，从主题到快捷键，环境的每一处细节都可随心配置。多配置文件支持让您在数秒内于本地和云端环境间自由切换。", 
      image: "https://picsum.photos/id/180/1600/900", 
      reverse: false 
    }
  ],
  global: {
    title: "全球同步",
    subtitle: "跨设备同步您的设置和代码片段。无论身处何地使用何种硬件，VS Code 终端都是您高效工作的起点。",
    image: "https://picsum.photos/id/48/1920/1080"
  },
  testimonials: [
    {
      quote: "The low-latency rendering is a game changer. I've completely stopped using external terminals. It's the most polished developer experience I've had in years.",
      author: "SARAH CHEN",
      company: "LEAD ARCHITECT, TECHFLOW"
    },
    {
      quote: "Configuration used to be a nightmare across my machines. Now, the seamless syncing and native feel make it indispensable for our entire engineering team.",
      author: "MARCUS VANCE",
      company: "CTO, NEBULA SYSTEMS"
    },
    {
      quote: "It's rare to see a tool that combines this level of performance with such deep integration. It feels like an extension of my brain.",
      author: "ELARA VOSS",
      company: "SENIOR SRE, CLOUDSCALER"
    }
  ],
  specs: [
    { label: "Rendering Engine", value: "GPU Accelerated Canvas/WebGL" },
    { label: "Terminal Core", value: "xterm.js v5.3.0" },
    { label: "Supported Shells", value: "ZSH, Bash, PowerShell, Fish, Cmd" },
    { label: "Unicode Support", value: "Emoji, Ligatures, Powerline" },
    { label: "Performance", value: "Sub-16ms latency per frame" },
    { label: "Extension Ecosystem", value: "30,000+ Ready-to-use plugins" },
  ],
  specsFooter: {
    disclaimer: "Performance metrics are based on internal testing using standard developer hardware. Actual results may vary depending on local machine resources and background processes.",
    buttonText: "Download Data Sheet"
  }
};

const ADMIN_PATH = '/oijfoasdfadfi66165';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const globalFileInputRef = useRef<HTMLInputElement>(null);

  // 检查是否为管理路径
  const isAdminPath = window.location.pathname === ADMIN_PATH;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 添加时间戳避免浏览器缓存
        const res = await fetch(`/api/content?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          if (data) {
             // 深度合并，防止缺少 key
             const merged = { ...DEFAULT_CONTENT, ...data };
             // 特殊处理数组，如果 data 里有就用 data 的
             if (data.features) merged.features = data.features;
             if (data.testimonials) merged.testimonials = data.testimonials;
             if (data.specs) merged.specs = data.specs;
             if (data.navbar) merged.navbar = data.navbar;
             if (data.specsFooter) merged.specsFooter = data.specsFooter;
             
             setContent(merged);
          } else {
            // 如果没有数据，使用默认内容
            setContent(DEFAULT_CONTENT);
          }
        } else {
          // 如果响应不是 JSON，使用默认内容
          setContent(DEFAULT_CONTENT);
        }
      } catch (e) {
        console.error("Failed to load content", e);
        // 出错时使用默认内容
        setContent(DEFAULT_CONTENT);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 当访问管理路径时，自动显示登录界面
  useEffect(() => {
    if (isAdminPath && !isAdmin && !showLogin) {
      setShowLogin(true);
    }
  }, [isAdminPath, isAdmin, showLogin]);

  const updateContent = (path: string, value: any) => {
    if (!content) return;
    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!adminPassword) {
      alert("错误：用户未认证，请重新登录。");
      return null;
    }
    if (file.size > 4 * 1024 * 1024) {
        alert("图片太大！请上传小于 4MB 的图片。");
        return null;
    }

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'x-admin-password': adminPassword,
        },
        body: file,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        console.error("API Error (Non-JSON):", text);
        throw new Error("服务器上传配置错误，请检查 Blob 存储连接。");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.url;
    } catch (e: any) {
      console.error("Upload failed", e);
      alert(`上传失败: ${e.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleGlobalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      if (url) {
        updateContent('global.image', url);
      }
    }
  };

  const saveAndExit = async () => {
    if (!adminPassword) {
      alert("错误：用户未认证，请重新登录。");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify(content),
      });
      
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("服务器返回了非 JSON 数据，可能是 API 路由未生效。");
      }

      if (res.ok) {
        // 保存成功，内容已经在 state 中，无需重新获取
        setIsAdmin(false);
        setAdminPassword(null);
        alert('内容已成功保存并全球同步！');
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (e: any) {
      alert(`${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const editStyle = isAdmin ? 'focus:outline-white focus:outline-dashed focus:outline-1 focus:bg-white/5 cursor-text transition-all relative z-20' : '';

  // 在数据加载完成前，显示加载状态或空白页面
  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black overflow-x-hidden ${isAdmin ? 'border-4 border-blue-500/50' : ''}`}>
      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-[200]">
          <div className="h-full bg-blue-500 animate-pulse w-full"></div>
        </div>
      )}
      
      <Navbar 
        isScrolled={isScrolled} 
        isAdmin={isAdmin} 
        content={content.navbar}
        onUpdate={(key, val) => updateContent(`navbar.${key}`, val)}
      />
      
      <main>
        <Hero 
          content={content.hero} 
          isAdmin={isAdmin} 
          onUpdate={(key, val) => updateContent(`hero.${key}`, val)}
          onUpload={uploadFile}
        />
        
        <div id="features">
          {content.features.map((f, idx) => (
            <Feature 
              key={idx}
              title={f.title}
              subtitle={f.subtitle}
              description={f.description}
              image={f.image}
              reverse={f.reverse}
              isAdmin={isAdmin}
              onUpdate={(key, val) => updateContent(`features.${idx}.${key}`, val)}
              onUpload={uploadFile}
            />
          ))}
        </div>

        <section className="py-24 bg-zinc-900/30 relative">
          <div className="max-w-screen-xl mx-auto px-6 text-center">
            <h2 
              contentEditable={isAdmin}
              onBlur={(e) => updateContent('global.title', e.currentTarget.textContent)}
              suppressContentEditableWarning
              className={`text-4xl md:text-6xl font-extrabold mb-8 tracking-tighter text-glow ${editStyle}`}
            >
              {content.global.title}
            </h2>
            <p 
              contentEditable={isAdmin}
              onBlur={(e) => updateContent('global.subtitle', e.currentTarget.textContent)}
              suppressContentEditableWarning
              className={`text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light mb-12 ${editStyle}`}
            >
              {content.global.subtitle}
            </p>
            <div className="aspect-video w-full rounded-sm overflow-hidden bg-black relative group">
              <img 
                src={content.global.image} 
                alt="Global Workspace" 
                className="w-full h-full object-cover group-hover:opacity-100 transition-opacity duration-700"
              />
              {isAdmin && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-30 gap-4">
                  <input 
                    type="file" 
                    ref={globalFileInputRef} 
                    onChange={handleGlobalFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => globalFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {isUploading ? '正在上传...' : '本地上传图片'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div id="testimonials">
          <Testimonials 
            content={content.testimonials} 
            isAdmin={isAdmin} 
            onUpdate={(idx, key, val) => updateContent(`testimonials.${idx}.${key}`, val)}
          />
        </div>

        <Specs 
          content={content.specs} 
          specsFooter={content.specsFooter}
          isAdmin={isAdmin} 
          onUpdate={(idx, key, val) => updateContent(`specs.${idx}.${key}`, val)}
          onUpdateFooter={(key, val) => updateContent(`specsFooter.${key}`, val)}
        />
      </main>

      <div id="footer">
        <Footer onAdminClick={isAdminPath ? () => setShowLogin(true) : undefined} />
      </div>

      {isAdmin && (
        <div className="fixed top-24 right-6 z-[110] flex flex-col gap-4">
          <button 
            onClick={saveAndExit}
            disabled={isSaving}
            className="bg-white text-black px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? '正在同步...' : '保存并退出'}
          </button>
          <button 
            onClick={() => {
              setIsAdmin(false);
              setAdminPassword(null);
            }}
            className="bg-red-600 text-white px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase shadow-2xl hover:bg-red-700 transition-all active:scale-95"
          >
            取消修改
          </button>
        </div>
      )}

      {showLogin && (
        <AdminLogin 
          onClose={() => setShowLogin(false)} 
          onLogin={(password) => {
            setAdminPassword(password);
            setIsAdmin(true);
            setShowLogin(false);
          }} 
        />
      )}

      {/* Persistent CTA */}
      <div className={`fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-center items-center z-50 transition-transform duration-500 ${isScrolled ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full md:w-96 py-4 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase flex justify-center items-center">
          <span contentEditable={isAdmin} suppressContentEditableWarning className={isAdmin ? 'cursor-text px-4 outline-dashed outline-1 outline-black/20' : ''}>免费试用 VS CODE</span>
        </div>
      </div>
    </div>
  );
};

export default App;

