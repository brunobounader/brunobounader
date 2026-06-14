'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Building2, Users, TrendingUp } from 'lucide-react';
import { SECTORS, COMPANY_SIZES } from '@/lib/constants';
import type { CompanyProfile } from '@/lib/types';

const schema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  sector: z.string().min(1, 'Please select a sector'),
  totalEmployees: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 20, 'Minimum 20 employees')
    .refine((v) => Number(v) <= 100000, 'Please enter a valid employee count'),
  currentEmiratis: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Cannot be negative')
    .refine((v) => Number(v) <= 100000, 'Please enter a valid count'),
  entityType: z.enum(['mainland', 'freezone']),
  companySize: z.enum(['20-49', '50-99', '100-499', '500+']),
  educationLevel: z.enum(['bachelor', 'diploma']),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [entityType, setEntityType] = useState<'mainland' | 'freezone'>('mainland');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      entityType: 'mainland',
      companySize: '50-99',
      educationLevel: 'bachelor',
    },
  });

  const onSubmit = (data: FormData) => {
    const profile: CompanyProfile = {
      name: data.name,
      sector: data.sector,
      totalEmployees: Number(data.totalEmployees),
      currentEmiratis: Number(data.currentEmiratis),
      entityType: data.entityType,
      companySize: data.companySize,
      educationLevel: data.educationLevel,
    };
    localStorage.setItem('tawteen_profile', JSON.stringify(profile));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Hero */}
      <div className="pt-16 pb-10 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Emiratisation Intelligence Platform | منصة ذكاء التوطين
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Tawteen<span className="text-[#C9A84C]"> AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Stay ahead of Emiratisation compliance
          </p>
          <p className="text-lg text-[#C9A84C]/80 font-arabic" dir="rtl">
            ابق في صدارة متطلبات التوطين
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-semibold">
              Companies face AED 108,000/year per unfilled Emirati position. Don&apos;t wait for the
              audit.
            </p>
            <p className="text-red-400/60 text-xs mt-1" dir="rtl">
              تواجه الشركات غرامة تبلغ 108,000 درهم سنوياً لكل منصب إماراتي شاغر. لا تنتظر التدقيق.
            </p>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="max-w-2xl mx-auto px-4 mb-8 grid grid-cols-3 gap-3">
        {[
          { icon: Building2, text: 'Compliance Check', textAr: 'فحص الامتثال' },
          { icon: TrendingUp, text: 'Penalty Calculator', textAr: 'حاسبة الغرامات' },
          { icon: Users, text: 'AI Action Plan', textAr: 'خطة عمل ذكية' },
        ].map(({ icon: Icon, text, textAr }) => (
          <div
            key={text}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/5 text-center"
          >
            <Icon className="w-5 h-5 text-[#C9A84C]" />
            <p className="text-xs font-medium text-white">{text}</p>
            <p className="text-xs text-gray-500" dir="rtl">
              {textAr}
            </p>
          </div>
        ))}
      </div>

      {/* Onboarding Form */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-1">Set Up Your Company Profile</h2>
          <p className="text-sm text-gray-400 mb-6">
            إعداد ملف الشركة &mdash; All data stored locally in your browser. Never leaves your device.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company Name <span className="text-gray-500 text-xs">اسم الشركة</span>
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Al Rashid Holdings"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 text-sm"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sector <span className="text-gray-500 text-xs">القطاع</span>
              </label>
              <select
                {...register('sector')}
                className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 text-sm"
              >
                <option value="">Select sector...</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.sector && (
                <p className="text-red-400 text-xs mt-1">{errors.sector.message}</p>
              )}
            </div>

            {/* Employee counts */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total Employees <span className="text-gray-500 text-xs">إجمالي الموظفين</span>
                </label>
                <input
                  {...register('totalEmployees')}
                  type="number"
                  min={20}
                  placeholder="e.g. 150"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 text-sm"
                />
                {errors.totalEmployees && (
                  <p className="text-red-400 text-xs mt-1">{errors.totalEmployees.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Emiratis <span className="text-gray-500 text-xs">الإماراتيون الحاليون</span>
                </label>
                <input
                  {...register('currentEmiratis')}
                  type="number"
                  min={0}
                  placeholder="e.g. 8"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/30 text-sm"
                />
                {errors.currentEmiratis && (
                  <p className="text-red-400 text-xs mt-1">{errors.currentEmiratis.message}</p>
                )}
              </div>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company Size <span className="text-gray-500 text-xs">حجم الشركة</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COMPANY_SIZES.map((size) => (
                  <label
                    key={size.value}
                    className="relative cursor-pointer"
                  >
                    <input
                      {...register('companySize')}
                      type="radio"
                      value={size.value}
                      className="sr-only peer"
                    />
                    <div className="px-3 py-2 rounded-lg border border-white/10 text-center text-xs text-gray-400 peer-checked:border-[#C9A84C] peer-checked:bg-[#C9A84C]/10 peer-checked:text-[#C9A84C] hover:border-white/20 transition-colors">
                      {size.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Entity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Entity Type <span className="text-gray-500 text-xs">نوع الكيان</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'mainland', label: 'Mainland (MOHRE)', labelAr: 'البر الرئيسي' },
                  { value: 'freezone', label: 'Free Zone', labelAr: 'منطقة حرة' },
                ].map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      {...register('entityType')}
                      type="radio"
                      value={opt.value}
                      onChange={(e) => {
                        setEntityType(e.target.value as 'mainland' | 'freezone');
                        register('entityType').onChange(e);
                      }}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-3 rounded-lg border border-white/10 text-center peer-checked:border-[#C9A84C] peer-checked:bg-[#C9A84C]/10 hover:border-white/20 transition-colors">
                      <p className="text-sm font-medium text-white peer-checked:text-[#C9A84C]">
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5" dir="rtl">
                        {opt.labelAr}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {entityType === 'freezone' && (
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                  <span>✓</span> Free Zone companies are generally exempt from MOHRE Emiratisation
                  quotas
                </p>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Planned Hire Education Level{' '}
                <span className="text-gray-500 text-xs">
                  (Nafis pays this top-up directly to your Emirati hire | نافس يدفع هذا الدعم للموظف مباشرةً)
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: 'bachelor',
                    label: "Bachelor's Degree",
                    labelAr: 'بكالوريوس',
                    subsidy: 'Govt. top-up to hire: AED 8,000/mo',
                  },
                  {
                    value: 'diploma',
                    label: 'Diploma',
                    labelAr: 'دبلوم',
                    subsidy: 'Govt. top-up to hire: AED 7,000/mo',
                  },
                ].map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      {...register('educationLevel')}
                      type="radio"
                      value={opt.value}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-3 rounded-lg border border-white/10 peer-checked:border-[#C9A84C] peer-checked:bg-[#C9A84C]/10 hover:border-white/20 transition-colors">
                      <p className="text-sm font-medium text-white">{opt.label}</p>
                      <p className="text-xs text-gray-500" dir="rtl">
                        {opt.labelAr}
                      </p>
                      <p className="text-xs text-[#C9A84C]/70 mt-1">Nafis: {opt.subsidy}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0A1628] font-bold text-base transition-colors mt-2"
            >
              {isSubmitting ? 'Setting up...' : 'View My Compliance Dashboard →'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-xs text-yellow-400/80 text-center">
            <span className="font-semibold">Disclaimer:</span> This tool provides guidance only and
            does not constitute legal or regulatory advice. Consult a licensed UAE employment law
            advisor for official compliance decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
