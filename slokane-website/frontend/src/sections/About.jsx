import { Reveal, SectionTag, GradientDivider } from '../components/UI.jsx';

const PILLARS = [
  { icon:'📢', title:'PR Consultancy',   desc:'Public & investor relations, media publicity, content development, news tracking and newsletters.' },
  { icon:'🎯', title:'Market Identity',  desc:'Market distribution, web & collateral design, content development, and advertisement space selling.' },
  { icon:'🔗', title:'Supply Chain',     desc:'End-to-end SCM across Ayurveda, bio-fertilizers, and aquaculture verticals.' },
  { icon:'🏭', title:'Manufacturing',    desc:'In-house premium Agarbatti production under the SlokaNE brand — 3 variants, expanding to 6 soon.' },
];

const COMMS = [
  { name:'India Today Group',              detail:'All special supplements for AP & Telangana' },
  { name:'Fussion Basket Communications',  detail:'Barter services & media solutions' },
  { name:'Airtel Payment Bank',            detail:'Recruitment solution partner' },
  { name:'TMI Network',                    detail:'SBI 3rd-party recruitment solutions' },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-ember/5 blur-[160px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <Reveal>
              <SectionTag>Who We Are</SectionTag>
              <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream leading-tight mt-2 mb-6">
                25+ Years of <em className="text-ember not-italic">Trust</em><br />&amp; Expertise
              </h2>
              <p className="text-smoke-light leading-relaxed mb-4 font-outfit">
                Sloka NE and Communications was started by a group of professionals with more than 25 years of
                experience across India. We are a full-service agency providing end-to-end consultancy-related
                solutions and support across India.
              </p>
              <p className="text-smoke-light leading-relaxed mb-6 font-outfit">
                Based in Hyderabad, with a branch office in Guwahati catering to 8 northeastern states —
                Sloka has associates present in all major metros in India.
              </p>
              <blockquote className="border-l-2 border-ember pl-5 py-1 font-fraunces italic text-lg text-cream/80 mb-6">
                "More than 90% of our clients have been doing business with us since we first partnered."
              </blockquote>
              <div className="flex flex-wrap gap-2">
                {['GST: 36ASDPS6316E1ZR','Make in India 🇮🇳','Pan-India Network','8 NE States'].map(t => (
                  <span key={t} className="text-xs px-3.5 py-1.5 rounded-full border border-white/10 text-smoke-light font-outfit font-medium bg-white/3">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} dir="right">
                <div className="group p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-ember/5 hover:border-ember/30 transition-all duration-300 hover:-translate-y-1 cursor-default">
                  <div className="text-2xl mb-3">{p.icon}</div>
                  <h4 className="font-fraunces font-bold text-cream text-base mb-1.5">{p.title}</h4>
                  <p className="text-smoke-light text-sm leading-relaxed font-outfit">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <GradientDivider className="mb-20" />

        {/* Partners */}
        <div>
          <Reveal>
            <SectionTag>Marketing Communications</SectionTag>
            <h3 className="font-fraunces text-3xl font-bold text-cream mt-2 mb-10">
              Our <em className="text-ember not-italic">Active Partners</em>
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMS.map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                    <span className="text-gold text-lg">★</span>
                  </div>
                  <h4 className="font-fraunces font-bold text-cream text-sm mb-1 leading-tight">{c.name}</h4>
                  <p className="text-smoke-light text-xs leading-relaxed font-outfit">{c.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
