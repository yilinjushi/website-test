
import React from 'react';

interface NavbarProps {
  isScrolled: boolean;
  isAdmin?: boolean;
  content: {
    links: Array<{ label: string; id: string }>;
    login: string;
    action: string;
  };
  onUpdate: (key: string, val: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled, isAdmin, content, onUpdate }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkUpdate = (index: number, newLabel: string) => {
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], label: newLabel };
    onUpdate('links', newLinks);
  };

  const editStyle = isAdmin ? 'focus:outline-white focus:outline-dashed focus:outline-1 focus:bg-white/5 cursor-text px-2 mx-[-8px]' : '';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center">
            <span className="text-xl font-bold tracking-[0.4em] uppercase">VS CODE</span>
            {/* Visual indicator for admin mode when enabled */}
            {isAdmin && (
              <span className="ml-4 px-2 py-0.5 bg-blue-600 text-[8px] font-bold tracking-widest uppercase rounded-sm">Admin</span>
            )}
          </button>
          
          <div className="hidden lg:flex items-center space-x-8">
            {content.links.map((link, idx) => (
              <button 
                key={link.id} 
                onClick={() => !isAdmin && scrollTo(link.id)} 
                className={`text-[10px] font-bold tracking-[0.2em] text-white hover:text-zinc-400 transition-colors uppercase ${editStyle}`}
                contentEditable={isAdmin}
                onBlur={(e) => handleLinkUpdate(idx, e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            className={`hidden md:block text-xs font-bold tracking-widest hover:text-zinc-400 transition-colors uppercase ${editStyle}`}
            contentEditable={isAdmin}
            onBlur={(e) => onUpdate('login', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          >
            {content.login}
          </button>
          <button className="px-6 py-2 border border-white text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all uppercase">
            <span
              contentEditable={isAdmin}
              onBlur={(e) => onUpdate('action', e.currentTarget.textContent || '')}
              suppressContentEditableWarning
              className={editStyle}
            >
              {content.action}
            </span>
          </button>
          <button className="lg:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
