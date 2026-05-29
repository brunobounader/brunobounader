'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, AlertTriangle, FileText, Clock, ExternalLink } from 'lucide-react';
import { KEY_DEADLINES } from '@/lib/constants';
import { getDaysUntil } from '@/lib/emiratisation';
import Disclaimer from '@/components/Disclaimer';

type DeadlineCategory = 'emiratisation' | 'tax';

function getCategoryStyle(category: DeadlineCategory) {
  if (category === 'emiratisation') {
    return {
      badge: 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30',
      dot: 'bg-[#C9A84C]',
      label: 'Emiratisation | التوطين',
      icon: AlertTriangle,
    };
  }
  return {
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
    label: 'Tax | ضريبة',
    icon: FileText,
  };
}

function getUrgencyStyle(days: number, urgent: boolean) {
  if (urgent && days < 90)
    return { card: 'border-red-500/30 bg-red-500/5', days: 'text-red-400', label: 'Urgent' };
  if (days < 90)
    return { card: 'border-amber-500/20 bg-amber-500/5', days: 'text-amber-400', label: 'Soon' };
  if (days < 180)
    return {
      card: 'border-yellow-500/10 bg-yellow-500/5',
      days: 'text-yellow-400',
      label: 'Upcoming',
    };
  return { card: 'border-white/10 bg-white/5', days: 'text-gray-400', label: 'Future' };
}

export default function DeadlinesPage() {
  const deadlines = useMemo(() => {
    return KEY_DEADLINES.map((dl) => ({
      ...dl,
      dateObj: new Date(dl.date),
      daysUntil: getDaysUntil(new Date(dl.date)),
      formatted: new Date(dl.date).toLocaleDateString('en-AE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));
  }, []);

  const emiratisationDeadlines = deadlines.filter(
    (d) => d.category === 'emiratisation'
  );
  const taxDeadlines = deadlines.filter((d) => d.category === 'tax');

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
              <Calendar className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="text-2xl font-bold text-white">Compliance Deadlines</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              المواعيد النهائية للامتثال — Key UAE regulatory dates for 2026–2027
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
            <span className="text-gray-400">Emiratisation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-gray-400">Tax / E-Invoicing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-gray-400">Urgent (&lt;90 days)</span>
          </div>
        </div>

        {/* Emiratisation Section */}
        <h2 className="text-base font-semibold text-[#C9A84C] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Emiratisation Deadlines | مواعيد التوطين
        </h2>
        <div className="space-y-3 mb-8">
          {emiratisationDeadlines.map((dl) => {
            const catStyle = getCategoryStyle(dl.category as DeadlineCategory);
            const urgStyle = getUrgencyStyle(dl.daysUntil, dl.urgent);
            return (
              <div
                key={`${dl.date}-${dl.title}`}
                className={`rounded-xl border p-5 ${urgStyle.card}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${catStyle.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                        {catStyle.label.split(' | ')[0]}
                      </span>
                      {dl.urgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          Audit Required
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold">{dl.title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5" dir="rtl">
                      {dl.titleAr}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {dl.formatted}
                    </div>
                    <a
                      href={dl.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Official source: {dl.sourceLabel}
                    </a>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-3xl font-bold ${urgStyle.days}`}>
                      {dl.daysUntil}
                    </div>
                    <div className="text-xs text-gray-500">days away</div>
                    <div className={`text-xs font-medium mt-1 ${urgStyle.days}`}>
                      {urgStyle.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tax / E-Invoicing Section */}
        <h2 className="text-base font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          E-Invoicing Deadlines | مواعيد الفاتورة الإلكترونية
        </h2>
        <div className="space-y-3 mb-8">
          {taxDeadlines.map((dl) => {
            const catStyle = getCategoryStyle(dl.category as DeadlineCategory);
            const urgStyle = getUrgencyStyle(dl.daysUntil, dl.urgent);
            return (
              <div
                key={`${dl.date}-${dl.title}`}
                className={`rounded-xl border p-5 ${urgStyle.card}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${catStyle.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                        {catStyle.label.split(' | ')[0]}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold">{dl.title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5" dir="rtl">
                      {dl.titleAr}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {dl.formatted}
                    </div>
                    <a
                      href={dl.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Official source: {dl.sourceLabel}
                    </a>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-3xl font-bold ${urgStyle.days}`}>
                      {dl.daysUntil}
                    </div>
                    <div className="text-xs text-gray-500">days away</div>
                    <div className={`text-xs font-medium mt-1 ${urgStyle.days}`}>
                      {urgStyle.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-white/5 bg-white/5 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">About These Deadlines</h3>
          <div className="space-y-2 text-xs text-gray-500">
            <p>
              <strong className="text-gray-400">Tasdeeq Audits:</strong> Semi-annual audits
              conducted by MOHRE to verify Emiratisation headcount compliance. Penalties of AED
              9,000/month per unfilled position apply retroactively.
            </p>
            <p>
              <strong className="text-gray-400">E-Invoicing:</strong> The UAE Federal Tax
              Authority (FTA) is rolling out mandatory e-invoicing. Large companies (&gt; AED 50M
              revenue) must comply by January 2027, SMEs by July 2027.
            </p>
            <p>
              <strong className="text-gray-400">Nafis Subsidy Deadline:</strong> Apply early —
              Nafis processing takes 2-4 weeks. Submit applications before hiring to ensure timely
              subsidy payments.
            </p>
          </div>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
