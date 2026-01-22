
import React, { useRef, useState } from 'react';

interface HeroProps {
  content: { title: string; subtitle: string; bg: string };
  isAdmin: boolean;
  onUpdate: (key: string, val: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export const Hero: React.FC<HeroProps> = ({ content, isAdmin, onUpdate, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const url = await onUpload(file);
      if (url) {
        onUpdate('bg', url);
      }
      setIsUploading(false);
    }
  };

  const editStyle = isAdmin ? 'focus:outline-white focus:outline-dashed focus:outline-1 focus:bg-white/5 cursor-text relative z-30' : '';

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={content.bg} 
          alt="Terminal Hero" 
          className="w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none"></div>
      </div>

      {/* Admin Background Control */}
      {isAdmin && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[40] flex flex-col items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white text-black px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {isUploading ? '正在上传...' : '从电脑上传背景图片'}
          </button>
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 text-center px-6 pointer-events-none">
        <h1 
          contentEditable={isAdmin}
          onBlur={(e) => onUpdate('title', e.currentTarget.textContent || '')}
          suppressContentEditableWarning
          className={`text-5xl md:text-8xl lg:text-[120px] font-extrabold tracking-tighter leading-none mb-6 animate-fade-in text-glow transition-all pointer-events-auto ${editStyle}`}
        >
          {content.title}
        </h1>
        <p 
          contentEditable={isAdmin}
          onBlur={(e) => onUpdate('subtitle', e.currentTarget.textContent || '')}
          suppressContentEditableWarning
          className={`text-lg md:text-2xl text-zinc-300 font-light tracking-widest uppercase max-w-3xl mx-auto mb-12 transition-all pointer-events-auto ${editStyle}`}
        >
          {content.subtitle}
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
          <button 
            disabled={isAdmin}
            className={`w-full md:w-64 py-4 bg-white text-black text-sm font-bold tracking-[0.2em] transition-colors uppercase ${isAdmin ? 'opacity-80' : 'hover:bg-zinc-200'}`}
          >
            <span contentEditable={isAdmin} suppressContentEditableWarning className={isAdmin ? 'cursor-text px-2' : ''}>Try in Browser</span>
          </button>
          <button 
            disabled={isAdmin}
            onClick={() => !isAdmin && scrollToFeatures()}
            className={`w-full md:w-64 py-4 border border-white text-white text-sm font-bold tracking-[0.2em] transition-colors uppercase ${isAdmin ? 'opacity-80' : 'hover:bg-white hover:text-black'}`}
          >
            <span contentEditable={isAdmin} suppressContentEditableWarning className={isAdmin ? 'cursor-text px-2' : ''}>Learn More</span>
          </button>
        </div>
      </div>

      <button 
        onClick={scrollToFeatures}
        aria-label="Scroll to Content"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group hover:scale-125 transition-transform duration-300 z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  );
};
