'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import { getComplianceStatus, getPenaltyProjection, formatAED } from '@/lib/emiratisation';
import Disclaimer from '@/components/Disclaimer';
import type { CompanyProfile, ComplianceStatus, PenaltyProjection } from '@/lib/types';

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-[#C9A84C] font-bold text-base mt-4 mb-2">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-[#E8C97A] font-bold text-lg mt-6 mb-3 border-b border-white/10 pb-2">$1</h2>'
    )
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-bold text-xl mt-6 mb-3">$1</h1>')
    .replace(
      /^[•\-\*] (.+)$/gm,
      '<li class="flex gap-2 my-1"><span class="text-[#C9A84C] flex-shrink-0 mt-1">•</span><span>$1</span></li>'
    )
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="flex gap-2 my-1"><span class="text-[#C9A84C] font-bold flex-shrink-0 w-5">$1.</span><span>$2</span></li>'
    )
    .replace(/\n\n/g, '<br/><br/>');
}

// Read profile synchronously from localStorage to avoid setState-in-effect pattern
function readProfileData(): {
  profile: CompanyProfile;
  status: ComplianceStatus;
  projection: PenaltyProjection;
} | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tawteen_profile');
  if (!stored) return null;
  const p: CompanyProfile = JSON.parse(stored);
  return {
    profile: p,
    status: getComplianceStatus(p),
    projection: getPenaltyProjection(p),
  };
}

export default function ActionPlanPage() {
  const router = useRouter();
  const profileData = useRef(readProfileData());
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileData.current) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (outputRef.current && output) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const generatePlan = async () => {
    if (!profileData.current) return;
    const { profile, status, projection } = profileData.current;

    setIsStreaming(true);
    setOutput('');
    setError('');
    setHasGenerated(true);

    try {
      const res = await fetch('/api/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, status, projection }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to generate action plan');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setOutput(accumulated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsStreaming(false);
    }
  };

  const data = profileData.current;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const { profile, status, projection } = data;

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
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">AI Action Plan</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              خطة عمل ذكية — 90-Day Emiratisation Compliance Plan
            </p>
          </div>
        </div>

        {/* Company Summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#C9A84C]" />
            <h2 className="text-sm font-semibold text-[#C9A84C]">
              Company Summary | ملخص الشركة
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Company | الشركة</p>
              <p className="text-white font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Sector | القطاع</p>
              <p className="text-white font-medium">{profile.sector}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Gap | الفجوة</p>
              <p
                className={`font-bold ${
                  status.gap > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {status.isFreeZoneExempt
                  ? 'Exempt'
                  : status.gap === 0
                  ? '✓ Compliant'
                  : `${status.gap} positions`}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Annual Penalty | الغرامة</p>
              <p className="text-red-400 font-bold">{formatAED(projection.annualPenalty)}</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={generatePlan}
            disabled={isStreaming}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {isStreaming ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {hasGenerated ? 'Regenerate 90-Day Plan' : 'Generate 90-Day Compliance Plan'}
              </>
            )}
          </button>
          {!isStreaming && !hasGenerated && (
            <p className="text-xs text-gray-500">Powered by Claude AI — takes ~30 seconds</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm">Error generating plan</p>
              <p className="text-red-400/70 text-xs mt-1">{error}</p>
              <p className="text-gray-500 text-xs mt-1">
                Make sure ANTHROPIC_API_KEY is set in your environment.
              </p>
            </div>
          </div>
        )}

        {/* Output */}
        {(output || isStreaming) && (
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">
                  90-Day Compliance Plan | خطة الامتثال لـ 90 يوماً
                </span>
              </div>
              {isStreaming && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs text-purple-400">Generating...</span>
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="p-6 max-h-[600px] overflow-y-auto text-sm text-gray-300 leading-relaxed"
            >
              {output ? (
                <div
                  className="prose-invert"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }}
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Starting generation...
                </div>
              )}
              {isStreaming && output && (
                <span className="inline-block w-1 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>
        )}

        {/* Key Portals */}
        <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5 mb-6">
          <h3 className="text-sm font-semibold text-[#C9A84C] mb-3">
            Key UAE Compliance Portals | البوابات الرئيسية
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                name: 'MOHRE Portal',
                nameAr: 'بوابة وزارة الموارد البشرية',
                url: 'mohre.gov.ae',
                desc: 'Register & update Emiratisation headcount',
              },
              {
                name: 'Nafis Platform',
                nameAr: 'منصة نافس',
                url: 'nafis.gov.ae',
                desc: 'Apply for Emirati salary support subsidies',
              },
              {
                name: 'Tasdeeq',
                nameAr: 'التصديق',
                url: 'tasdeeq.ae',
                desc: 'Emiratisation audit & certification portal',
              },
            ].map((portal) => (
              <div key={portal.name} className="p-3 rounded-lg border border-white/5 bg-white/5">
                <p className="font-semibold text-white">{portal.name}</p>
                <p className="text-gray-500 text-xs mt-0.5" dir="rtl">
                  {portal.nameAr}
                </p>
                <p className="text-[#C9A84C]/60 mt-1">{portal.url}</p>
                <p className="text-gray-500 mt-1">{portal.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
