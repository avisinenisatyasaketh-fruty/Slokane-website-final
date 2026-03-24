import { useState } from 'react';
import { Reveal, SectionTag } from '../components/UI.jsx';
import OrderModal from '../components/OrderModal.jsx';
import { useAuth } from '../App.jsx';
import { mograImg, orangeSandalwoodWithImg, orangeSandalwoodWithoutImg } from '../assets/images.js';

const PRODUCTS = [
  {
    id:1,
    variant:'Variant 01',
    name:'Mogra Incense Sticks',
    hindi:'Mogra Agarbatti',
    scent:'Floral · Sweet · Divine',
    price:'30.00',
    mrp:'₹30.00',
    weight:'30 gm',
    tag:'#1 Bestseller',
    image:mograImg,
    desc:'Experience the divine fragrance of Mogra, the queen of flowers. Handcrafted for daily worship, meditation and peace of mind.',
  },
  {
    id:2,
    variant:'Variant 02',
    name:'Orange Sandalwood Incense Sticks',
    hindi:'Sandal Agarbatti With Matchbox',
    scent:'Woody · Warm · Sacred',
    price:'30.00',
    mrp:'₹30.00',
    weight:'30 gm',
    tag:'Trending',
    image:orangeSandalwoodWithImg,
    desc:'Classic orange sandalwood agarbatti pack with a matchbox included. Designed for easy home use with a warm sandal fragrance suited for prayer and everyday rituals.',
  },
  {
    id:3,
    variant:'Variant 03',
    name:'Orange Sandalwood Incense Sticks',
    hindi:'Sandal Agarbatti Without Matchbox',
    scent:'Woody · Bright · Devotional',
    price:'20.00',
    mrp:'₹20.00',
    weight:'30 gm',
    tag:'New',
    image:orangeSandalwoodWithoutImg,
    desc:'Orange sandalwood agarbatti without matchbox in a compact 30 gm pack. A bright sandal note and value-focused format make it ideal for regular prayer use.',
  },
];

const UPCOMING = ['Jasmine Bliss', 'Rose Classic', 'Chandan Premium'];

function ProductCard({ p, active, onClick, onOrder }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden group hover:-translate-y-1 ${
        active
          ? 'border-ember/50 bg-gradient-to-b from-ember/10 to-transparent shadow-[0_0_40px_rgba(224,92,26,0.2)]'
          : 'border-white/8 bg-white/[0.02] hover:border-ember/25'
      }`}
    >
      <div onClick={onClick} className="cursor-pointer">
        <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-ink-700/60 to-ink-900/80 overflow-hidden">
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="h-40 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/20">
              <span className="text-xs tracking-widest uppercase font-outfit">Available</span>
            </div>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-outfit font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {p.tag}
          </span>
          <span className="absolute top-3 right-3 text-[10px] text-smoke-light font-outfit">{p.variant}</span>
        </div>
        <div className="p-5">
          <div className="text-[10px] text-ember/70 font-outfit font-semibold tracking-[0.2em] uppercase mb-1">{p.scent}</div>
          <h3 className="font-fraunces font-bold text-cream text-base mb-0.5">{p.name}</h3>
          {p.hindi ? <p className="text-smoke-light text-xs mb-2 font-light">{p.hindi}</p> : null}
          {p.desc ? <p className="text-smoke-light text-xs leading-relaxed font-outfit mb-3 line-clamp-2">{p.desc}</p> : null}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-smoke uppercase tracking-wider font-outfit">MRP (incl. taxes)</div>
              <div className="font-fraunces font-bold text-xl text-cream">{p.mrp}</div>
            </div>
            <span className="text-xs text-smoke-light border border-white/10 px-3 py-1 rounded-full font-outfit">{p.weight}</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={() => onOrder(p)}
          className="w-full py-2.5 bg-ember text-white font-outfit font-semibold text-sm rounded-xl hover:bg-ember-dark transition-all duration-200 hover:shadow-[0_4px_20px_rgba(224,92,26,0.4)]"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

function NotifyForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setState('loading');

    try {
      const res = await fetch('/api/contact/subscribe', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setState(data.success ? 'success' : 'error');
    } catch {
      setState('success');
    }
  };

  if (state === 'success') {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-outfit">
        You&apos;re on the list! We&apos;ll notify you at launch.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-3 max-w-sm mx-auto flex-wrap justify-center">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="your@email.com"
        className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-cream text-sm font-outfit outline-none focus:border-gold/40 placeholder:text-white/20"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="px-6 py-2.5 bg-gold text-ink-900 font-outfit font-bold text-sm rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {state === 'loading' ? '...' : 'Notify Me'}
      </button>
    </form>
  );
}

export default function Products() {
  const [sel, setSel] = useState(0);
  const [orderProduct, setOrderProduct] = useState(null);
  const { user } = useAuth();
  const p = PRODUCTS[sel];

  return (
    <section id="products" className="relative py-28 bg-ink-900 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="mb-14">
          <SectionTag>Manufacturing</SectionTag>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream leading-tight mt-2">
              Our <em className="text-ember not-italic">Product</em> Range
            </h2>
            <p className="text-smoke-light font-outfit text-sm max-w-sm leading-relaxed">
              Three active agarbatti variants available for Hyderabad and Guwahati distribution, with more fragrance lines expanding soon.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRODUCTS.map((prod, i) => (
            <Reveal key={prod.id} delay={i * 100}>
              <ProductCard p={prod} active={sel === i} onClick={() => setSel(i)} onOrder={setOrderProduct} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-10 text-center">
            <div className="absolute inset-0 bg-gradient-radial from-gold/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <span className="absolute inset-0 rounded-full border border-gold/20 animate-pulse-ring" />
              <span className="absolute inset-2 rounded-full border border-gold/30 animate-pulse-ring animation-delay-300" />
              <span className="text-3xl animate-spin-slow inline-block">*</span>
            </div>
            <h3 className="font-fraunces text-2xl md:text-3xl font-bold text-gold-light mb-3 relative z-10">New Products Coming Soon!</h3>
            <p className="text-smoke-light font-outfit mb-6 max-w-xl mx-auto relative z-10">
              More fragrance variants are being prepared for launch, including <strong className="text-gold">Jasmine, Rose and Chandan Premium</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-10">
              {UPCOMING.map((n) => (
                <span key={n} className="px-4 py-2 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-outfit font-semibold tracking-wide">
                  {n}
                </span>
              ))}
            </div>
            <div className="relative z-10">
              <NotifyForm />
            </div>
          </div>
        </Reveal>
      </div>

      <OrderModal open={!!orderProduct} onClose={() => setOrderProduct(null)} product={orderProduct} user={user} />
    </section>
  );
}
