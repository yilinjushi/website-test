
import React from 'react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-black py-20 px-6 border-t border-zinc-900 pb-32">
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-1">
          <span className="text-lg font-bold tracking-[0.4em] uppercase">VS CODE</span>
          <p className="mt-4 text-xs text-zinc-500 max-w-xs leading-relaxed">
            The world's most advanced code editor terminal, built for the next generation of developers.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">Product</h4>
          <ul className="space-y-4 text-[10px] font-bold tracking-widest uppercase">
            <li><a href="#" className="hover:text-zinc-400">Terminal</a></li>
            <li><a href="#" className="hover:text-zinc-400">Editor</a></li>
            <li><a href="#" className="hover:text-zinc-400">Extensions</a></li>
            <li><a href="#" className="hover:text-zinc-400">Remote</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">Developers</h4>
          <ul className="space-y-4 text-[10px] font-bold tracking-widest uppercase">
            <li><a href="#" className="hover:text-zinc-400">API Docs</a></li>
            <li><a href="#" className="hover:text-zinc-400">GitHub</a></li>
            <li><a href="#" className="hover:text-zinc-400">Insiders</a></li>
            <li><a href="#" className="hover:text-zinc-400">Releases</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">Company</h4>
          <ul className="space-y-4 text-[10px] font-bold tracking-widest uppercase">
            <li><a href="#" className="hover:text-zinc-400">About</a></li>
            <li><a href="#" className="hover:text-zinc-400">Press</a></li>
            <li><a href="#" className="hover:text-zinc-400">Careers</a></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6 uppercase">Stay Connected</h4>
          <div className="flex space-x-4 mb-8">
            <SocialIcon icon="X" />
            <SocialIcon icon="YT" />
            <SocialIcon icon="GH" />
          </div>
          {onAdminClick && (
            <button 
              onClick={onAdminClick}
              className="text-[9px] font-bold tracking-[0.2em] text-zinc-700 hover:text-white transition-colors uppercase border-b border-zinc-900 hover:border-white pb-1"
            >
              Admin Entrance
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <span>VS Code © 2024</span>
          <a href="#" className="hover:text-zinc-400">Privacy</a>
          <a href="#" className="hover:text-zinc-400">Terms</a>
        </div>
        <div>
          <span>Crafted for Developers Anywhere</span>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => (
  <div className="w-8 h-8 border border-zinc-800 flex items-center justify-center hover:border-zinc-400 transition-colors cursor-pointer text-[10px] font-bold">
    {icon}
  </div>
);
