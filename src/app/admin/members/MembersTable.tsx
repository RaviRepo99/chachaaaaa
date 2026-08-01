'use client';

import {ChevronDown, Pencil, Search, Trash2} from 'lucide-react';
import Link from 'next/link';
import {useState} from 'react';
import MediaImage from '@/components/MediaImage';
import {getMemberThumbnailUrl} from '@/lib/media';
import type {Member, Team} from '@/types';

interface Props {
  members: Member[];
  teams: Team[];
  teamMap: Map<string, string>;
  years: number[];
  initialTeam?: string | null;
  initialYear?: number | null;
}

export default function MembersTable({
  members,
  teams,
  teamMap,
  years,
  initialTeam,
  initialYear,
}: Props) {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<number | null>(
      initialYear ?? (years.length > 0 ? years[0] : new Date().getFullYear()),
  );
  const [teamFilter, setTeamFilter] = useState<string | null>(
      initialTeam ?? null,
  );
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = members.filter((m) => {
    if (yearFilter && m.memberYear !== yearFilter) return false;
    if (teamFilter && m.teamId !== teamFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s) ||
        (m.department?.toLowerCase().includes(s) ?? false)
      );
    }
    return true;
  });

  const typeColors: Record<string, string> = {
    President:
      'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    'Vice President':
      'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/30',
    'Chief Innovation Director':
      'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30',
    Secretary:
      'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    'Program Incharge':
      'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/30',
    'Executive Head':
      'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    'IT Head':
      'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30',
    'Content Creator':
      'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30',
    Advisor:
      'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30',
    'Sponsorship Director':
      'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30',
    Treasurer:
      'bg-lime-50 text-lime-700 border-lime-100 dark:bg-lime-950/30 dark:text-lime-400 dark:border-lime-900/30',
    Patron:
      'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
  };

  return (
    <div>
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search members by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <select
              value={yearFilter ?? ''}
              onChange={(e) =>
                setYearFilter(e.target.value ? Number(e.target.value) : null)
              }
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all cursor-pointer shadow-sm"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative flex items-center">
            <select
              value={teamFilter ?? ''}
              onChange={(e) => setTeamFilter(e.target.value || null)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all cursor-pointer shadow-sm"
            >
              <option value="">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.year})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Name & Email
              </th>
              <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Team
              </th>
              <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Year
              </th>
              <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Role Type
              </th>
              <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((member) => {
              const thumbUrl = getMemberThumbnailUrl(member);
              const tagClass =
                typeColors[member.type] ||
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border-slate-200';

              return (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-clay-light text-forest/60 flex items-center justify-center text-xs font-semibold">
                        {thumbUrl ? (
                          <MediaImage
                            src={thumbUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {teamMap.get(member.teamId) === 'Executive Committee' ? 'Board of Directors' : teamMap.get(member.teamId) || member.teamId}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50/50 text-cyan-600 border border-cyan-100/50 dark:bg-cyan-950/20 dark:text-cyan-400 dark:border-cyan-900/25">
                      {member.memberYear}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold border ${tagClass}`}
                    >
                      {member.type}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/members/${member.id}/edit`}
                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded-xl transition-all"
                        aria-label="Edit Member"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmDelete === member.id ? (
                        <div className="flex items-center gap-1.5">
                          <form
                            action={`/api/members/${member.id}/delete`}
                            method="POST"
                          >
                            <button
                              type="submit"
                              className="px-2.5 py-1 text-xs font-bold text-white bg-terracotta rounded-lg hover:bg-terracotta/90 transition-colors"
                            >
                              Confirm
                            </button>
                          </form>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="px-2.5 py-1 text-xs font-medium text-forest/70 bg-clay-light hover:bg-stone/80 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(member.id)}
                          className="p-2 text-forest/40 hover:text-terracotta hover:bg-terracotta/10 rounded-xl transition-all"
                          aria-label="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 px-6">
          <p className="text-forest/50 text-sm mb-4">
            {members.length === 0 ?
              'No members yet. Create teams for the year, then add your first member.' :
              'No members match these filters. Try another year or clear search.'}
          </p>
          {members.length === 0 ? (
            <Link
              href="/admin/teams"
              className="text-sm font-semibold text-sage hover:underline"
            >
              Go to Teams →
            </Link>
          ) : null}
        </div>
      )}

      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/10 dark:bg-slate-900/5">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          Showing {filtered.length} of {members.length} total members
        </p>
      </div>
    </div>
  );
}
