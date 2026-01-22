
import React, { useRef, useState } from 'react';

interface FeatureProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  reverse?: boolean;
  isAdmin: boolean;
  onUpdate: (key: string, val: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export const Feature: React.FC<FeatureProps> = ({ title, subtitle, description, image, reverse, isAdmin, onUpdate, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const editStyle = isAdmin ? 'focus:outline-white focus:outline-dashed focus:outline-1 focus:bg-white/5 cursor-text p-1 -m-1 relative z-20' : '';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const url = await onUpload(file);
      if (url) {
        onUpdate('image', url);
      }
      setIsUploading(false);
    }
  };

  return (
    <section className="py-12 md:py-24 overflow-hidden border-t border-zinc-900 relative">
      <div className={`max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <div className={`space-y-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          <h3 
            contentEditable={isAdmin}
            onBlur={(e) => onUpdate('title', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
            className={`text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase transition-all ${editStyle}`}
          >
            {title}
          </h3>
          <h2 
            contentEditable={isAdmin}
            onBlur={(e) => onUpdate('subtitle', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
            className={`text-4xl md:text-6xl font-extrabold tracking-tighter uppercase transition-all ${editStyle}`}
          >
            {subtitle}
          </h2>
          <p 
            contentEditable={isAdmin}
            onBlur={(e) => onUpdate('description', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
            className={`text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl transition-all ${editStyle}`}
          >
            {description}
          </p>
          <div className="pt-4 relative z-20">
            <div className="group flex items-center space-x-2 text-xs font-bold tracking-widest uppercase cursor-default">
              <span className={editStyle} contentEditable={isAdmin} suppressContentEditableWarning>SEE THE TECH</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className={`${reverse ? 'lg:order-1' : 'lg:order-2'} relative`}>
          <div className="aspect-[4/3] bg-zinc-900 rounded-sm overflow-hidden shadow-2xl relative group">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-1000"
            />
            {isAdmin && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-30 gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={isUploading}
                  className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl scale-90 group-hover:scale-100 transition-transform flex items-center gap-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {isUploading ? '上传中...' : '本地上传图片'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
