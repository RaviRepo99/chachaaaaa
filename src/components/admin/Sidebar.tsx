'use client';

import {ExternalLink, LogOut} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ADMIN_NAV_ITEMS, isAdminNavActive} from '@/lib/admin-nav';

export default function Sidebar({collapsed}: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-clay-light border-r border-stone overflow-hidden transition-all duration-300 ease-in-out ${
        collapsed ?
          '-translate-x-full md:translate-x-0 md:w-16' :
          'translate-x-0 md:w-64'
      }`}
    >
      <div className="flex items-center gap-3 h-16 px-4 border-b border-stone shrink-0">
        <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
          C
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold tracking-tight text-forest truncate">
              CCRC IT CLUB Admin
            </span>
            <span className="text-[10px] font-medium text-forest/50 uppercase tracking-widest truncate">
              Content manager
            </span>
          </div>
        )}
      </div>

      <nav className="flex flex-col px-2 py-4 gap-0.5 overflow-y-auto flex-1">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-forest/40">
            Menu
          </p>
        )}
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = isAdminNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : item.description}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive ?
                  'bg-clay-light/80 text-forest shadow-sm' :
                  'text-forest/60 hover:bg-clay-light/50 hover:text-forest'
              } active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50`}
            >
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-sage" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                  isActive ?
                    'text-sage' :
                    'text-forest/40 group-hover:text-sage'
                }`}
                strokeWidth={1.5}
              />
              {!collapsed && (
                <span className="flex flex-col min-w-0">
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={`flex flex-col gap-0.5 px-2 py-3 border-t border-stone ${
          collapsed ? 'items-center' : ''
        }`}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-forest/60 hover:bg-clay-light/50 hover:text-forest transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          } active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50`}
        >
          <ExternalLink className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span className="truncate">View website</span>}
        </a>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-terracotta hover:bg-terracotta/10 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            } active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 cursor-pointer`}
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span className="truncate">Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
