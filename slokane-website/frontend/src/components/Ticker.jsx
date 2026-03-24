const ITEMS = [
  '• PRE-ORDER OPENING SOON',
  '• NEW PRODUCTS COMING SOON',
  '• Q4 2026 LINEUP',
  '• PREMIUM MOGRA AGARBATTI',
  '• NOW AVAILABLE IN HYDERABAD & GUWAHATI',
  '• MAKE IN INDIA 🇮🇳',
  '• 25+ YEARS OF EXCELLENCE',
  '• YOUR COMPANION IN PRAYER & PROGRESS',
];

export default function Ticker() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ember overflow-hidden h-8 flex items-center">
      <div className="ticker-content text-white text-[10px] font-outfit font-semibold tracking-[0.15em]">
        {repeated.map((item, i) => (
          <span key={i} className="mx-6">{item}</span>
        ))}
      </div>
    </div>
  );
}
