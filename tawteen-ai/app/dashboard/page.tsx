'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  Calculator,
  Sparkles,
  ChevronRight,
  Building2,
} from 'lucide-react';
import ComplianceGauge from '@/components/ComplianceGauge';
import StatCard from '@/components/StatCard';
import Disclaimer from '@/components/Disclaimer';
import {
  getComplianceStatus,
  getPenaltyProjection,
  formatAED,
  getDaysUntil,
  getNextAuditDate,
} from '@/lib/emiratisation';
import type { CompanyProfile, ComplianceStatus, PenaltyProjection } from '@/lib/types';

interface DashboardData {
  profile: CompanyProfile;
  status: ComplianceStatus;
  projection: PenaltyProjection;
  daysToAudit: number;
}

function loadDashboardData(): DashboardData | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tawteen_profile');
  if (!stored) return null;
  const p: CompanyProfile = JSON.parse(stored);
  return {
    profile: p,
    status: getComplianceStatus(p),
    projection: getPenaltyProjection(p),
    daysToAudit: getDaysUntil(getNextAuditDate()),
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [data] = useState<DashboardData | null>(() => loadDashboardData());

  useEffect(() => {
    if (!data) {
      router.push('/');
    }
  }, [data, router]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const { profile, status, projection, daysToAudit } = data;

  return (
    <div className="min-h-screen bg-[#0A1628] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            </div>
            <p className="text-gray-400 text-sm">
              {profile.sector} &bull; {profile.totalEmployees} employees &bull;{' '}
              {profile.entityType === 'mainland' ? 'Mainland' : 'Free Zone'}
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
          >
            Update Profile
          </Link>
        </div>

        {/* Free Zone Exempt Banner */}
        {status.isFreeZoneExempt && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold text-sm">
                Free Zone Exempt — No Emiratisation Quota Required
              </p>
              <p className="text-emerald-500/70 text-xs mt-0.5" dir="rtl">
                معفى من منطقة حرة — لا يتطلب حصة توطين
              </p>
            </div>
          </div>
        )}

        {/* Non-compliance alert */}
        {!status.isFreeZoneExempt && !status.isCompliant && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm">
                Action Required: {status.gap} Emirati position{status.gap !== 1 ? 's' : ''} short of
                the {status.requiredPct.toFixed(0)}% target
              </p>
              <p className="text-red-400/70 text-xs mt-0.5" dir="rtl">
                الإجراء المطلوب: {status.gap} منصب إماراتي دون المستهدف
              </p>
            </div>
          </div>
        )}

        {/* Compliant banner */}
        {!status.isFreeZoneExempt && status.isCompliant && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold text-sm">
                Compliant — Meeting the {status.requiredPct.toFixed(0)}% Emiratisation target
              </p>
              <p className="text-emerald-500/70 text-xs mt-0.5" dir="rtl">
                ملتزم — تحقيق هدف التوطين {status.requiredPct.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Compliance Gauge */}
          <div className="lg:col-span-1 rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-gray-400 mb-4 self-start">
              Compliance Status | حالة الامتثال
            </h2>
            <ComplianceGauge
              currentPct={status.currentPct}
              requiredPct={status.requiredPct}
              isCompliant={status.isCompliant}
              isFreeZoneExempt={status.isFreeZoneExempt}
            />
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Current Emiratis | الإماراتيون الحاليون</span>
                <span className="text-white font-medium">{status.currentEmiratis}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Required | المطلوب</span>
                <span className="text-white font-medium">
                  {status.isFreeZoneExempt ? 'N/A' : status.requiredEmiratis}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Gap | الفجوة</span>
                <span
                  className={
                    status.gap > 0
                      ? 'text-red-400 font-medium'
                      : 'text-emerald-400 font-medium'
                  }
                >
                  {status.isFreeZoneExempt
                    ? 'N/A'
                    : status.gap === 0
                    ? '✓ None'
                    : `-${status.gap}`}
                </span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gap */}
            <StatCard
              title="Emiratisation Gap"
              titleAr="فجوة التوطين"
              value={
                status.isFreeZoneExempt
                  ? 'Exempt'
                  : status.gap === 0
                  ? 'None ✓'
                  : `${status.gap} position${status.gap !== 1 ? 's' : ''}`
              }
              subtitle={
                status.gap > 0
                  ? `Need ${status.gap} more UAE National${status.gap !== 1 ? 's' : ''}`
                  : undefined
              }
              icon={<Users className="w-5 h-5" />}
              variant={status.gap > 0 ? 'danger' : 'success'}
            />

            {/* Annual Penalty */}
            <StatCard
              title="Annual Penalty Risk"
              titleAr="خطر الغرامة السنوية"
              value={status.isFreeZoneExempt ? 'AED 0' : formatAED(projection.annualPenalty)}
              subtitle={
                projection.annualPenalty > 0
                  ? `AED 9,000/month per unfilled position`
                  : 'No penalty — compliant'
              }
              icon={<AlertTriangle className="w-5 h-5" />}
              variant={projection.annualPenalty > 0 ? 'danger' : 'success'}
            />

            {/* Nafis Government Support */}
            <StatCard
              title="Nafis Govt. Top-Up to Your Hire"
              titleAr="دعم نافس للموظف الإماراتي"
              value={status.gap > 0 ? formatAED(projection.nafisSubsidy) : 'AED 0'}
              subtitle={
                status.gap > 0
                  ? `Govt. pays your Emirati hire ${
                      profile.educationLevel === 'bachelor' ? 'AED 8,000' : 'AED 7,000'
                    }/mo directly`
                  : 'Already compliant'
              }
              icon={<TrendingUp className="w-5 h-5" />}
              variant={status.gap > 0 ? 'success' : 'default'}
            />

            {/* Audit Countdown */}
            <StatCard
              title="Next Tasdeeq Audit"
              titleAr="تدقيق التصديق القادم"
              value={`${daysToAudit} days`}
              subtitle={`${getNextAuditDate().toLocaleDateString('en-AE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}`}
              icon={<Calendar className="w-5 h-5" />}
              variant={
                daysToAudit < 60 ? 'danger' : daysToAudit < 120 ? 'warning' : 'default'
              }
            />
          </div>
        </div>

        {/* Penalty to next audit */}
        {!status.isFreeZoneExempt && status.gap > 0 && (
          <div className="mb-6 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-300">
                Penalty to Next Audit | الغرامة حتى التدقيق القادم
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-amber-400">
                  {formatAED(projection.penaltyToNextAudit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Over {projection.monthsToNextAudit} months to next audit
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400/60">
                  {formatAED(projection.nafisSubsidy)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Govt. pays this to your Emirati hire directly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatAED(projection.netCostToComply)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated hiring cost to achieve compliance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/calculator"
            className="flex items-center justify-between p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Penalty Calculator</p>
                <p className="text-gray-500 text-xs">حاسبة الغرامات — model hiring scenarios</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#C9A84C] transition-colors" />
          </Link>

          <Link
            href="/action-plan"
            className="flex items-center justify-between p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Action Plan</p>
                <p className="text-gray-500 text-xs">خطة عمل ذكية — 90-day AI plan</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
