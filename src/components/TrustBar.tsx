import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export default function TrustBar() {
  const USPList = [
    {
      id: 'usp-1',
      icon: Truck,
      title: 'Free Worldwide Shipping',
      desc: 'Complimentary carbon-neutral express on all orders over $150',
    },
    {
      id: 'usp-2',
      icon: RotateCcw,
      title: '30-Day Easy Returns',
      desc: 'Simple paperless returns & exchanges processed within 48 hours',
    },
    {
      id: 'usp-3',
      icon: ShieldCheck,
      title: 'A-Grade Secure Checkout',
      desc: 'Fully encrypted Stripe gateway protecting your financial integrity',
    },
    {
      id: 'usp-4',
      icon: Sparkles,
      title: 'Curated Sustainability',
      desc: 'GOTS organic fabrics sourced exclusively from zero-waste partners',
    },
  ];

  return (
    <div id="trust-bar-container" className="border-y border-stone-200 bg-stone-100 py-6">
      <div id="trust-bar-grid" className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {USPList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={`usp-${item.id}`}
              className="flex items-start gap-4 transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-stone-50 select-none">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-sans font-medium text-stone-900 text-sm tracking-tight">{item.title}</h4>
                <p className="mt-0.5 text-xs text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
