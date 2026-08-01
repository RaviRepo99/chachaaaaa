'use client';

import {PanelLeftClose, PanelLeftOpen} from 'lucide-react';
import {Suspense, useEffect, useState} from 'react';
import AdminFlash from '@/components/admin/AdminFlash';
import Sidebar from '@/components/admin/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

interface Props {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
  adminPhoto: string | null;
  adminPhotoVersion: number;
}

export default function AdminShell({
  children,
  adminName,
  adminEmail,
  adminPhoto,
  adminPhotoVersion,
}: Props) {
  const [dateStr, setDateStr] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setDateStr(
        new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
    );
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [adminPhoto, setImgError]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const photoUrl = adminPhoto && !imgError ? adminPhoto : null;
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-alabaster flex font-source-sans">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {!sidebarCollapsed && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/15 backdrop-blur-sm md:hidden transition-opacity duration-300 cursor-default"
          onClick={toggleSidebar}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
        }`}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone bg-alabaster/90 backdrop-blur-sm px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-forest/50 hover:text-forest hover:bg-clay-light/80 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
              aria-label={
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <PanelLeftClose className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
            <span className="hidden sm:block text-xs font-medium text-forest/50 uppercase tracking-widest">
              Console &bull; {dateStr || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-stone" />
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-forest dark:bg-ccrcitclub-blue flex items-center justify-center text-white text-xs font-semibold shadow-sm overflow-hidden shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={adminName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-forest truncate max-w-[140px]">
                  {adminName}
                </p>
                <p className="text-[10px] text-forest/50 truncate max-w-[140px]">
                  {adminEmail}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          <Suspense fallback={null}>
            <AdminFlash />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
