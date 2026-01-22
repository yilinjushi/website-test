
import React from 'react';

interface SpecsProps {
  content: Array<{ label: string; value: string }>;
  isAdmin: boolean;
  onUpdate: (idx: number, key: string, val: string) => void;
}

export const Specs: React.FC<SpecsProps> = ({ content, isAdmin, onUpdate }) => {
  return (
    <section id="specs" className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-xs font-bold tracking-[0.4em] text-zinc-500 mb-12 uppercase text-center">Technical Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-0">
          {content.map((spec, idx) => (
            <div key={idx} className="border-b border-zinc-800 py-8 flex justify-between items-baseline group hover:bg-zinc-900/10 px-4 transition-colors">
              <span 
                contentEditable={isAdmin}
                onBlur={(e) => onUpdate(idx, 'label', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
                className={`text-[10px] font-bold tracking-widest text-zinc-400 uppercase ${isAdmin ? 'outline-dashed outline-1 outline-white/50 cursor-text' : ''}`}
              >
                {spec.label}
              </span>
              <span 
                contentEditable={isAdmin}
                onBlur={(e) => onUpdate(idx, 'value', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
                className={`text-sm font-medium tracking-wide text-right ${isAdmin ? 'outline-dashed outline-1 outline-white/50 cursor-text' : ''}`}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-zinc-500 text-xs font-light max-w-xl mx-auto mb-8">
                Performance metrics are based on internal testing using standard developer hardware. Actual results may vary depending on local machine resources and background processes.
            </p>
            <button className="px-12 py-4 border border-zinc-700 text-xs font-bold tracking-widest hover:border-white transition-colors uppercase">
                Download Data Sheet
            </button>
        </div>
      </div>
    </section>
  );
};
