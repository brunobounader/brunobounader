'use client';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

interface ComplianceGaugeProps {
  currentPct: number;
  requiredPct: number;
  isCompliant: boolean;
  isFreeZoneExempt: boolean;
}

export default function ComplianceGauge({
  currentPct,
  requiredPct,
  isCompliant,
  isFreeZoneExempt,
}: ComplianceGaugeProps) {
  const displayPct = Math.min(currentPct, 100);
  const color = isFreeZoneExempt ? '#10B981' : isCompliant ? '#10B981' : '#EF4444';
  const label = isFreeZoneExempt ? 'Exempt' : isCompliant ? 'Compliant' : 'Non-Compliant';
  const labelAr = isFreeZoneExempt ? 'معفى' : isCompliant ? 'ملتزم' : 'غير ملتزم';

  const data = [{ value: displayPct, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#ffffff10' }}
              dataKey="value"
              cornerRadius={6}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {isFreeZoneExempt ? 'N/A' : `${displayPct.toFixed(1)}%`}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {isFreeZoneExempt ? 'Free Zone' : `of ${requiredPct.toFixed(0)}% target`}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <p className="text-xs text-gray-500 mt-1" dir="rtl">
          {labelAr}
        </p>
      </div>
    </div>
  );
}
