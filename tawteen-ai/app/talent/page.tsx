'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Search,
  ClipboardList,
  Building2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Disclaimer from '@/components/Disclaimer';

const NAFIS_STEPS = [
  {
    step: 1,
    title: 'Register as an Employer',
    titleAr: 'التسجيل كصاحب عمل',
    description:
      'Create your employer account on nafis.gov.ae using your UAE trade license and Emirates ID. You will need your establishment number from MOHRE.',
    action: 'Go to nafis.gov.ae → Employer Registration',
    url: 'https://nafis.gov.ae',
  },
  {
    step: 2,
    title: 'Post a Job Vacancy',
    titleAr: 'نشر وظيفة شاغرة',
    description:
      'Create a job listing specifying the role, required qualifications, salary range, and location. Nafis matches your vacancy to registered Emirati job seekers in their database.',
    action: 'Employer Portal → Post Vacancy',
    url: 'https://nafis.gov.ae',
  },
  {
    step: 3,
    title: 'Browse & Shortlist Candidates',
    titleAr: 'تصفح المرشحين واختيار القائمة المختصرة',
    description:
      'Review profiles of Emirati candidates matched to your vacancy. Filter by qualification level, experience, and emirate. Contact shortlisted candidates directly through the platform.',
    action: 'Employer Portal → Candidate Search',
    url: 'https://nafis.gov.ae',
  },
  {
    step: 4,
    title: 'Apply for Nafis Subsidy',
    titleAr: 'التقدم للحصول على دعم نافس',
    description:
      'Once you hire an Emirati, apply for the Nafis salary top-up subsidy. The government pays the employee directly: AED 8,000/month for Bachelor\'s degree holders, AED 7,000/month for Diploma holders — for up to 5 years.',
    action: 'Employer Portal → Subsidy Application',
    url: 'https://nafis.gov.ae',
  },
  {
    step: 5,
    title: 'Register the Hire with MOHRE',
    titleAr: 'تسجيل التوظيف في وزارة الموارد البشرية',
    description:
      'After hiring, update your establishment\'s headcount on the MOHRE Tasdeeq portal. This registers the new Emirati employee against your Emiratisation quota and counts toward your compliance target.',
    action: 'MOHRE Tasdeeq → Update Headcount',
    url: 'https://tasdeeq.mohre.gov.ae',
  },
];

const TALENT_PLATFORMS = [
  {
    name: 'Nafis',
    nameAr: 'نافس',
    description: 'Official UAE government platform for matching Emirati job seekers with private sector employers. The primary tool for Emiratisation hiring.',
    tag: 'Official — Primary',
    tagColor: 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30',
    url: 'https://nafis.gov.ae',
    icon: '🇦🇪',
  },
  {
    name: 'MOHRE Job Portal',
    nameAr: 'بوابة وظائف وزارة الموارد البشرية',
    description: 'Ministry of Human Resources & Emiratisation job board. Post vacancies that are automatically visible to registered Emirati job seekers.',
    tag: 'Official',
    tagColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    url: 'https://www.mohre.gov.ae',
    icon: '🏛️',
  },
  {
    name: 'UAE University Careers',
    nameAr: 'وظائف جامعة الإمارات',
    description: 'Post graduate and entry-level roles directly to UAE national university graduates. Good source for Bachelor\'s-level Emirati talent.',
    tag: 'Graduate Talent',
    tagColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    url: 'https://www.uaeu.ac.ae/en/careers/',
    icon: '🎓',
  },
  {
    name: 'Bayt.com UAE Nationals',
    nameAr: 'بيت.كوم للمواطنين الإماراتيين',
    description: 'The Middle East\'s largest job site with a dedicated UAE Nationals filter. Large pool of active Emirati job seekers across all experience levels.',
    tag: 'Large Pool',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    url: 'https://www.bayt.com',
    icon: '💼',
  },
  {
    name: 'LinkedIn UAE',
    nameAr: 'لينكد إن الإمارات',
    description: 'Use LinkedIn\'s nationality and location filters to find Emirati professionals. Effective for mid-to-senior level roles. Mention Nafis subsidy eligibility in your posting to attract candidates.',
    tag: 'Professional Network',
    tagColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    url: 'https://www.linkedin.com/jobs',
    icon: '🔗',
  },
  {
    name: 'Tanmia',
    nameAr: 'تنمية',
    description: 'UAE national human resource development programme. Supports Emiratisation through training and placement. Good for entry-level and trainee roles.',
    tag: 'Training & Placement',
    tagColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    url: 'https://www.tanmia.ae',
    icon: '📈',
  },
];

const HIRING_TIPS = [
  'Mention the Nafis salary top-up in your job description — it makes your offer more competitive since candidates receive additional government income on top of your salary.',
  'Set your offered salary at or above AED 6,000/month — this is the MOHRE minimum for Emirati hires effective January 2026.',
  'Specify "UAE Nationals Only" in your posting on Nafis and Bayt to filter candidates automatically.',
  'Apply for Nafis subsidy before the hire starts — processing takes 2–4 weeks and backdating is not always guaranteed.',
  'For senior roles, search LinkedIn with the "UAE National" filter and reach out directly — many experienced Emiratis are open to the right offer.',
  'Partner with UAE universities for internship-to-hire pipelines — a cost-effective way to build a long-term Emirati talent bench.',
];

export default function TalentPage() {
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
              <Users className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="text-2xl font-bold text-white">Find Emirati Talent</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              البحث عن الكفاءات الإماراتية — Hire directly and close your compliance gap
            </p>
          </div>
        </div>

        {/* Nafis Hero CTA */}
        <div className="rounded-2xl border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C]/10 to-[#0A1628] p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🇦🇪</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">Nafis</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 font-medium">
                  Official UAE Government Platform
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">نافس — برنامج تنافسية الكوادر الوطنية</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Nafis is the UAE government&apos;s primary platform for connecting private sector employers with Emirati job seekers. It is the fastest way to find pre-screened Emirati candidates, apply for salary top-up subsidies, and register new hires against your Emiratisation quota — all in one place.
              </p>
              <a
                href="https://nafis.gov.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A1628] font-bold text-sm transition-colors"
              >
                <Search className="w-4 h-4" />
                Search Emirati Candidates on Nafis
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* How to Use Nafis — Step by Step */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#C9A84C]" />
            How to Hire via Nafis — Step by Step
          </h2>
          <p className="text-xs text-gray-500 mb-4">كيفية التوظيف عبر نافس — خطوة بخطوة</p>
          <div className="space-y-3">
            {NAFIS_STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-white/10 bg-white/5 p-4 flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold text-sm">
                  {s.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">{s.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5" dir="rtl">{s.titleAr}</p>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{s.description}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {s.action}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Talent Platforms */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C9A84C]" />
            Other Emirati Talent Platforms
          </h2>
          <p className="text-xs text-gray-500 mb-4">منصات أخرى للكفاءات الإماراتية</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TALENT_PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{p.name}</h3>
                      <p className="text-gray-500 text-xs" dir="rtl">{p.nameAr}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${p.tagColor}`}>
                    {p.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors mt-auto pt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit {p.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Tips */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#C9A84C]" />
            Hiring Tips for UAE Employers
          </h2>
          <p className="text-xs text-gray-500 mb-4">نصائح للتوظيف لأصحاب العمل في الإمارات</p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            {HIRING_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nafis Subsidy Quick Reference */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-300">
              Nafis Subsidy Quick Reference | مرجع سريع لدعم نافس
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Bachelor&apos;s Degree | بكالوريوس</p>
                <p className="text-blue-300 font-bold">AED 8,000/month to employee</p>
                <p className="text-gray-500 text-xs mt-0.5">Paid by govt. directly to hire for up to 5 years</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Diploma | دبلوم</p>
                <p className="text-blue-300 font-bold">AED 7,000/month to employee</p>
                <p className="text-gray-500 text-xs mt-0.5">Paid by govt. directly to hire for up to 5 years</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Minimum salary requirement: AED 6,000/month (effective January 2026). The Nafis top-up is paid on top of your salary, making your total package more competitive without increasing your payroll cost.
          </p>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
