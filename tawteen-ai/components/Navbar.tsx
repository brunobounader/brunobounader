'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2 } from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم' },
  { href: '/calculator', label: 'Calculator', labelAr: 'الحاسبة' },
  { href: '/action-plan', label: 'Action Plan', labelAr: 'خطة العمل' },
  { href: '/deadlines', label: 'Deadlines', labelAr: 'المواعيد النهائية' },
  { href: '/talent', label: 'Find Talent', labelAr: 'ابحث عن كفاءات' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#0A1628] border-b border-[#C9A84C]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center group-hover:bg-[#E8C97A] transition-colors">
              <BarChart2 className="w-5 h-5 text-[#0A1628]" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Tawteen<span className="text-[#C9A84C]"> AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C9A84C] text-[#0A1628]'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C9A84C] text-[#0A1628]'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
