import { useState, useEffect } from 'react';
import { useAuth } from '../App.jsx';

export default function SignInModal({ open, onClose }) {
  const { login } = useAuth();
  const [tab,    setTab]    = useState('signin');
  const [form,   setForm]   = useState({ name:'', email:'', phone:'', password:'' });
  const [status, setStatus] = useState('idle');
  const [msg,    setMsg]    = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) { setStatus('idle'); setMsg(''); }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set   = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const reset = () => { setStatus('idle'); setMsg(''); };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setMsg('');
    try {
      const url  = tab === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
      const body = tab === 'signin'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };
      const res  = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user, data.token);
        setStatus('success');
        setMsg(tab === 'signin' ? `Welcome back, ${data.user.name}!` : `Account created! Welcome, ${data.user.name}!`);
        setTimeout(() => onClose(), 1500);
      } else {
        setStatus('error'); setMsg(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error'); setMsg('Cannot connect to server. Is the backend running?');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md gradient-border p-8 shadow-[0_32px_100px_rgba(0,0,0,0.8)]"
        style={{ animation:'fadeUp .45s cubic-bezier(0.16,1,0.3,1) both' }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-smoke-light hover:text-cream text-sm transition-all">✕</button>

        <div className="flex items-center gap-3 mb-7">
          <div className="w-9 h-9 rounded-lg bg-ember flex items-center justify-center font-fraunces font-bold text-white text-lg">S</div>
          <div className="font-fraunces font-bold text-cream text-xl">Sloka<span className="text-ember">NE</span></div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/8">
          {['signin','signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); reset(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-outfit font-semibold tracking-wide transition-all duration-200 ${
                tab === t ? 'bg-ember text-white shadow-[0_4px_16px_rgba(224,92,26,0.3)]' : 'text-smoke-light hover:text-cream'
              }`}>
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Full Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="Your full name" className="input-dark" required />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Email Address *</label>
            <input value={form.email} onChange={set('email')} type="email" placeholder="you@email.com" className="input-dark" required />
          </div>
          {tab === 'signup' && (
            <div>
              <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Mobile Number (for order SMS)</label>
              <input value={form.phone} onChange={set('phone')} type="tel" placeholder="10-digit mobile number" className="input-dark" />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Password *</label>
            <input value={form.password} onChange={set('password')} type="password" placeholder="••••••••" className="input-dark" required minLength={6} />
          </div>

          <button type="submit" disabled={status === 'loading'}
            className="w-full py-3.5 bg-gradient-to-r from-ember to-ember-light text-white font-outfit font-bold text-sm tracking-wide rounded-xl
              transition-all duration-300 hover:shadow-[0_8px_30px_rgba(224,92,26,0.4)] hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2">
            {status === 'loading'
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
              : tab === 'signin' ? '→ Sign In' : '→ Create Account'
            }
          </button>

          {status === 'success' && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-outfit text-center">✓ {msg}</div>}
          {status === 'error'   && <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-outfit text-center">✗ {msg}</div>}
        </form>

        <p className="text-center text-smoke text-xs font-outfit mt-5">
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setTab(tab === 'signin' ? 'signup' : 'signin'); reset(); }}
            className="text-ember hover:text-ember-light font-semibold transition-colors">
            {tab === 'signin' ? 'Create one →' : 'Sign in →'}
          </button>
        </p>
      </div>
    </div>
  );
}
