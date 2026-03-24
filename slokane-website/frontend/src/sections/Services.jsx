import { Reveal, SectionTag, GradientDivider } from '../components/UI.jsx';

const SERVICES = [
  { num:'01', icon:'📢', title:'PR Consultancy Services',       featured:false,
    items:['Public & Investor Relations','Media Publicity & Relations','Content Development','News Tracking & Newsletters'] },
  { num:'02', icon:'🎯', title:'Market Identity Development',   featured:true,
    items:['Market Distribution of Products','Web & Collateral Design','Client Content Development','Advertisement Space Selling'] },
  { num:'03', icon:'🔗', title:'Supply Chain Management',       featured:false,
    items:['Multi-sector SCM Solutions','Jantayu Aurveda Network','BioImmune Distribution','Orissa Prawn – Guwahati'] },
];

const OFFICES = [
  { label:'Head Office',   city:'Hyderabad',  addr:'Plot No. 85, V. Puram, PO – Sainikpuri, Hyderabad – 500 094' },
  { label:'Branch Office', city:'Guwahati',   addr:'H. No. 16, ARB Road, Panbazar, Guwahati – 781 001' },
];

export default function Services() {
  return (
    <section id="services" className="relative py-28 bg-gradient-to-b from-ink-900 to-ink-800 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ember/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">

        <Reveal className="text-center mb-16">
          <SectionTag>Quick Access</SectionTag>
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            Core <em className="text-ember not-italic">Service</em> Pillars
          </h2>
          <p className="text-smoke-light font-outfit max-w-xl mx-auto leading-relaxed">
            From PR strategy to supply chain — SlokaNE provides end-to-end solutions to SMEs, MNCs, Fortune 500 and UN organizations.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className={`group relative overflow-hidden rounded-2xl border p-8 cursor-default transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]
                ${s.featured ? 'bg-gradient-to-b from-ember/15 to-ember/5 border-ember/30' : 'bg-white/[0.02] border-white/8 hover:border-ember/20 hover:bg-ember/5'}`}>
                <div className="absolute top-4 right-4 font-fraunces text-8xl font-bold text-white/3 leading-none select-none group-hover:text-ember/8 transition-colors duration-300">{s.num}</div>
                <div className="text-3xl mb-5">{s.icon}</div>
                <h3 className="font-fraunces text-xl font-bold text-cream mb-5 leading-tight">{s.title}</h3>
                <ul className="space-y-3">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-smoke-light font-outfit">
                      <span className="text-ember mt-0.5 text-xs flex-shrink-0">↗</span>{item}
                    </li>
                  ))}
                </ul>
                {s.featured && (
                  <div className="mt-6 pt-5 border-t border-ember/20">
                    <span className="text-[10px] text-ember font-outfit font-bold tracking-widest uppercase">Most Popular</span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <GradientDivider className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFICES.map(o => (
            <Reveal key={o.city}>
              <div className="flex gap-5 p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-ember/25 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-ember/10 border border-ember/20 flex items-center justify-center text-xl flex-shrink-0">🏢</div>
                <div>
                  <div className="text-[10px] text-ember font-outfit font-bold tracking-widest uppercase mb-0.5">{o.label}</div>
                  <div className="font-fraunces font-bold text-cream text-base mb-1">{o.city}</div>
                  <p className="text-smoke-light text-sm font-outfit leading-relaxed">{o.addr}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
