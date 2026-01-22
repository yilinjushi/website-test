
import React from 'react';

interface TestimonialsProps {
  content: Array<{ quote: string; author: string; company: string }>;
  isAdmin: boolean;
  onUpdate: (idx: number, key: string, val: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ content, isAdmin, onUpdate }) => {
  return (
    <section className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-xs font-bold tracking-[0.4em] text-zinc-500 mb-16 uppercase text-center">Developer Perspectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.map((review, index) => (
            <div key={index} className="flex flex-col space-y-8 p-8 border border-zinc-800 bg-zinc-950/50 hover:border-zinc-500 transition-colors group">
              <div 
                contentEditable={isAdmin}
                onBlur={(e) => onUpdate(index, 'quote', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
                className={`text-white text-lg md:text-xl font-light italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity ${isAdmin ? 'outline-dashed outline-1 outline-white/50 cursor-text' : ''}`}
              >
                "{review.quote}"
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <div 
                  contentEditable={isAdmin}
                  onBlur={(e) => onUpdate(index, 'author', e.currentTarget.textContent || '')}
                  suppressContentEditableWarning
                  className={`text-[10px] font-bold tracking-[0.3em] text-white uppercase mb-1 ${isAdmin ? 'outline-dashed outline-1 outline-white/50 cursor-text' : ''}`}
                >
                  {review.author}
                </div>
                <div 
                  contentEditable={isAdmin}
                  onBlur={(e) => onUpdate(index, 'company', e.currentTarget.textContent || '')}
                  suppressContentEditableWarning
                  className={`text-[9px] font-bold tracking-widest text-zinc-500 uppercase ${isAdmin ? 'outline-dashed outline-1 outline-white/50 cursor-text' : ''}`}
                >
                  {review.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
