import {eq} from 'drizzle-orm';
import {db} from '@/db';
import {members, teams} from '@/db/schema';
import {findMemberByYearAndSlug, memberSlugFromName} from '@/lib/member-slug';
import type {Member, Team} from '@/types';

export async function getAllMembers(): Promise<Member[]> {
  try {
    return await db.select().from(members).orderBy(members.name);
  } catch (error) {
    console.error('Failed to load members:', error);
    return [];
  }
}

export async function getMemberByYearAndSlug(
    year: number,
    slug: string,
): Promise<Member | null> {
  try {
    const rows = await db
        .select()
        .from(members)
        .where(eq(members.memberYear, year));
    return findMemberByYearAndSlug(rows, year, slug) ?? null;
  } catch (error) {
    console.error('Failed to load member by year and slug:', error);
    return null;
  }
}

export async function getMemberWithTeam(
    year: number,
    slug: string,
): Promise<{ member: Member; team: Team | null } | null> {
  try {
    const member = await getMemberByYearAndSlug(year, slug);
    if (!member) return null;

    const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, member.teamId))
        .limit(1);

    return {member, team: team ?? null};
  } catch (error) {
    console.error('Failed to load member with team:', error);
    return null;
  }
}

export function getMemberSlugsForYear(
    memberList: Pick<Member, 'name' | 'memberYear'>[],
    year: number,
): string[] {
  return memberList
      .filter((m) => m.memberYear === year)
      .map((m) => memberSlugFromName(m.name));
}
