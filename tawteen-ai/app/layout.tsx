import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Tawteen AI — Emiratisation Intelligence Platform',
  description:
    'Stay ahead of Emiratisation compliance. Calculate penalties, track deadlines, and generate AI-powered 90-day action plans for UAE businesses.',
  keywords: 'Emiratisation, UAE, MOHRE, Nafis, Tasdeeq, compliance, توطين',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0A1628] text-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 py-4 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Tawteen AI &mdash; Emiratisation Intelligence Platform |
          توطين الذكاء الاصطناعي
        </footer>
      </body>
    </html>
  );
}
