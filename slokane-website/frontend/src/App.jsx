import { useState, useEffect, createContext, useContext } from 'react';
import Ticker       from './components/Ticker.jsx';
import Navbar       from './components/Navbar.jsx';
import SignInModal  from './components/SignInModal.jsx';
import Hero         from './sections/Hero.jsx';
import Products     from './sections/Products.jsx';
import About        from './sections/About.jsx';
import Services     from './sections/Services.jsx';
import { SCM, Clients } from './sections/SCMClients.jsx';
import Contact      from './sections/Contact.jsx';
import Footer       from './sections/Footer.jsx';
import AccountPanel from './sections/AccountPanel.jsx';
import { useCursor } from './hooks/index.js';

// Auth Context
export const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

function CustomCursor() {
  const { dot, ring } = useCursor();
  return (<><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring" /></>);
}

function Loader({ done }) {
  if (done) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-ink-900 flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-ember/20 blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-ember flex items-center justify-center shadow-[0_0_40px_rgba(224,92,26,0.5)]">
          <span className="font-fraunces font-bold text-white text-3xl">S</span>
        </div>
      </div>
      <div className="font-fraunces font-bold text-cream text-3xl tracking-tight">
        Sloka<span className="text-ember">NE</span>
      </div>
      <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ember to-gold rounded-full"
          style={{ animation: 'loadBar 1.8s cubic-bezier(0.4,0,0.2,1) forwards' }} />
      </div>
      <p className="text-smoke text-xs tracking-[0.25em] uppercase font-outfit">
        Your Companion in Prayer &amp; Progress
      </p>
      <style>{`@keyframes loadBar { from { width:0 } to { width:100% } }`}</style>
    </div>
  );
}

export default function App() {
  const [loaded,     setLoaded]     = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [user,       setUser]       = useState(null);
  const [token,      setToken]      = useState(null);
  const [showAccount, setShowAccount] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('slokane_token');
    const savedUser  = localStorage.getItem('slokane_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch { localStorage.clear(); }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('slokane_token', tokenData);
    localStorage.setItem('slokane_user',  JSON.stringify(userData));
    setSignInOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setShowAccount(false);
    localStorage.removeItem('slokane_token');
    localStorage.removeItem('slokane_user');
  };

  const authCtx = { user, token, login, logout, setUser };

  return (
    <AuthContext.Provider value={authCtx}>
      <div className="noise-overlay" />
      <CustomCursor />
      <Loader done={loaded} />
      <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <Ticker />
        <Navbar
          onSignIn={() => setSignInOpen(true)}
          onAccount={() => setShowAccount(true)}
        />
        <main>
          <Hero />
          <Products />
          <About />
          <Services />
          <SCM />
          <Clients />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* Sign In / Sign Up Modal */}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      {/* Account Panel (slide-in from right) */}
      <AccountPanel open={showAccount} onClose={() => setShowAccount(false)} />
    </AuthContext.Provider>
  );
}
