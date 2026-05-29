'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { getComplianceStatus, formatAED, PENALTY_PER_MONTH } from '@/lib/emiratisation';
import Disclaimer from '@/components/Disclaimer';
import type { CompanyProfile } from '@/lib/types';
import { Calculator, Clock, AlertTriangle, ArrowLeft, Users, ArrowRight } from 'lucide-react';

function loadProfile(): CompanyProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tawteen_profile');
  if (!stored) return null;
  return JSON.parse(stored) as CompanyProfile;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildDelayChartData(gap: number, delayMonths: number) {
  const startMonth = new Date().getMonth();
  let cumulative = 0;
  return Array.from({ length: 12 }, (_, i) => {
    const isDelay = i < delayMonths;
    const monthly = isDelay ? gap * PENALTY_PER_MONTH : 0;
    cumulative += monthly;
    return {
      month: MONTH_NAMES[(startMonth + i) % 12],
      penalty: monthly,
      cumulative,
      isDelay,
    };
  });
}

export default function CalculatorPage() {
  const router = useRouter();
  const [profile] = useState<CompanyProfile | null>(() => loadProfile());
  const [delayMonths, setDelayMonths] = useState(3);

  useEffect(() => {
    if (!profile) router.push('/');
  }, [profile, router]);

  const status = useMemo(
    () => (profile ? getComplianceStatus(profile) : null),
    [profile]
  );

  const chartData = useMemo(
    () => (status ? buildDelayChartData(status.gap, delayMonths) : []),
    [status, delayMonths]
  );

  const totalDelayPenalty = useMemo(
    () => (status ? status.gap * PENALTY_PER_MONTH * delayMonths : 0),
    [status, delayMonths]
  );

  const monthlyCost = useMemo(
    () => (status ? status.gap * PENALTY_PER_MONTH : 0),
    [status]
  );

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDelayMonths(parseInt(e.target.value, 10));
  }, []);

  if (!profile || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const isFreeZone = status.isFreeZoneExempt;
  const noGap = status.gap === 0;

  return (
    <div className="min-h-screen bg-[#0A1628] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="text-2xl font-bold text-white">Cost of Delay</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              تكلفة التأخير — Every month you wait, you pay more
            </p>
          </div>
        </div>

        {/* Free Zone / Compliant states */}
        {isFreeZone && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center mb-6">
            <p className="text-emerald-400 font-semibold">Your company is a Free Zone entity — exempt from Emiratisation quotas.</p>
            <p className="text-gray-400 text-sm mt-1">No penalties apply to you.</p>
          </div>
        )}

        {!isFreeZone && noGap && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center mb-6">
            <p className="text-emerald-400 font-semibold">You are fully compliant — no gap, no penalties.</p>
            <p className="text-gray-400 text-sm mt-1">Keep your headcount updated on MOHRE for the next Tasdeeq audit.</p>
          </div>
        )}

        {!isFreeZone && !noGap && (
          <>
            {/* Current situation banner */}
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-red-300">Your Current Exposure</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-red-400">{status.gap}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Emirati positions unfilled</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-400">{formatAED(monthlyCost)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Penalty every month you wait</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-400">{formatAED(monthlyCost * 12)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Full year if nothing changes</p>
                </div>
              </div>
            </div>

            {/* Delay Slider */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A84C]" />
                  <h2 className="text-base font-semibold text-white">
                    How many months until you hire?
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#C9A84C]">{delayMonths}</span>
                  <span className="text-gray-400 text-sm ml-1">month{delayMonths !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-5">كم شهراً حتى تبدأ التوظيف؟</p>

              <input
                type="range"
                min={0}
                max={12}
                value={delayMonths}
                onChange={handleSlider}
                className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
                style={{
                  background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${
                    (delayMonths / 12) * 100
                  }%, #ffffff15 ${(delayMonths / 12) * 100}%, #ffffff15 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span className="text-emerald-400 font-medium">Hire now</span>
                <span>6 months</span>
                <span className="text-red-400 font-medium">12 months</span>
              </div>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5">
                <p className="text-xs text-gray-400 mb-2">Penalties paid during delay</p>
                <p className="text-3xl font-bold text-red-400">{formatAED(totalDelayPenalty)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {delayMonths === 0
                    ? 'AED 0 — hire now and pay nothing'
                    : `${delayMonths} month${delayMonths !== 1 ? 's' : ''} × ${formatAED(monthlyCost)}/mo`}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-xs text-gray-400 mb-2">Cost of waiting one more month</p>
                <p className="text-3xl font-bold text-amber-400">{formatAED(monthlyCost)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  AED 9,000 × {status.gap} unfilled position{status.gap !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-gray-400 mb-2">Saved by hiring now vs. {delayMonths}mo</p>
                <p className="text-3xl font-bold text-emerald-400">{formatAED(totalDelayPenalty)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {delayMonths === 0
                    ? 'Already acting — great'
                    : `Money back in your pocket by acting today`}
                </p>
              </div>
            </div>

            {/* Urgency message */}
            {delayMonths > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">
                  Waiting <strong>{delayMonths} month{delayMonths !== 1 ? 's' : ''}</strong> will cost{' '}
                  <strong>{formatAED(totalDelayPenalty)}</strong> in penalties before you even start hiring.
                  That money is gone — it does not go toward compliance, it is a pure loss.
                </p>
              </div>
            )}

            {/* Chart */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
              <h2 className="text-base font-semibold text-white mb-1">
                Cumulative Penalties Month by Month
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                تراكم الغرامات شهراً بشهر — Red bars = money lost during your delay period
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A1628',
                      border: '1px solid #C9A84C30',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => [
                      formatAED(Number(value)),
                      name === 'penalty' ? 'Monthly Penalty' : 'Cumulative Total',
                    ]}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  {delayMonths > 0 && (
                    <ReferenceLine
                      x={MONTH_NAMES[(new Date().getMonth() + delayMonths) % 12]}
                      stroke="#C9A84C"
                      strokeDasharray="4 4"
                      label={{
                        value: 'You hire here',
                        position: 'top',
                        fill: '#C9A84C',
                        fontSize: 11,
                      }}
                    />
                  )}
                  <Bar dataKey="penalty" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isDelay ? '#EF4444' : '#ffffff10'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-600 mt-2 text-center">
                After hiring, penalties stop. The red bars are money that cannot be recovered.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">Ready to close your gap?</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Find Emirati candidates on Nafis and other official platforms — directly from this app.
                  </p>
                </div>
              </div>
              <Link
                href="/talent"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A1628] font-bold text-sm transition-colors flex-shrink-0"
              >
                Find Emirati Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
