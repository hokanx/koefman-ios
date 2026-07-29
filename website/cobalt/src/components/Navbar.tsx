import { useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';

const NAV_LINKS = ['Model', 'Range', 'Design', 'Configure'];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <a
          href="#"
          className="animate-blur-fade-up font-bold text-sm tracking-[0.3em]"
          style={{ animationDelay: '0ms' }}
        >
          COBALT
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className="animate-blur-fade-up text-sm text-white/65 transition-colors hover:text-white"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#"
          className="animate-blur-fade-up accent-glass hidden items-center gap-1.5 rounded-full px-5 py-2 text-sm lg:flex md:px-6"
          style={{ animationDelay: '300ms' }}
        >
          Reserve
          <ChevronRight size={16} />
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="animate-blur-fade-up liquid-glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
          style={{ animationDelay: '300ms' }}
        >
          <span className="relative grid h-4 w-4 place-items-center">
            <Menu
              size={18}
              className={`absolute transition-all duration-500 ${open ? 'scale-50 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
            />
            <X
              size={18}
              className={`absolute transition-all duration-500 ${open ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-180 opacity-0'}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-y border-white/10 bg-black/95 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col px-4 sm:px-6">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                className="animate-blur-fade-up border-b border-white/5 py-3 text-sm text-white/75 last:border-none"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
