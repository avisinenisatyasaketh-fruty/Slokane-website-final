import { useEffect, useState } from 'react';
import { useAuth } from '../App.jsx';

export default function OrderModal({ open, onClose, product }) {
  const { user, token } = useAuth();
  const getInitialForm = () => ({
    customer_name:  user?.name  || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    address: '', city: '', pincode: '',
    quantity: 1, notes: '',
  });
  const [form, setForm] = useState(getInitialForm);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [err,    setErr]    = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    setForm(getInitialForm());
    setStatus('idle');
    setResult(null);
    setErr('');
  }, [open, product, user]);

  const handleClose = () => {
    setForm(getInitialForm());
    setStatus('idle');
    setResult(null);
    setErr('');
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) { setErr('Please sign in to place an order.'); setStatus('error'); return; }
    if (!/^[6-9]\d{9}$/.test(form.customer_phone)) { setErr('Enter a valid 10-digit Indian mobile number.'); setStatus('error'); return; }
    setStatus('loading'); setErr('');

    try {
      const res  = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          product_name:   product.name,
          variant:        product.variant,
          quantity:       parseInt(form.quantity),
          price:          parseFloat(product.price),
          customer_name:  form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          address:        form.address,
          city:           form.city,
          pincode:        form.pincode,
          notes:          form.notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setResult(data);
      } else {
        setErr(data.message || 'Order failed.'); setStatus('error');
      }
    } catch {
      setErr('Cannot connect to server.'); setStatus('error');
    }
  };

  if (!open) return null;

  const total = (parseFloat(product?.price || 0) * parseInt(form.quantity)).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={status !== 'success' ? handleClose : undefined} />
      <div className="relative w-full max-w-lg gradient-border p-8 my-4 shadow-[0_32px_100px_rgba(0,0,0,0.8)]"
        style={{ animation:'fadeUp .4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {status === 'success' ? (
          /* ── Success Screen ── */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h3 className="font-fraunces font-bold text-cream text-2xl mb-2">Order Placed!</h3>
            <p className="text-smoke-light font-outfit text-sm mb-6">
              Your order has been confirmed. An SMS notification has been sent to <strong className="text-cream">{form.customer_phone}</strong>.
            </p>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5 text-left mb-6 space-y-3">
              {[
                ['Order ID',    `#${result?.orderId}`],
                ['Tracking ID', result?.tracking_id],
                ['Product',     product?.name],
                ['Quantity',    form.quantity],
                ['Total',       `₹${result?.total_amount}`],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-xs text-smoke uppercase tracking-widest font-outfit">{k}</span>
                  <span className="text-sm text-cream font-outfit font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-smoke-light text-xs font-outfit mb-5">Track your order from <strong className="text-cream">My Account → My Orders</strong></p>
            <button onClick={handleClose} className="btn-primary w-full justify-center">Continue Shopping</button>
          </div>
        ) : (
          /* ── Order Form ── */
          <>
            <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-smoke-light hover:text-cream text-sm">✕</button>

            <h3 className="font-fraunces font-bold text-cream text-xl mb-1">Place Order</h3>
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/3 border border-white/8">
              <div className="text-xl">🕯️</div>
              <div>
                <div className="text-sm font-outfit font-semibold text-cream">{product?.name}</div>
                <div className="text-xs text-smoke-light font-outfit">{product?.variant} · ₹{product?.price} each</div>
              </div>
            </div>

            {!token && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-outfit mb-4 text-center">
                ⚠️ Please <button onClick={onClose} className="underline font-semibold">Sign In</button> to place an order
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Full Name *</label>
                  <input value={form.customer_name} onChange={set('customer_name')} placeholder="Your name" className="input-dark" required />
                </div>
                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Mobile * (for SMS)</label>
                  <input value={form.customer_phone} onChange={set('customer_phone')} type="tel" placeholder="10-digit number" className="input-dark" required maxLength={10} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Email *</label>
                <input value={form.customer_email} onChange={set('customer_email')} type="email" placeholder="you@email.com" className="input-dark" required />
              </div>
              <div>
                <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Delivery Address *</label>
                <textarea value={form.address} onChange={set('address')} rows={2} placeholder="House/Flat no, Street, Area" className="input-dark resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">City *</label>
                  <input value={form.city} onChange={set('city')} placeholder="City" className="input-dark" required />
                </div>
                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Pincode *</label>
                  <input value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" className="input-dark" required maxLength={6} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Quantity</label>
                  <select value={form.quantity} onChange={set('quantity')} className="input-dark appearance-none">
                    {[1,2,3,4,5,6,10].map(n => <option key={n} value={n}>{n} pack{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="p-3 rounded-xl bg-ember/10 border border-ember/20 text-center">
                    <div className="text-[10px] text-ember uppercase tracking-widest font-outfit">Total Amount</div>
                    <div className="font-fraunces font-bold text-cream text-xl">₹{total}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Special Instructions</label>
                <input value={form.notes} onChange={set('notes')} placeholder="Any special notes (optional)" className="input-dark" />
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/6 text-xs text-smoke-light font-outfit">
                💳 Payment: Cash on Delivery (COD) · 📱 You will receive SMS updates on your mobile
              </div>

              {err && <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-outfit text-center">✗ {err}</div>}

              <button type="submit" disabled={status==='loading' || !token}
                className="w-full py-4 bg-gradient-to-r from-ember to-ember-light text-white font-outfit font-bold text-sm tracking-wide rounded-xl
                  transition-all duration-300 hover:shadow-[0_8px_30px_rgba(224,92,26,0.4)] hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2">
                {status==='loading'
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order…</>
                  : `🛒 Place Order · ₹${total}`
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
