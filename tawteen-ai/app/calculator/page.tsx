'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getComplianceStatus,
  getPenaltyProjection,
  getMonthlyPenaltyData,
  formatAED,
} from '@/lib/emiratisation';
import Disclaimer from '@/components/Disclaimer';
import type { CompanyProfile, MonthlyData } from '@/lib/types';
import { Calculator, TrendingDown, TrendingUp, ArrowLeft } from 'lucide-react';

interface ScenarioData {
  month: string;
  currentGap: number;
  withHires: number;
}

function readProfile(): CompanyProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tawteen_profile');
  if (!stored) return null;
  return JSON.parse(stored) as CompanyProfile;
}

export default function CalculatorPage() {
  const router = useRouter();
  const profileRef = useRef(readProfile());
  const [additionalHires, setAdditionalHires] = useState(0);
  const [maxHires, setMaxHires] = useState(10);
  const [chartData, setChartData] = useState<ScenarioData[]>([]);
  const [penaltyAvoided, setPenaltyAvoided] = useState(0);
  const [subsidyGained, setSubsidyGained] = useState(0);
  const [netPosition, setNetPosition] = useState(0);

  const recalculate = useCallback((p: CompanyProfile, hires: number) => {
    const status = getComplianceStatus(p);
    const currentGapData: MonthlyData[] = getMonthlyPenaltyData(status.gap, 12);

    const newGap = Math.max(0, status.gap - hires);
    const newGapData: MonthlyData[] = getMonthlyPenaltyData(newGap, 12);

    const combined: ScenarioData[] = currentGapData.map((d, i) => ({
      month: d.month,
      currentGap: d.cumulative,
      withHires: newGapData[i].cumulative,
    }));
    setChartData(combined);

    const proj = getPenaltyProjection(p);
    const hiresPerMonthNafis = p.educationLevel === 'bachelor' ? 8000 : 7000;

    const penalty = (status.gap - newGap) * 9000 * 12;
    const subsidy = hires * hiresPerMonthNafis * 12;
    const net = subsidy - proj.annualPenalty + newGap * 9000 * 12;

    setPenaltyAvoided(Math.max(0, penalty));
    setSubsidyGained(subsidy);
    setNetPosition(net);
  }, []);

  useEffect(() => {
    const p = profileRef.current;
    if (!p) {
      router.push('/');
      return;
    }
    const status = getComplianceStatus(p);
    setMaxHires(Math.max(10, status.gap + 5));
    recalculate(p, 0);
  }, [router, recalculate]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAdditionalHires(val);
    if (profileRef.current) recalculate(profileRef.current, val);
  };

  const profile = profileRef.current;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const status = getComplianceStatus(profile);

  return (
    <div className="min-h-screen bg-[#0A1628] px-4 py-8">
      <div className="max-w-5xl mx-auto">
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
              <h1 className="text-2xl font-bold text-white">Penalty Calculator</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              حاسبة الغرامات — Model hiring scenarios and see financial impact
            </p>
          </div>
        </div>

        {/* Slider Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Additional Emiratis to Hire
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                عدد الإماراتيين الإضافيين للتوظيف
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[#C9A84C]">{additionalHires}</span>
              <p className="text-xs text-gray-500">
                of {status.gap} gap
                {additionalHires >= status.gap ? (
                  <span className="text-emerald-400 ml-1">✓ Compliant</span>
                ) : null}
              </p>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={maxHires}
            value={additionalHires}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C9A84C 0%, #C9A84C ${
                (additionalHires / maxHires) * 100
              }%, #ffffff20 ${(additionalHires / maxHires) * 100}%, #ffffff20 100%)`,
            }}
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="text-[#C9A84C]">Gap: {status.gap}</span>
            <span>{maxHires}</span>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-gray-400">Penalty Avoided | الغرامة المتجنبة</p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{formatAED(penaltyAvoided)}</p>
            <p className="text-xs text-gray-600 mt-1">annually</p>
          </div>

          <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">Nafis Subsidy | دعم نافس</p>
            </div>
            <p className="text-2xl font-bold text-blue-400">{formatAED(subsidyGained)}</p>
            <p className="text-xs text-gray-600 mt-1">annually ({additionalHires} hires)</p>
          </div>

          <div
            className={`p-5 rounded-xl border ${
              netPosition >= 0
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-red-500/20 bg-red-500/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-400">Net Financial Benefit | الفائدة الصافية</p>
            </div>
            <p
              className={`text-2xl font-bold ${
                netPosition >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {netPosition >= 0 ? '+' : ''}
              {formatAED(netPosition)}
            </p>
            <p className="text-xs text-gray-600 mt-1">subsidy - remaining penalty</p>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
          <h2 className="text-base font-semibold text-white mb-1">
            Cumulative Penalty Over 12 Months
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            إجمالي الغرامات خلال 12 شهراً — Current gap vs. with {additionalHires} additional hire
            {additionalHires !== 1 ? 's' : ''}
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1628',
                  border: '1px solid #C9A84C30',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [formatAED(Number(value)), '']}
              />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="currentGap"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                name="Current Scenario"
              />
              <Line
                type="monotone"
                dataKey="withHires"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name={`With ${additionalHires} Hire${additionalHires !== 1 ? 's' : ''}`}
                strokeDasharray={additionalHires === 0 ? '4 4' : undefined}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hire Cost Breakdown */}
        {additionalHires > 0 && (
          <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#C9A84C] mb-3">
              Hiring Cost Breakdown | تفاصيل تكلفة التوظيف
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Estimated hiring cost ({additionalHires} × AED 60,000)
                </span>
                <span className="text-white">{formatAED(additionalHires * 60000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nafis subsidy (annual)</span>
                <span className="text-emerald-400">- {formatAED(subsidyGained)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Penalty avoided (annual)</span>
                <span className="text-emerald-400">- {formatAED(penaltyAvoided)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span className="text-gray-300">Net effective cost (Year 1)</span>
                <span
                  className={
                    additionalHires * 60000 - subsidyGained - penaltyAvoided < 0
                      ? 'text-emerald-400'
                      : 'text-white'
                  }
                >
                  {formatAED(
                    Math.max(0, additionalHires * 60000 - subsidyGained - penaltyAvoided)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        <Disclaimer />
      </div>
    </div>
  );
}
