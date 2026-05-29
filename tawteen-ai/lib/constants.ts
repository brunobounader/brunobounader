export const SECTORS = [
  'Finance & Banking',
  'Insurance',
  'Information & Communication Technology',
  'Construction',
  'Hospitality & Tourism',
  'Retail',
  'Healthcare',
  'Manufacturing',
  'Transportation & Logistics',
  'Real Estate',
  'Professional Services',
  'Education',
  'Food & Beverage',
  'Energy & Utilities',
] as const;

export const COMPANY_SIZES = [
  { value: '20-49', label: '20–49 employees' },
  { value: '50-99', label: '50–99 employees' },
  { value: '100-499', label: '100–499 employees' },
  { value: '500+', label: '500+ employees' },
] as const;

export const PENALTY_PER_MONTH = 9000; // AED
export const NAFIS_BACHELOR_MONTHLY = 8000; // AED
export const NAFIS_DIPLOMA_MONTHLY = 7000; // AED

// MOHRE 2026 target: 8% for 50+ employee companies
export const TARGET_PCT_2026 = 8;

export const AUDIT_DATES = [
  new Date('2026-06-30'),
  new Date('2026-12-31'),
];

export const KEY_DEADLINES = [
  {
    date: '2026-06-30',
    title: 'Tasdeeq Emiratisation Audit',
    titleAr: 'تدقيق التصديق للتوطين',
    category: 'emiratisation',
    urgent: true,
    sourceUrl: 'https://www.mohre.gov.ae/en/services/establishments-services/emiratisation.aspx',
    sourceLabel: 'mohre.gov.ae',
  },
  {
    date: '2026-07-01',
    title: 'E-Invoicing Voluntary Pilot',
    titleAr: 'الفاتورة الإلكترونية - مرحلة تجريبية',
    category: 'tax',
    urgent: false,
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2026-10-31',
    title: 'E-Invoicing ASP Appointment (Large Co.)',
    titleAr: 'تعيين مزود خدمة الفاتورة الإلكترونية',
    category: 'tax',
    urgent: false,
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2026-12-31',
    title: 'Tasdeeq Emiratisation Audit',
    titleAr: 'تدقيق التصديق للتوطين',
    category: 'emiratisation',
    urgent: true,
    sourceUrl: 'https://www.mohre.gov.ae/en/services/establishments-services/emiratisation.aspx',
    sourceLabel: 'mohre.gov.ae',
  },
  {
    date: '2027-01-01',
    title: 'E-Invoicing Mandatory (Revenue ≥ AED 50M)',
    titleAr: 'إلزامية الفاتورة الإلكترونية - الشركات الكبيرة',
    category: 'tax',
    urgent: false,
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2027-03-31',
    title: 'E-Invoicing ASP Appointment (SMEs)',
    titleAr: 'تعيين مزود خدمة الفاتورة الإلكترونية - المنشآت الصغيرة',
    category: 'tax',
    urgent: false,
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2027-07-01',
    title: 'E-Invoicing Mandatory (All SMEs)',
    titleAr: 'إلزامية الفاتورة الإلكترونية - جميع المنشآت',
    category: 'tax',
    urgent: false,
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
] as const;

export const COLORS = {
  navy: '#0A1628',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  red: '#EF4444',
  green: '#10B981',
  blue: '#3B82F6',
  gray: '#6B7280',
};
