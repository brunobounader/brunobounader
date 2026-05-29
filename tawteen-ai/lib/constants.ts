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
    description:
      'MOHRE conducts its mid-year audit to verify that mainland companies with 20+ employees meet their 2026 Emiratisation headcount targets (8% for 50+ employee firms). Non-compliant companies face AED 9,000/month per unfilled Emirati position, collected upfront. Your Tasdeeq company profile must reflect accurate, up-to-date Emirati headcount before this date.',
    actions: [
      'Update Tasdeeq profile with current Emirati headcount',
      'Verify all Emirati employees are registered under your MOHRE establishment',
      'Confirm Nafis subsidy applications are active for new hires',
      'Run an internal headcount gap check at least 30 days before the audit',
    ],
    sourceUrl: 'https://www.mohre.gov.ae/en/services/establishments-services/emiratisation.aspx',
    sourceLabel: 'mohre.gov.ae',
  },
  {
    date: '2026-07-01',
    title: 'E-Invoicing Voluntary Pilot',
    titleAr: 'الفاتورة الإلكترونية - مرحلة تجريبية',
    category: 'tax',
    urgent: false,
    description:
      'The Federal Tax Authority (FTA) opens the e-invoicing platform for voluntary testing. Businesses can connect to an FTA-accredited Accredited Service Provider (ASP) and test the PEPPOL 4-corner exchange model before mandatory compliance. Early adoption is strongly recommended — it allows time to resolve integration issues with your accounting software before penalties apply.',
    actions: [
      'Review the list of FTA-accredited ASPs on tax.gov.ae',
      'Assess your current invoicing software for PEPPOL XML compatibility',
      'Request a demo from 2–3 ASP providers and compare pricing (AED 200–800/month)',
      'Begin voluntary pilot registration on the FTA portal',
    ],
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2026-10-31',
    title: 'E-Invoicing ASP Appointment (Large Co.)',
    titleAr: 'تعيين مزود خدمة الفاتورة الإلكترونية - الشركات الكبيرة',
    category: 'tax',
    urgent: false,
    description:
      'Companies with annual revenue of AED 50 million or more must formally appoint an FTA-accredited Accredited Service Provider (ASP) by this date. The ASP connects your ERP or accounting system to the FTA network and handles PEPPOL PINT AE XML invoice transmission. Missing this appointment deadline may trigger penalties and leaves insufficient time to integrate before the January 2027 go-live.',
    actions: [
      'Confirm your revenue threshold — AED 50M or above requires action now',
      'Select and formally appoint an ASP via the FTA portal before October 31',
      'Begin ERP/accounting system integration with your ASP immediately after appointment',
      'Test invoice transmission end-to-end before the January 2027 mandatory date',
    ],
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2026-12-31',
    title: 'Tasdeeq Emiratisation Audit',
    titleAr: 'تدقيق التصديق للتوطين',
    category: 'emiratisation',
    urgent: true,
    description:
      'The second semi-annual Tasdeeq audit of 2026. MOHRE reconciles your declared headcount against the Tasdeeq verification system. This audit determines your compliance status for the full year and any penalties owed are collected upfront for the following period. Companies that hired Emiratis between July and December 2026 must ensure those hires are fully registered and verified before this date.',
    actions: [
      'Ensure all Emirati hires since June are registered in the MOHRE system',
      'Verify Nafis subsidy is active and salary meets the AED 6,000/month minimum',
      'Prepare headcount documentation for any MOHRE audit request',
      'Review 2027 Emiratisation targets and start planning hiring for Q1 2027',
    ],
    sourceUrl: 'https://www.mohre.gov.ae/en/services/establishments-services/emiratisation.aspx',
    sourceLabel: 'mohre.gov.ae',
  },
  {
    date: '2027-01-01',
    title: 'E-Invoicing Mandatory (Revenue ≥ AED 50M)',
    titleAr: 'إلزامية الفاتورة الإلكترونية - الشركات الكبيرة',
    category: 'tax',
    urgent: false,
    description:
      'All B2B and B2G invoices from companies with revenue ≥ AED 50M must now be transmitted through an FTA-accredited ASP in PEPPOL PINT AE XML format. Standard PDF invoices and paper invoices will no longer be valid for VAT and Corporate Tax purposes. Non-compliance carries penalties of up to AED 5,000/month and may invalidate your VAT input tax claims.',
    actions: [
      'Confirm your ASP integration is live and invoices are transmitting correctly',
      'Update invoice templates to PEPPOL PINT AE XML format',
      'Train finance team on the new e-invoicing workflow',
      'Establish an internal compliance check for rejected or failed invoice transmissions',
    ],
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2027-03-31',
    title: 'E-Invoicing ASP Appointment (SMEs)',
    titleAr: 'تعيين مزود خدمة الفاتورة الإلكترونية - المنشآت الصغيرة',
    category: 'tax',
    urgent: false,
    description:
      'All remaining businesses (revenue below AED 50M) must formally appoint an FTA-accredited ASP by March 31, 2027. This gives SMEs 3 months to complete integration before the July 2027 mandatory go-live. Starting early is essential — ASP onboarding, accounting software integration, and testing typically takes 4–8 weeks.',
    actions: [
      'Identify whether your accounting software (QuickBooks, Zoho, Xero, Odoo) has a built-in ASP integration',
      'Compare FTA-accredited ASPs on cost, ease of integration, and Arabic support',
      'Complete your ASP appointment on the FTA portal before March 31',
      'Begin integration and testing immediately after appointment',
    ],
    sourceUrl: 'https://tax.gov.ae/en/taxes/einvoicing.aspx',
    sourceLabel: 'tax.gov.ae',
  },
  {
    date: '2027-07-01',
    title: 'E-Invoicing Mandatory (All SMEs)',
    titleAr: 'إلزامية الفاتورة الإلكترونية - جميع المنشآت',
    category: 'tax',
    urgent: false,
    description:
      'E-invoicing becomes mandatory for all UAE businesses issuing B2B or B2G invoices, regardless of revenue size. After this date, any invoice not transmitted through an accredited ASP in the correct PEPPOL XML format may be deemed invalid, affecting your VAT input tax recovery and Corporate Tax deductions. Penalties of up to AED 5,000/month apply for non-compliance.',
    actions: [
      'Ensure your ASP integration is fully live and tested before July 1',
      'Confirm all invoice types (sales, credit notes, debit notes) are covered',
      'Brief your suppliers — you will also need to accept e-invoices from them',
      'Archive all pre-July PDF invoices in a compliant format for audit purposes',
    ],
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
