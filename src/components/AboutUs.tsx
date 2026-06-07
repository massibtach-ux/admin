import { motion } from 'motion/react';
import { Info, Leaf, Users, ShieldAlert } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: Leaf,
      title: 'Radial Eco-Consciousness',
      desc: '100% of our supply fabrics are fully GOTS carbon-neutral certified. Every yarn is spun using dynamic solar grids.',
    },
    {
      icon: Users,
      title: 'Human-First Conditions',
      desc: 'Our Lisbon and Porto ateliers guarantee living wages, healthcare, safe ergonomic spaces, and educational sponsorships.',
    },
    {
      icon: ShieldAlert,
      title: 'Anti-Warp Longevity',
      desc: 'We construct garments at heavy weights (up to 500GSM fleece) to guarantee a lifetime of regular washes without shrinkage.',
    },
  ];

  return (
    <motion.div
      id="about-us-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl px-4 py-12"
    >
      {/* Editorial Title */}
      <div id="about-header" className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">THE ARCHIVE</span>
        <h2 className="mt-2 text-4xl font-sans font-semibold tracking-tight text-stone-900 sm:text-5xl">
          Crafting Modern Armor
        </h2>
        <div className="mx-auto mt-4 h-1 w-12 bg-stone-900"></div>
      </div>

      {/* Grid: Story & Vision */}
      <div id="about-grid" className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center mb-20">
        <div>
          <img
            src="https://images.unsplash.com/photo-1558821840-2a63f95609a7?q=80&w=800"
            alt="Atelier manufacturing process"
            className="w-full h-96 object-cover rounded-xl filter grayscale contrast-115 shadow-xl border border-stone-200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-sans font-semibold text-stone-900 tracking-tight">
            Designed for Everyday Confidence.
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Founded in 2024 by childhood friends Clara Vance and Nathan Drake, our collective began as a reaction against fragile, micro-trend streetwear that degrades past three cycles in a washing machine.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            We spent eight months touring small Portuguese knitting mills searching for the absolute heavier yarn blends. What we unlocked was a proprietary 500GSM loopback cotton fleece that falls into a gorgeous structural slouch—never clinging, always shielding.
          </p>
          <blockquote className="border-l-2 border-stone-900 pl-4 py-2 text-stone-900 font-sans italic text-sm font-medium">
            "Confidence isn\'t loud. It\'s the quiet structural density of what you wrap yourself with."
            <span className="block mt-1 text-xs text-stone-500 font-mono not-italic">— Clara & Nathan, Founders</span>
          </blockquote>
        </div>
      </div>

      {/* Values Boxed Layout */}
      <div id="about-values" className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 mb-20">
        <h3 className="text-xl font-sans font-semibold tracking-tight uppercase text-center mb-10 text-stone-300">
          Our Architectural Values
        </h3>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} id={`value-card-${idx}`} className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-stone-800 text-stone-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-sans font-medium text-stone-100">{v.title}</h4>
                <p className="text-stone-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Cost Structure Breakdown (High Conversion Strategy!) */}
      <div id="honest-pricing" className="border border-stone-200 bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-sans font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Info className="h-4 w-4 text-stone-600 shrink-0" />
              Honest Cost Transparency
            </h3>
            <p className="text-xs text-stone-500">How we spend your money to guarantee elite ethical standards.</p>
          </div>
          <div className="px-3 py-1 bg-stone-100 border border-stone-200 rounded text-[11px] font-mono font-medium text-stone-600">
            BASED ON OUR $110 BOXY HOODIE
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-center mb-6">
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg">
            <span className="block font-mono text-xs text-stone-400">RAW COTTON</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-1">$14.50</span>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg">
            <span className="block font-mono text-xs text-stone-400">FAIR WAGES</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-1">$12.00</span>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg">
            <span className="block font-mono text-xs text-stone-400">CARBON OFFSET</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-1">$4.20</span>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg">
            <span className="block font-mono text-xs text-stone-400">DUTIES & SHIP</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-1">$5.80</span>
          </div>
          <div className="p-3 bg-stone-900 text-stone-50 rounded-lg col-span-2 sm:col-span-1">
            <span className="block font-mono text-xs text-stone-300">TOTAL COST</span>
            <span className="block font-sans font-bold text-stone-100 text-lg mt-1">$36.50</span>
          </div>
        </div>

        <div className="bg-stone-50 rounded-lg p-4 text-xs text-stone-600 leading-relaxed">
          <strong>The Markup Insight:</strong> Traditional premium stores mark up this quality by 7x to 10x ($250+ retail). We price the Boxy Hoodie at <strong>$110</strong> (approx. 3x markup) to sustain organic portuguese workers, reinvest in zero-waste shipping grids, and preserve our absolute pricing accessibility.
        </div>
      </div>
    </motion.div>
  );
}
