'use client';

import {sortYearsDesc} from '@/lib/years';
import type {Member} from '@/types';

interface TeamYearPickerProps {
  members: Member[];
  activeYear: number;
  onSelectYear: (year: number) => void;
}

export default function TeamYearPicker({
  members,
  activeYear,
  onSelectYear,
}: TeamYearPickerProps) {
  const years = sortYearsDesc(members.map((m) => m.memberYear));
  const latestYear = years[0];

  if (years.length <= 1) return null;

  const scrollToRoster = (year: number) => {
    onSelectYear(year);
    requestAnimationFrame(() => {
      document
          .getElementById('team-roster')
          ?.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  };

  return (
    <section
      id="team-year-picker"
      className="mt-20 pt-12 border-t border-slate-200 dark:border-white/10 scroll-mt-28"
      aria-labelledby="team-year-picker-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="team-year-picker-heading"
          className="text-xl md:text-2xl font-bold text-citc-navy dark:text-white mb-2"
        >
          Browse past teams
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
          Select an academic year. Latest shown first.
        </p>

        <div
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 px-1 justify-start sm:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Academic years"
        >
          {years.map((year) => {
            const count = members.filter((m) => m.memberYear === year).length;
            const isActive = activeYear === year;
            const isCurrent = year === latestYear;

            return (
              <button
                key={year}
                type="button"
                role="listitem"
                aria-pressed={isActive}
                onClick={() => scrollToRoster(year)}
                className={`snap-center shrink-0 flex flex-col items-center justify-center w-[7.5rem] h-[7.5rem] sm:w-32 sm:h-32 rounded-full border-2 transition-all ${
                  isActive ?
                  'border-[var(--color-citc-blue)] bg-[var(--color-citc-blue)] text-white shadow-lg shadow-[var(--color-citc-blue)]/25 scale-105' :
                  'border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-citc-navy dark:text-white hover:border-[var(--color-citc-blue)]/50 hover:bg-[var(--color-citc-blue-muted)] dark:hover:bg-citc-blue/10'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">
                  {year}
                </span>
                <span
                  className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                    isActive ? 'text-white/90' : 'text-[var(--color-citc-blue)]'
                  }`}
                >
                  {isCurrent ? 'Current' : 'Past'}
                </span>
                <span
                  className={`mt-0.5 text-[10px] ${
                    isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count} {count === 1 ? 'member' : 'members'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
