import type {Member, Team} from '@/types';

/** Display order: advisors → mentors → board of directors */
export function getTeamDisplayOrder(teamId: string): number {
  if (teamId === 't_patron' || teamId.startsWith('t_patron')) return 0;
  if (teamId === 't_faculty' || teamId.startsWith('t_faculty')) return 1;
  if (teamId.includes('mentor')) return 2;
  if (teamId.startsWith('t_exec')) return 3;
  return 99;
}

export function sortTeamsForDisplay(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    const order = getTeamDisplayOrder(a.id) - getTeamDisplayOrder(b.id);
    if (order !== 0) return order;
    return a.name.localeCompare(b.name);
  });
}

/** Keep the admin insertion order for the board roster display. */
export function sortMembersBySeniorityAndName(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const createdA = a.createdAt?.getTime?.() ?? 0;
    const createdB = b.createdAt?.getTime?.() ?? 0;
    if (createdA !== createdB) return createdA - createdB;
    return a.name.localeCompare(b.name);
  });
}
