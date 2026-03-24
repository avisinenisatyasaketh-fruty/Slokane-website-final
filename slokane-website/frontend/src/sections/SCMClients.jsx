import { Reveal, SectionTag } from '../components/UI.jsx';

const SCM_PARTNERS = [
  {
    top:'green',
    icon:'AI',
    name:'SlokaNE Agricultural Inputs',
    loc:'Hyderabad with Guwahati distribution',
    tag:'SCM Services',
    accent:'text-emerald-400',
    border:'border-emerald-500/20',
    desc:'Strategic lobbying, purchasing, marketing and public-relations support for fertilizer and agri-input supply across Northeast India.',
    points:[
      'Potassium nitrate for vegetables: DP/offer rate 120, MRP 165.',
      'Potassium sulphate for tea fertilizer: DP/offer rate 51, MRP 78.',
      'DCP - Dicalcium phosphate for poultry feed: DP/offer rate 45, MRP 81.',
    ],
  },
  {
    top:'blue',
    icon:'FP',
    name:'Feed And Poultry Supply',
    loc:'FOB Guwahati',
    tag:'Quoted Products',
    accent:'text-blue-400',
    border:'border-blue-500/20',
    desc:'Commercial feed and livestock-support items quoted for producer groups and fertilizer clients in the region.',
    points:[
      'DCP - Dicalcium phosphate (poultry feed): DP Rs.45 per kg, MRP Rs.81.',
      'Pig grow tablet, 600 nos packing: DP Rs.345 per packet, MRP Rs.425.',
      'Potassium nitrate is also used in agarbatti manufacturing.',
    ],
  },
  {
    top:'teal',
    icon:'NE',
    name:'Northeast Supply Coverage',
    loc:'Guwahati and North East',
    tag:'Commercial Terms',
    accent:'text-teal-400',
    border:'border-teal-500/20',
    desc:'Existing supply relationships and commercial flexibility for fertilizer and allied product movement into Northeast markets.',
    points:[
      'Already supplying biofertilizers to a few parties in the North East.',
      'Rates are quoted including FOB Guwahati; GST and transportation are extra.',
      'Bulk purchase discounts and annual agreement terms can be worked out.',
    ],
  },
  {
    top:'amber',
    icon:'PG',
    name:'Producer Group Feed Support',
    loc:'Flash Focus producer-group reference',
    tag:'Procurement Lead',
    accent:'text-amber-300',
    border:'border-amber-500/20',
    desc:'The attached quotation request highlights supply planning for farmer-group scaling, combining poultry-feed minerals and livestock growth-support products.',
    points:[
      'DCP - Dicalcium phosphate (poultry feed) quoted at DP Rs.45 per kg, MRP Rs.81.',
      'Pig grow tablet in 600-nos, 2-packing format quoted at DP Rs.345 per packet, MRP Rs.425.',
      'Requirement is framed around up-scaling production and marketing-system support.',
    ],
  },
  {
    top:'violet',
    icon:'CN',
    name:'Crop Nutrition Portfolio',
    loc:'Vegetable, tea and allied input network',
    tag:'Fertilizer Range',
    accent:'text-violet-300',
    border:'border-violet-500/20',
    desc:'The reference rates show a working portfolio built for repeat fertilizer demand across vegetable cultivation, tea usage and related manufacturing-linked supply needs.',
    points:[
      'Potassium nitrate for vegetables quoted at DP/offer rate 120 with MRP 165.',
      'Potassium sulphate for tea quoted at DP/offer rate 51 with MRP 78.',
      'Potassium nitrate is also mentioned as an input used in agarbatti manufacturing.',
    ],
  },
];

const CLIENTS = [
  'ICFAI Business School','Eisai','Pharmexcil','IndPack','BioIndia Conference','SCISAT',
  'PRAJAY','BioAsia Forum','TiE International','Globion','myZingo','PBEL','SatNav',
  'Indian Seed Congress','Nexo','TM Inputs & Services','QUESS','Akshay Jewellers',
  'India Today Group','Airtel Payments Bank','Fussion Basket','TMI Network',
];

const BG = {
  green:'bg-gradient-to-br from-emerald-900 to-emerald-950',
  blue:'bg-gradient-to-br from-blue-900 to-blue-950',
  teal:'bg-gradient-to-br from-teal-900 to-teal-950',
  amber:'bg-gradient-to-br from-amber-900 to-amber-950',
  violet:'bg-gradient-to-br from-violet-900 to-violet-950',
};

export function SCM() {
  return (
    <section id="scm" className="relative py-28 bg-ink-900 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-ember/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="mb-16">
          <SectionTag>Supply Chain</SectionTag>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
            <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream mt-2">
              Supply Chain <em className="text-ember not-italic">Management</em>
            </h2>
            <p className="text-smoke-light font-outfit text-sm max-w-sm leading-relaxed">
              Fertilizer, feed and agri-input sourcing support with quoted product rates, producer-group procurement references and scalable Northeast market access.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SCM_PARTNERS.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div className={`rounded-2xl border ${p.border} overflow-hidden hover:-translate-y-2 transition-all duration-400 cursor-default`}>
                <div className={`${BG[p.top]} p-6 flex items-center gap-4`}>
                  <span className="w-12 h-12 rounded-2xl border border-white/15 bg-black/15 flex items-center justify-center text-sm font-outfit font-bold tracking-[0.18em] text-white">
                    {p.icon}
                  </span>
                  <div>
                    <div className={`text-[10px] ${p.accent} font-outfit font-bold tracking-widest uppercase mb-1`}>{p.tag}</div>
                    <div className="font-fraunces font-bold text-white text-base leading-tight">{p.name}</div>
                  </div>
                </div>
                <div className="p-5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-smoke text-sm">+</span>
                    <span className="text-smoke-light text-xs font-outfit">{p.loc}</span>
                  </div>
                  <p className="text-smoke-light text-sm leading-relaxed font-outfit">{p.desc}</p>
                  <div className="mt-4 space-y-2">
                    {p.points.map((point) => (
                      <div key={point} className="text-smoke-light text-xs leading-relaxed font-outfit border-t border-white/6 pt-2">
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section id="clients" className="py-24 bg-gradient-to-b from-ink-900 to-ink-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Reveal className="text-center">
          <SectionTag>Trusted By</SectionTag>
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            Some of Our <em className="text-ember not-italic">Clients</em>
          </h2>
          <p className="text-smoke-light font-outfit max-w-xl mx-auto">
            From Fortune 500 companies to UN organizations, spanning diverse industry verticals across India.
          </p>
        </Reveal>
      </div>
      <div className="overflow-hidden" style={{ maskImage:'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)' }}>
        <div className="marquee-track">
          {doubled.map((c, i) => (
            <span key={i} className="flex-shrink-0 px-5 py-2.5 rounded-full border border-white/8 bg-white/[0.02] text-smoke-light text-xs font-outfit font-semibold tracking-wide whitespace-nowrap hover:border-ember/30 hover:text-cream hover:bg-ember/5 transition-all duration-200 cursor-default">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
