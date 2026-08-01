'use client';

import {Plus, Trash2, Users} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import type {Team} from '@/types';

interface Props {
  teams: Team[];
  countMap: Map<string, number>;
  years: number[];
}

const TEAM_TYPES = [
  {id: 't_patron', label: 'Patron'},
  {id: 't_exec', label: 'Board of Directors'},
];

export default function TeamsManager({teams, countMap, years}: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newYear, setNewYear] = useState(new Date().getFullYear() + 1);
  const [newTeamId, setNewTeamId] = useState('t_exec');
  const [newTeamName, setNewTeamName] = useState('Board of Directors');
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleTeamTypeChange = (id: string) => {
    setNewTeamId(id);
    const t = TEAM_TYPES.find((t) => t.id === id);
    setNewTeamName(t?.label || id);
  };

  const handleCreateTeam = async () => {
    const slug = `${newTeamId}_${newYear}`;
    const existing = teams.find((t) => t.id === slug);
    if (existing) {
      setError(`Team "${newTeamName} (${newYear})" already exists`);
      return;
    }
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: slug, name: newTeamName, year: newYear}),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create');
      }
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    const memberTotal = countMap.get(teamId) ?? 0;
    if (memberTotal > 0) {
      setError(
          `Cannot delete: ${memberTotal} member(s) still assigned. Reassign or remove them first.`,
      );
      setConfirmDeleteId(null);
      return;
    }
    setDeletingId(teamId);
    setError('');
    try {
      const res = await fetch(`/api/teams/${teamId}/delete`, {method: 'POST'});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      setConfirmDeleteId(null);
      router.push('/admin/teams?flash=deleted');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error ? (
        <p className="text-sm text-terracotta bg-terracotta/10 border border-terracotta/20 rounded-xl px-4 py-3">
          {error}
        </p>
      ) : null}

      {years.map((year) => {
        const yearTeams = teams.filter((t) => t.year === year);
        return (
          <div
            key={year}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {year} Teams
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {yearTeams.map((team) => (
                <div
                  key={team.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {team.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {countMap.get(team.id) || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/members?team=${team.id}&year=${team.year}`}
                      className="px-3 py-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    >
                      View Members
                    </Link>
                    {confirmDeleteId === team.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(team.id)}
                          disabled={deletingId !== null}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-terracotta rounded-lg hover:bg-terracotta/90 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 text-xs font-medium text-forest/70 hover:bg-clay-light rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setConfirmDeleteId(team.id);
                        }}
                        disabled={deletingId !== null}
                        className="p-2 text-forest/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Delete ${team.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Team for New Year
          </button>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Create New Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Team Type
                </label>
                <select
                  value={newTeamId}
                  onChange={(e) => handleTeamTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                >
                  {TEAM_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleCreateTeam}
                  disabled={creating}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
