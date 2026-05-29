export type CompanySize = '20-49' | '50-99' | '100-499' | '500+';
export type EntityType = 'mainland' | 'freezone';
export type EducationLevel = 'bachelor' | 'diploma';

export interface CompanyProfile {
  name: string;
  sector: string;
  totalEmployees: number;
  currentEmiratis: number;
  entityType: EntityType;
  companySize: CompanySize;
  educationLevel: EducationLevel;
}

export interface ComplianceStatus {
  requiredEmiratis: number;
  currentEmiratis: number;
  gap: number;
  requiredPct: number;
  currentPct: number;
  isCompliant: boolean;
  isFreeZoneExempt: boolean;
}

export interface PenaltyProjection {
  monthsToNextAudit: number;
  penaltyToNextAudit: number;
  annualPenalty: number;
  nafisSubsidy: number;
  netCostToComply: number;
}

export interface MonthlyData {
  month: string;
  penalty: number;
  cumulative: number;
}
