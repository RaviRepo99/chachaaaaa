import type {Metadata} from 'next';
import {Suspense} from 'react';
import {db} from '@/db';
import {teams, members} from '@/db/schema';
import {createPageMetadata} from '@/lib/seo';
import type {Member, Team} from '@/types';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'TEAM - IT CLUB',
  description:
    'Meet CCRC IT CLUB Board of Directors at Capital College and Research Center. Browse rosters by academic year.',
  path: '/team',
  ogImagePath: '/team/opengraph-image',
});

type PageProps = {
  searchParams: Promise<{ member?: string }>;
};

export default async function TeamPage({searchParams}: PageProps) {
  const {member: memberSlug} = await searchParams;

  let allTeams: Team[] = [];
  let allMembers: Member[] = [];

  try {
    allTeams = await db.select().from(teams).orderBy(teams.year);
    allMembers = await db
        .select()
        .from(members)
        .orderBy(members.createdAt, members.name);
  } catch (error) {
    console.error('Failed to load team data:', error);
  }

  const teamData = {teams: allTeams, members: allMembers};
  return (
    <Suspense fallback={null}>
      <TeamClient
        teamData={teamData}
        initialMemberSlug={memberSlug ?? null}
      />
    </Suspense>
  );
}
