import { useEffect, useRef, useState } from 'react';
import { mograImg, orangeSandalwoodWithImg, orangeSandalwoodWithoutImg } from '../assets/images.js';
import { StatCard } from '../components/UI.jsx';

function SmokeCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W * 0.6 + W * 0.2,
      y: H + Math.random() * 80,
      vy: -(Math.random() * 0.8 + 0.3),
      vx: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 40 + 15,
      a: Math.random() * 0.1 + 0.02,
    }));

    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(200,155,100,${p.a})`);
        g.addColorStop(1, 'rgba(200,155,100,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -p.r * 2) {
          p.y = H + 60;
          p.x = Math.random() * W * 0.6 + W * 0.2;
        }
      });
      raf = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  const heroSlides = [
    {
      id:'mogra',
      image:mograImg,
      alt:'SlokaNE Mogra Agarbatti',
      title:'Mogra Agarbatti 30 gm',
      note:'Without matchbox',
    },
    {
      id:'sandalwood-with',
      image:orangeSandalwoodWithImg,
      alt:'SlokaNE Orange Sandalwood with matchbox',
      title:'Orange Sandalwood 20 gm',
      note:'With matchbox',
    },
    {
      id:'sandalwood-without',
      image:orangeSandalwoodWithoutImg,
      alt:'SlokaNE Orange Sandalwood without matchbox',
      title:'Orange Sandalwood 20 gm',
      note:'Without matchbox',
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-ink-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,166,77,0.12),transparent_34%),radial-gradient(circle_at_78%_32%,rgba(255,124,26,0.08),transparent_18%),linear-gradient(135deg,#17131f_0%,#0e0a14_45%,#08060d_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
      </div>
      <SmokeCanvas />
      <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-ember/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm mb-8 opacity-0 animate-fade-up animation-fill-forwards">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-cream font-outfit font-semibold tracking-[0.15em] uppercase">Now Available</span>
              </div>

              <h1 className="font-fraunces text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 opacity-0 animate-fade-up animation-fill-forwards animation-delay-100">
                Premium Incense
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-ember">
                  Crafted with Care
                </span>
              </h1>

              <p className="text-smoke-light text-base leading-relaxed max-w-lg mb-10 font-outfit opacity-0 animate-fade-up animation-fill-forwards animation-delay-200">
                Sloka NE brings you handcrafted agarbatti with 25+ years of manufacturing expertise.
                Available in Mogra and orange sandalwood variants, made in India with the finest natural ingredients.
              </p>

              <div className="flex flex-wrap gap-4 mb-14 opacity-0 animate-fade-up animation-fill-forwards animation-delay-300">
                <button onClick={() => goto('products')} className="btn-primary">View Product Catalog</button>
                <button onClick={() => goto('contact')} className="btn-secondary">Contact Sales</button>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/8 opacity-0 animate-fade-up animation-fill-forwards animation-delay-400">
                <StatCard num={25} suffix="+" label="Years Experience" />
                <div className="w-px h-10 bg-white/10" />
                <StatCard num={3} label="Variants Available" />
                <div className="w-px h-10 bg-white/10" />
                <StatCard num={90} suffix="%" label="Client Retention" />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end opacity-0 animate-fade-left animation-fill-forwards animation-delay-200">
              <div className="relative">
                <div className="gradient-border p-5 w-full max-w-md shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                  <div className="overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.4)] aspect-[4/3] flex items-center justify-center p-3">
                    <div
                      className="flex transition-transform duration-700 ease-out w-full h-full"
                      style={{ transform:`translateX(-${activeSlide * 100}%)` }}
                    >
                      {heroSlides.map((slide) => (
                        <div key={slide.id} className="w-full h-full shrink-0 bg-white flex items-center justify-center">
                          <img
                            src={slide.image}
                            alt={slide.alt}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="flex items-center gap-2">
                      {heroSlides.map((slide, index) => (
                        <button
                          key={slide.id}
                          type="button"
                          aria-label={`Show ${slide.title}`}
                          onClick={() => setActiveSlide(index)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            index === activeSlide ? 'w-8 bg-ember' : 'w-2.5 bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.3)] animate-float-delay">
                  <div className="text-[10px] text-gray-400 font-outfit font-semibold tracking-widest uppercase">Status</div>
                  <div className="text-sm font-fraunces font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Make in India
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center pb-8 gap-2 text-white/25">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-ember/60 animate-pulse" />
        <span className="text-[10px] tracking-[0.3em] uppercase font-outfit">Scroll</span>
      </div>
    </section>
  );
}
