import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  TrendingUp,
  Percent,
  Users,
  Mail,
  RefreshCcw,
  BadgeDollarSign,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';
import { TelemetryMetrics } from '../types';

interface AdminTelemetryProps {
  metrics: TelemetryMetrics;
  onUpdateMetrics: (metrics: TelemetryMetrics) => void;
  onResetMetrics: () => void;
}

export default function AdminTelemetry({ metrics, onUpdateMetrics, onResetMetrics }: AdminTelemetryProps) {

  // Trigger simulated campaigns to show business goals in action!
  const triggerCampaign = (type: 'ig_drop' | 'abandon_email' | 'vip_loyalty' | 'tiktok_collab') => {
    let {
      visits,
      orders,
      revenue,
      cartAbandons,
      emailSignups,
      returningCustomers
    } = metrics;

    switch (type) {
      case 'ig_drop':
        // Boost visits, boost conversion rate, trigger medium AOV
        visits += 4200;
        orders += 185;
        revenue += 21275; // average $115 per order
        cartAbandons += 250; // some lookers abandon
        break;
      case 'abandon_email':
        // Heavy reduction in abandonment rate, boosts recovered order metrics
        const recoveredOrders = Math.round(cartAbandons * 0.12); // recover 12%
        cartAbandons -= recoveredOrders;
        orders += recoveredOrders;
        revenue += recoveredOrders * 115;
        returningCustomers += Math.round(recoveredOrders * 0.6);
        break;
      case 'vip_loyalty':
        // Boost loyalty repeat customer rate, increases average order value and CLV estimate
        returningCustomers += 68;
        orders += 68;
        revenue += 68 * 145; // larger VIP basket
        emailSignups += 120;
        break;
      case 'tiktok_collab':
        // Super massive boost in email subscriptions and initial site views
        visits += 6500;
        emailSignups += 1420;
        orders += 112;
        revenue += 112 * 75; // smaller starter items (beanies/tees)
        cartAbandons += 410;
        break;
    }

    // Recompute metrics according to formulas
    const totalCheckoutsTried = orders + cartAbandons;
    const computedConversion = Number(((orders / visits) * 100).toFixed(1));
    const computedAov = Number((revenue / orders).toFixed(2));
    const computedRpv = Number((revenue / visits).toFixed(2));
    const computedAbandon = Number(((cartAbandons / totalCheckoutsTried) * 100).toFixed(1));
    const computedEmailRate = Number(((emailSignups / visits) * 100).toFixed(1));
    const computedReturnRate = Number(((returningCustomers / orders) * 100).toFixed(1));
    const computedClv = Number((computedAov * (1 + computedReturnRate / 100)).toFixed(2));

    onUpdateMetrics({
      visits,
      orders,
      revenue,
      cartAbandons,
      emailSignups,
      returningCustomers,
      conversionRate: computedConversion,
      aov: computedAov,
      rpv: computedRpv,
      cartAbandonRate: computedAbandon,
      emailSignupRate: computedEmailRate,
      returningCustomerRate: computedReturnRate,
      clv: computedClv
    });
  };

  const statItems = [
    {
      id: 'stat-con',
      icon: TrendingUp,
      title: 'Conversion Rate',
      desc: 'Goal: > 3.0%',
      value: `${metrics.conversionRate}%`,
      trend: `${metrics.conversionRate >= 3.0 ? 'Optimal' : 'Needs Promo'}`,
      color: 'text-stone-900 border-stone-200'
    },
    {
      id: 'stat-aov',
      icon: BadgeDollarSign,
      title: 'Average Order Value',
      desc: 'AOV basket benchmark',
      value: `$${metrics.aov}`,
      trend: 'Target: $110+',
      color: 'text-stone-900 border-stone-200'
    },
    {
      id: 'stat-rpv',
      icon: Percent,
      title: 'Revenue Per Visitor',
      desc: 'RPV yield efficiency',
      value: `$${metrics.rpv}`,
      trend: 'Overall utility index',
      color: 'text-stone-900 border-stone-200'
    },
    {
      id: 'stat-cart',
      icon: RefreshCcw,
      title: 'Cart Abandonment',
      desc: 'Goal: < 70%',
      value: `${metrics.cartAbandonRate}%`,
      trend: `${metrics.cartAbandonRate < 70 ? 'Superior' : 'Alert: Email Cart'}`,
      color: 'text-xs text-stone-900 border-stone-250'
    },
    {
      id: 'stat-email',
      icon: Mail,
      title: 'Email Signup Rate',
      desc: 'Customer acquisition',
      value: `${metrics.emailSignupRate}%`,
      trend: 'Lead collector',
      color: 'text-stone-900 border-stone-200'
    },
    {
      id: 'stat-return',
      icon: Users,
      title: 'Returning Rate',
      desc: 'Secondary Purchase focus',
      value: `${metrics.returningCustomerRate}%`,
      trend: 'Brand commitment',
      color: 'text-stone-900 border-stone-200'
    },
    {
      id: 'stat-clv',
      icon: Award,
      title: 'Lifetime Value (CLV)',
      desc: 'Predicted lifetime value',
      value: `$${metrics.clv}`,
      trend: 'Total customer yield',
      color: 'text-stone-900 border-stone-200'
    }
  ];

  return (
    <div id="analytics-telemetry-panel" className="bg-stone-50 border-t border-stone-200 p-6 sm:p-10">
      <div id="analytics-header" className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase bg-stone-900 text-stone-50 rounded-full font-bold">
            <Activity className="h-3 w-3" />
            BUSINESS METRIC SIMULATION TELEMETRY
          </span>
          <h3 className="text-2xl font-sans font-semibold tracking-tight text-stone-900 mt-2.5">
            Streetwear Strategy & Conversion Dashboard
          </h3>
          <p className="text-xs text-stone-500 leading-normal mt-1">
            Analyze key conversion indicators in real-time. Click the active strategy triggers below to simulate and verify e-commerce objectives in action!
          </p>
        </div>
        <button
          type="button"
          id="reset-metrics-btn"
          onClick={onResetMetrics}
          className="inline-flex items-center gap-1.5 border border-stone-300 hover:border-stone-900 bg-white text-stone-700 hover:text-stone-900 text-xs font-sans font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Telemetry
        </button>
      </div>

      {/* Campaign Triggers Row */}
      <div id="campaign-triggers-wrapper" className="mx-auto max-w-7xl mb-8">
        <h4 className="text-[10px] font-mono uppercase text-stone-400 mb-3">TACTICAL CONVERSION CAMPAIGNS</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            id="campaign-ig-btn"
            onClick={() => triggerCampaign('ig_drop')}
            className="flex items-center gap-2.5 bg-white border border-stone-200 hover:border-stone-900 p-4 rounded-xl text-left cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
          >
            <div className="h-8 w-8 rounded-lg bg-orange-100 group-hover:bg-orange-500 group-hover:text-white text-orange-700 transition-colors flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-sans font-bold text-stone-900">Instagram Droplist Ad</span>
              <span className="block text-[9px] font-mono text-stone-400">Boosts traffic & AOV</span>
            </div>
          </button>

          <button
            type="button"
            id="campaign-abandon-btn"
            onClick={() => triggerCampaign('abandon_email')}
            className="flex items-center gap-2.5 bg-white border border-stone-200 hover:border-stone-900 p-4 rounded-xl text-left cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-100 group-hover:bg-indigo-500 group-hover:text-white text-indigo-700 transition-colors flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-sans font-bold text-stone-900">Abandoned Cart Mailer</span>
              <span className="block text-[9px] font-mono text-stone-400">Reduces Cart Abandon Rate</span>
            </div>
          </button>

          <button
            type="button"
            id="campaign-vip-btn"
            onClick={() => triggerCampaign('vip_loyalty')}
            className="flex items-center gap-2.5 bg-white border border-stone-200 hover:border-stone-900 p-4 rounded-xl text-left cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-500 group-hover:text-white text-emerald-700 transition-colors flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-sans font-bold text-stone-900">VIP Anniversary Code</span>
              <span className="block text-[9px] font-mono text-stone-400">Raises LTV & Returning Rate</span>
            </div>
          </button>

          <button
            type="button"
            id="campaign-tiktok-btn"
            onClick={() => triggerCampaign('tiktok_collab')}
            className="flex items-center gap-2.5 bg-white border border-stone-200 hover:border-stone-900 p-4 rounded-xl text-left cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
          >
            <div className="h-8 w-8 rounded-lg bg-yellow-100 group-hover:bg-yellow-500 group-hover:text-white text-yellow-700 transition-colors flex items-center justify-center shrink-0">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-sans font-bold text-stone-900">Tech Streetwear Collab</span>
              <span className="block text-[9px] font-mono text-stone-400">Explodes Email Subscriptions</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid of Key Strategy Indicators */}
      <div id="stats-telemetry-grid" className="mx-auto max-w-7xl grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Dynamic traffic totals */}
        <div id="dynamic-raw-traffic" className="col-span-2 lg:col-span-1 border border-stone-200 bg-stone-900 text-stone-100 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* subtle decorative line */}
          <div className="absolute right-0 bottom-0 top-0 w-1.5 bg-stone-100" />
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400">SITE TRAFFIC</span>
            <h4 className="text-3xl font-sans font-black tracking-tight mt-1">{metrics.visits.toLocaleString()}</h4>
            <p className="text-[10px] text-stone-400 font-mono mt-1">TOTAL EXPOSURES LOGGED</p>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-400">
            <span>Orders: {metrics.orders}</span>
            <span>Est. Sales: ${metrics.revenue.toLocaleString()}</span>
          </div>
        </div>

        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              id={stat.id}
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm ${stat.color}`}
            >
              <div className="flex items-start justify-between text-stone-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">{stat.title}</span>
                <Icon className="h-4 w-4 shrink-0 text-stone-400" />
              </div>
              <div className="my-3">
                <h4 className="text-2xl font-sans font-bold tracking-tight">{stat.value}</h4>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">{stat.desc}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>Status</span>
                <span className="font-sans font-semibold text-stone-900">{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
