const LINKS = {
  Navigate: ['Home','Products','About','Services','SCM','Clients','Contact'],
  Services:  ['PR Consultancy','Market Identity','Supply Chain','Manufacturing','Media Comms'],
  Offices:   ['Hyderabad (H.O.)','Guwahati (Branch)','Pan-India Network'],
};

const ID_MAP = { 'Home':'home','Products':'products','About':'about','Services':'services','SCM':'scm','Clients':'clients','Contact':'contact','Hyderabad (H.O.)':'services','Guwahati (Branch)':'services','Pan-India Network':'about' };

export default function Footer() {
  const goto  = (label) => document.getElementById(ID_MAP[label] || 'home')?.scrollIntoView({ behavior:'smooth' });
  const year  = new Date().getFullYear();
  return (
    <footer className="bg-ink border-t border-white/[0.05] pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-ember flex items-center justify-center font-fraunces font-bold text-white text-lg shadow-[0_0_20px_rgba(224,92,26,0.3)]">S</div>
              <div>
                <div className="font-fraunces font-bold text-cream text-xl leading-none">Sloka<span className="text-ember">NE</span></div>
                <div className="text-smoke text-[9px] tracking-[0.2em] uppercase font-outfit mt-0.5">Consultancy · SCM · Manufacturing</div>
              </div>
            </div>
            <p className="text-smoke-light text-sm font-outfit leading-relaxed mb-4 max-w-xs">
              Your Companion in Prayer &amp; Progress. 25+ years of excellence across consultancy, supply chain and premium incense manufacturing.
            </p>
            <div className="space-y-1">
              <div className="text-smoke text-xs font-outfit">GST: <span className="text-smoke-light">36ASDPS6316E1ZR</span></div>
              <div className="text-smoke text-xs font-outfit">📞 <a href="tel:9000786099" className="text-smoke-light hover:text-cream transition-colors">9000786099</a> · <a href="tel:9707702864" className="text-smoke-light hover:text-cream transition-colors">9707702864</a></div>
              <div className="text-smoke text-xs font-outfit">✉️ <a href="mailto:sloka.northeast@gmail.com" className="text-amber-400/70 hover:text-amber-400 transition-colors">sloka.northeast@gmail.com</a></div>
            </div>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[10px] text-smoke font-outfit font-bold tracking-[0.2em] uppercase mb-5">{group}</h4>
              <ul className="space-y-3 list-none">
                {items.map(item => (
                  <li key={item}>
                    <button onClick={() => goto(item)} className="text-smoke-light text-sm font-outfit hover:text-cream transition-colors text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-smoke text-xs font-outfit tracking-wide">© {year} SlokaNE – All Rights Reserved · Made with ❤️ in India 🇮🇳</p>
          <div className="flex items-center gap-6">
            <span className="text-smoke text-xs font-outfit">Hyderabad · Guwahati · Pan-India</span>
            <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-smoke-light hover:border-ember/40 hover:text-ember transition-all duration-200 text-sm">
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
