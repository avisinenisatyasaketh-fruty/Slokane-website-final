import { useState, useRef, useEffect } from 'react';
import { useScrolled, useActiveSection } from '../hooks/index.js';
import { useAuth } from '../App.jsx';

const NAV_LINKS = [
  { id: 'products',  label: 'Products' },
  { id: 'about',     label: 'About' },
  { id: 'services',  label: 'Quick Access' },
  { id: 'contact',   label: 'Contact' },
];
const ALL_SECTIONS = ['home','products','about','services','scm','clients','contact'];

export default function Navbar({ onSignIn, onAccount }) {
  const scrolled = useScrolled(60);
  const active   = useActiveSection(ALL_SECTIONS);
  const [open, setOpen]       = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef(null);
  const { user, logout } = useAuth();

  const goto = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <>
      <nav className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-ink-900/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'bg-transparent'
      }`} style={{ top: '32px' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => goto('home')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ember flex items-center justify-center font-fraunces font-bold text-white text-lg shadow-[0_0_20px_rgba(224,92,26,0.4)]">S</div>
            <div className="text-left leading-none">
              <div className="font-fraunces font-bold text-cream text-lg">Sloka<span className="text-ember">NE</span></div>
              <div className="text-smoke text-[9px] tracking-[0.2em] uppercase font-outfit mt-0.5">Consultancy · SCM · Manufacturing</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 list-none">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <button onClick={() => goto(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-outfit font-medium tracking-wide transition-all duration-200 ${
                    active === id ? 'text-ember bg-ember/10' : 'text-smoke-light hover:text-cream hover:bg-white/5'
                  }`}>{label}</button>
              </li>
            ))}
          </ul>

          {/* Right — Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropdown(v => !v)}
                  className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border border-white/10 hover:border-ember/40 transition-all duration-200 bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-ember flex items-center justify-center text-white font-bold text-sm font-fraunces">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-outfit font-medium text-cream">{user.name?.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 text-smoke-light transition-transform ${dropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-ink-800 shadow-[0_16px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/8">
                      <div className="text-sm font-outfit font-semibold text-cream">{user.name}</div>
                      <div className="text-xs font-outfit text-smoke-light mt-0.5 truncate">{user.email}</div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setDropdown(false); onAccount(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-outfit text-smoke-light hover:text-cream hover:bg-white/5 transition-all text-left">
                        <span>📦</span> My Orders
                      </button>
                      <button onClick={() => { setDropdown(false); onAccount(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-outfit text-smoke-light hover:text-cream hover:bg-white/5 transition-all text-left">
                        <span>👤</span> My Account
                      </button>
                    </div>
                    <div className="border-t border-white/8 py-1">
                      <button onClick={() => { setDropdown(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-outfit text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onSignIn}
                className="flex items-center gap-2 px-5 py-2.5 bg-ember text-white text-sm font-outfit font-semibold rounded-full
                  transition-all duration-300 hover:bg-ember-dark hover:shadow-[0_4px_20px_rgba(224,92,26,0.4)] hover:-translate-y-0.5">
                <span>→</span> Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(v => !v)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-30 bg-ink-900 flex flex-col items-center justify-center gap-5 transition-all duration-500 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} style={{ top: '32px' }}>
        {[{ id:'home', label:'Home' }, ...NAV_LINKS].map(({ id, label }) => (
          <button key={id} onClick={() => goto(id)}
            className="font-fraunces text-5xl font-bold text-white/20 hover:text-gold-light transition-colors duration-300">
            {label}
          </button>
        ))}
        <div className="flex gap-4 mt-4">
          {user ? (
            <>
              <button onClick={() => { setOpen(false); onAccount(); }} className="btn-primary px-8 py-3">My Account</button>
              <button onClick={() => { setOpen(false); logout(); }} className="btn-secondary px-8 py-3">Sign Out</button>
            </>
          ) : (
            <button onClick={() => { setOpen(false); onSignIn(); }} className="btn-primary text-base px-10 py-4">→ Sign In</button>
          )}
        </div>
      </div>
    </>
  );
}
