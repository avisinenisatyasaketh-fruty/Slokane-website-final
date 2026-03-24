import { useState, useEffect } from 'react';
import { useAuth } from '../App.jsx';

const STATUS_COLORS = {
  pending:    'text-amber-400 bg-amber-400/10 border-amber-400/20',
  confirmed:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  shipped:    'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  delivered:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled:  'text-red-400 bg-red-400/10 border-red-400/20',
};
const STATUS_ICONS = { pending:'⏳', confirmed:'✅', processing:'⚙️', shipped:'🚚', delivered:'📦', cancelled:'❌' };

function OrderCard({ order, onCancel }) {
  const sc = STATUS_COLORS[order.status] || 'text-smoke-light';
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-ember/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-smoke font-outfit tracking-widest uppercase mb-1">Order #{order.id}</div>
          <div className="font-fraunces font-bold text-cream text-base">{order.product_name}</div>
          {order.variant && <div className="text-xs text-smoke-light font-outfit mt-0.5">{order.variant}</div>}
        </div>
        <span className={`text-[10px] font-outfit font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${sc}`}>
          {STATUS_ICONS[order.status]} {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          ['Qty', order.quantity],
          ['Total', `₹${parseFloat(order.total_amount).toFixed(2)}`],
          ['Tracking', order.tracking_id],
          ['Date', new Date(order.created_at).toLocaleDateString('en-IN')],
        ].map(([k,v]) => (
          <div key={k}>
            <div className="text-[10px] text-smoke uppercase tracking-widest font-outfit">{k}</div>
            <div className="text-sm font-outfit text-cream font-semibold mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-smoke-light font-outfit bg-white/3 rounded-lg p-3 border border-white/6 mb-3">
        📍 {order.address}, {order.city} - {order.pincode}
      </div>

      {['pending','confirmed'].includes(order.status) && (
        <button onClick={() => onCancel(order.id)}
          className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-outfit font-semibold hover:bg-red-500/10 transition-all duration-200">
          Cancel Order
        </button>
      )}
    </div>
  );
}

export default function AccountPanel({ open, onClose }) {
  const { user, token, logout, setUser } = useAuth();
  const [tab,    setTab]    = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name:'', phone:'' });
  const [profStatus, setProfStatus] = useState('idle');
  const [profMsg, setProfMsg] = useState('');

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  useEffect(() => {
    if (open && user && token && tab === 'orders') fetchOrders();
  }, [open, tab, user, token]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/orders/my', { headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {}
    setLoading(false);
  };

  const cancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res  = await fetch(`/api/orders/${id}/cancel`, { method:'PATCH', headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      if (data.success) fetchOrders();
      else alert(data.message);
    } catch {}
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfStatus('loading'); setProfMsg('');
    try {
      const res  = await fetch('/api/auth/profile', {
        method:'PUT',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setUser(u => ({ ...u, ...profile }));
        localStorage.setItem('slokane_user', JSON.stringify({ ...user, ...profile }));
        setProfStatus('success'); setProfMsg('Profile updated successfully!');
      } else { setProfStatus('error'); setProfMsg(data.message); }
    } catch { setProfStatus('error'); setProfMsg('Server error.'); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md bg-ink-800 border-l border-white/8 flex flex-col h-full shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        style={{ animation:'slideIn .4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ember flex items-center justify-center font-fraunces font-bold text-white text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-fraunces font-bold text-cream text-base">{user?.name}</div>
              <div className="text-xs text-smoke-light font-outfit">{user?.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-smoke-light hover:text-cream text-sm transition-all">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8">
          {[['orders','📦 My Orders'],['profile','👤 Profile']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3.5 text-sm font-outfit font-semibold transition-all ${
                tab===t ? 'text-ember border-b-2 border-ember bg-ember/5' : 'text-smoke-light hover:text-cream'
              }`}>{l}</button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Orders Tab */}
          {tab === 'orders' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-fraunces font-bold text-cream text-lg">Your Orders</h3>
                <button onClick={fetchOrders} className="text-xs text-ember font-outfit hover:text-ember-light">↻ Refresh</button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📦</div>
                  <div className="font-fraunces font-bold text-cream text-lg mb-2">No orders yet</div>
                  <p className="text-smoke-light text-sm font-outfit">Browse our products and place your first order!</p>
                  <button onClick={onClose} className="mt-5 btn-primary text-sm px-6 py-2.5">
                    Shop Now →
                  </button>
                </div>
              ) : (
                orders.map(o => <OrderCard key={o.id} order={o} onCancel={cancelOrder} />)
              )}
            </>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-4">
              <h3 className="font-fraunces font-bold text-cream text-lg mb-2">My Profile</h3>

              <div className="p-4 rounded-xl bg-white/3 border border-white/6 space-y-2">
                <div className="text-[10px] text-smoke uppercase tracking-widest font-outfit">Account Email</div>
                <div className="text-sm text-smoke-light font-outfit">{user?.email}</div>
                <div className="text-[10px] text-smoke-light font-outfit">Email cannot be changed</div>
              </div>

              <div>
                <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Full Name *</label>
                <input value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} placeholder="Your full name" className="input-dark" required />
              </div>
              <div>
                <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Mobile Number</label>
                <input value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} type="tel" placeholder="10-digit mobile number" className="input-dark" />
                <p className="text-[10px] text-smoke-light font-outfit mt-1.5">Used for order SMS notifications</p>
              </div>

              <button type="submit" disabled={profStatus==='loading'}
                className="w-full py-3.5 bg-ember text-white font-outfit font-bold text-sm rounded-xl hover:bg-ember-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {profStatus==='loading' ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : 'Save Changes'}
              </button>
              {profStatus==='success' && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-outfit text-center">✓ {profMsg}</div>}
              {profStatus==='error'   && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-outfit text-center">✗ {profMsg}</div>}
            </form>
          )}
        </div>

        {/* Footer — Logout */}
        <div className="px-5 py-4 border-t border-white/8">
          <button onClick={() => { logout(); onClose(); }}
            className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-outfit font-semibold text-sm hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2">
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
