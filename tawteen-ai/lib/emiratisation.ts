import { CompanyProfile, ComplianceStatus, PenaltyProjection, MonthlyData } from './types';
import {
  PENALTY_PER_MONTH,
  NAFIS_BACHELOR_MONTHLY,
  NAFIS_DIPLOMA_MONTHLY,
  TARGET_PCT_2026,
  AUDIT_DATES,
} from './constants';

export function getRequiredEmiratis(profile: CompanyProfile): number {
  if (profile.entityType === 'freezone') return 0;
  if (profile.companySize === '20-49') return 1;
  return Math.ceil((profile.totalEmployees * TARGET_PCT_2026) / 100);
}

export function getComplianceStatus(profile: CompanyProfile): ComplianceStatus {
  const isFreeZoneExempt = profile.entityType === 'freezone';
  const requiredEmiratis = getRequiredEmiratis(profile);
  const gap = Math.max(0, requiredEmiratis - profile.currentEmiratis);
  const requiredPct =
    profile.companySize === '20-49'
      ? (1 / profile.totalEmployees) * 100
      : TARGET_PCT_2026;
  const currentPct = (profile.currentEmiratis / profile.totalEmployees) * 100;

  return {
    requiredEmiratis,
    currentEmiratis: profile.currentEmiratis,
    gap,
    requiredPct,
    currentPct,
    isCompliant: gap === 0,
    isFreeZoneExempt,
  };
}

export function getNextAuditDate(): Date {
  const now = new Date();
  for (const date of AUDIT_DATES) {
    if (date > now) return date;
  }
  return AUDIT_DATES[AUDIT_DATES.length - 1];
}

export function getMonthsToNextAudit(): number {
  const now = new Date();
  const next = getNextAuditDate();
  const diffMs = next.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30)));
}

export function getPenaltyProjection(profile: CompanyProfile): PenaltyProjection {
  const status = getComplianceStatus(profile);
  const monthsToNextAudit = getMonthsToNextAudit();
  const penaltyToNextAudit = status.gap * PENALTY_PER_MONTH * monthsToNextAudit;
  const annualPenalty = status.gap * PENALTY_PER_MONTH * 12;
  const monthlyNafis =
    profile.educationLevel === 'bachelor' ? NAFIS_BACHELOR_MONTHLY : NAFIS_DIPLOMA_MONTHLY;
  const nafisSubsidy = status.gap * monthlyNafis * 12;
  const hiringCostEstimate = status.gap * 60000; // AED 60K average cost per hire in UAE
  const netCostToComply = Math.max(0, hiringCostEstimate - nafisSubsidy);

  return {
    monthsToNextAudit,
    penaltyToNextAudit,
    annualPenalty,
    nafisSubsidy,
    netCostToComply,
  };
}

export function getMonthlyPenaltyData(gap: number, months: number = 12): MonthlyData[] {
  const data: MonthlyData[] = [];
  let cumulative = 0;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const startMonth = new Date().getMonth();

  for (let i = 0; i < months; i++) {
    const monthly = gap * PENALTY_PER_MONTH;
    cumulative += monthly;
    data.push({
      month: monthNames[(startMonth + i) % 12],
      penalty: monthly,
      cumulative,
    });
  }
  return data;
}

export function formatAED(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
