import type {Metadata} from 'next';
import {notFound, redirect} from 'next/navigation';
import {getMemberWithTeam} from '@/lib/members';
import {memberProfilePath} from '@/lib/member-slug';
import {createPageMetadata} from '@/lib/seo';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ year: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {year, slug} = await params;
  const yearNum = Number(year);
  if (!Number.isFinite(yearNum)) {
    return {title: 'Member not found | CCRC IT CLUB'};
  }

  const data = await getMemberWithTeam(yearNum, slug);
  if (!data) {
    return {title: 'Member not found | CCRC IT CLUB'};
  }

  const {member, team} = data;
  const path = memberProfilePath(member);
  const description = [
    member.type,
    team?.name,
    `Academic year ${member.memberYear}`,
    'CCRC IT CLUB at CCRC',
  ]
      .filter(Boolean)
      .join(' · ');

  return createPageMetadata({
    title: `${member.name} — CCRC IT CLUB Team ${member.memberYear}`,
    description,
    path,
    ogImagePath: `${path}/opengraph-image`,
  });
}

/** Shareable link: opens team roster with profile popup. */
export default async function MemberProfilePage({params}: PageProps) {
  const {year, slug} = await params;
  const yearNum = Number(year);
  if (!Number.isFinite(yearNum)) notFound();

  const data = await getMemberWithTeam(yearNum, slug);
  if (!data) notFound();

  redirect(`/team/${yearNum}?member=${encodeURIComponent(slug)}`);
}
