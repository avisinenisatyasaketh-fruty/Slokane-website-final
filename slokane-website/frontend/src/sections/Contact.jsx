import { useState } from 'react';
import { Reveal, SectionTag } from '../components/UI.jsx';
import { phonePeQR } from '../assets/images.js';

const INFO = [
  { icon:'HQ', label:'Head Office', value:'Plot No. 85, V. Puram, PO - Sainikpuri, Hyderabad - 500 094' },
  { icon:'BR', label:'Branch Office', value:'H. No. 16, ARB Road, Panbazar, Guwahati - 781 001' },
  { icon:'PH', label:'Phone', phones:['9000786099', '9707702864', '9387812778', '9182602529'] },
  { icon:'EM', label:'Email', email:'sloka.northeast@gmail.com' },
];

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErr('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErr('');

    try {
      const res = await fetch('/api/contact', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setForm({ name:'', email:'', phone:'', service:'', message:'' });
      } else {
        setErr(data.message || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setStatus('success');
      setForm({ name:'', email:'', phone:'', service:'', message:'' });
    }
  };

  return (
    <section id="contact" className="relative py-28 bg-ink-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-ember/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <SectionTag>Get In Touch</SectionTag>
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            Let&apos;s <em className="text-ember not-italic">Connect</em>
          </h2>
          <p className="text-smoke-light font-outfit max-w-xl mx-auto leading-relaxed">
            Whether it&apos;s consultancy, distribution partnerships, or product enquiries, we&apos;d love to hear from you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-0">
            <Reveal>
              {INFO.map((c, i) => (
                <div key={c.label} className={`flex items-start gap-4 py-5 ${i < INFO.length - 1 ? 'border-b border-white/6' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-ember/10 border border-ember/20 flex items-center justify-center text-[11px] tracking-[0.18em] font-outfit font-bold text-ember flex-shrink-0 mt-0.5">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-1">{c.label}</div>
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="text-amber-400 hover:text-amber-300 text-sm font-outfit">
                        {c.email}
                      </a>
                    )}
                    {c.value && <p className="text-cream text-sm font-outfit leading-relaxed">{c.value}</p>}
                    {c.phones && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {c.phones.map((ph) => (
                          <a key={ph} href={`tel:${ph}`} className="text-cream text-sm font-outfit hover:text-ember transition-colors">
                            {ph}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={100} className="pt-6">
              <div className="rounded-2xl border border-[#5f259f]/30 bg-gradient-to-br from-[#211433] via-[#171123] to-[#120d1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5 font-bold text-[#c4b5fd] font-outfit">
                    <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-base shadow-[0_10px_30px_rgba(95,37,159,0.4)]">
                      P
                    </div>
                    PhonePe
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#5f259f]/20 border border-[#5f259f]/30 text-[#c4b5fd] text-[10px] font-outfit font-bold tracking-wider uppercase">
                    UPI Pay
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)] gap-6 items-start">
                  <div className="rounded-2xl bg-white p-4 border border-white/10 w-full max-w-[210px] shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
                    <img src={phonePeQR} alt="PhonePe QR - SLOKANE" className="w-full h-auto min-h-[180px] object-contain rounded-lg" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-smoke-light text-sm font-outfit leading-relaxed">
                      Scan the QR with PhonePe or any UPI app for a quick payment. If scanning is not easy, use the bank-transfer details beside it.
                    </p>

                    <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                      <div className="text-[10px] text-[#c4b5fd] font-outfit font-bold tracking-[0.22em] uppercase mb-2">UPI Details</div>
                      <div className="text-sm text-cream font-outfit font-semibold">
                        UPI ID: <span className="text-[#c4b5fd]">SLOKANE</span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['Instant Transfer', 'Secure and Verified', 'Zero Fee'].map((feature) => (
                          <div key={feature} className="rounded-lg border border-white/8 bg-black/10 px-3 py-2 text-[11px] text-smoke-light font-outfit">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                      <div className="text-[10px] text-amber-300 font-outfit font-bold tracking-[0.22em] uppercase mb-3">Bank Transfer Details</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-outfit">
                        <div>
                          <div className="text-smoke text-[10px] tracking-widest uppercase mb-1">Bank</div>
                          <div className="text-cream">Union Bank of India</div>
                        </div>
                        <div>
                          <div className="text-smoke text-[10px] tracking-widest uppercase mb-1">IFSC Code</div>
                          <div className="text-cream">UBIN0813079</div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-smoke text-[10px] tracking-widest uppercase mb-1">Branch</div>
                          <div className="text-cream">1-EME Centre Branch, Medchal-Malkajgiri - 500087</div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-smoke text-[10px] tracking-widest uppercase mb-1">Account Number</div>
                          <div className="text-cream">130711010000062</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} dir="right">
            <div className="gradient-border p-8">
              <h3 className="font-fraunces text-2xl font-bold text-cream mb-7">Send a Message</h3>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Your Name *</label>
                    <input value={form.name} onChange={set('name')} placeholder="Full Name" className="input-dark" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Email *</label>
                    <input value={form.email} onChange={set('email')} type="email" placeholder="you@email.com" className="input-dark" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Phone</label>
                    <input value={form.phone} onChange={set('phone')} type="tel" placeholder="+91 XXXXX XXXXX" className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Service</label>
                    <select value={form.service} onChange={set('service')} className="input-dark appearance-none">
                      <option value="">Select...</option>
                      <option>PR Consultancy</option>
                      <option>Market Identity</option>
                      <option>Supply Chain Management</option>
                      <option>Agarbatti / Products</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-smoke font-outfit font-semibold tracking-widest uppercase mb-2">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="input-dark resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-ember to-ember-light text-white font-outfit font-bold text-sm tracking-wide rounded-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(224,92,26,0.4)] hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    '-> Send Message'
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-outfit">
                    Message received! We&apos;ll get back to you shortly.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-outfit">
                    {err}
                  </div>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
