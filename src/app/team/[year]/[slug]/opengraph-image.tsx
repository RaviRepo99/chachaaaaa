import {getMemberWithTeam} from '@/lib/members';
import {absoluteUrl} from '@/lib/seo';
import {getMemberPhotoUrl} from '@/lib/media';
import {renderOgImage} from '@/lib/og-image';

export const alt = 'CCRC IT CLUB team member';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const {year, slug} = await params;
  const yearNum = Number(year);

  const data = Number.isFinite(yearNum) ?
    await getMemberWithTeam(yearNum, slug) :
    null;

  if (!data) {
    return renderOgImage({
      title: 'Team member',
      subtitle: 'CCRC IT CLUB at CCRC',
      label: 'Team',
    });
  }

  const {member, team} = data;
  const photo = getMemberPhotoUrl(member);
  const photoAbsolute = photo ? absoluteUrl(photo.split('?')[0] ?? photo) : null;

  return renderOgImage({
    title: member.name,
    subtitle: [member.type, team?.name, `${member.memberYear}`]
        .filter(Boolean)
        .join(' · '),
    label: 'CCRC IT CLUB Team',
    imageUrl: photoAbsolute,
  });
}
