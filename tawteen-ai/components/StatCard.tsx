import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  titleAr: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-white/5 border-white/10',
  danger: 'bg-red-500/10 border-red-500/30',
  success: 'bg-emerald-500/10 border-emerald-500/30',
  warning: 'bg-amber-500/10 border-amber-500/30',
};

const valueStyles = {
  default: 'text-white',
  danger: 'text-red-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
};

export default function StatCard({
  title,
  titleAr,
  value,
  subtitle,
  icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-3 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5" dir="rtl">
            {titleAr}
          </p>
        </div>
        {icon && (
          <div className="text-gray-400 flex-shrink-0">{icon}</div>
        )}
      </div>
      <div>
        <p className={`text-2xl font-bold ${valueStyles[variant]}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
