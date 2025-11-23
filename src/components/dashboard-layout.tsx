'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FileText, Home, Upload, LogOut, Briefcase } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useClientTranslations } from '@/hooks/useClientTranslations';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useClientTranslations();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-blue-100 fixed h-full shadow-sm">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/logo.svg" alt="PROPOSA AI" width={48} height={48} className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">PROPOSA AI</h1>
              <p className="text-xs text-gray-500">{userName || 'Demo User'}</p>
            </div>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          <Link href="/dashboard" className="block">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive('/dashboard') && pathname === '/dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}>
              <Home className="h-5 w-5" />
              <span className="font-medium">{t('dashboard.title', 'Dashboard')}</span>
            </div>
          </Link>
          <Link href="/dashboard/tenders" className="block">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive('/dashboard/tenders')
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}>
              <Briefcase className="h-5 w-5" />
              <span className="font-medium">{t('tenders.title', 'Tenders')}</span>
            </div>
          </Link>
          <Link href="/dashboard/proposals" className="block">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive('/dashboard/proposals')
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}>
              <FileText className="h-5 w-5" />
              <span className="font-medium">{t('proposals.title', 'Proposals')}</span>
            </div>
          </Link>
          <Link href="/dashboard/documents" className="block">
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive('/dashboard/documents')
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}>
              <Upload className="h-5 w-5" />
              <span className="font-medium">{t('documents.title', 'Documents')}</span>
            </div>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-3 right-3 space-y-2">
          <div className="flex justify-center py-2 border-t border-blue-100">
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t('common.logout', 'Logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}

