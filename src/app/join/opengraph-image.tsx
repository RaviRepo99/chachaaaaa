import {renderOgImage} from '@/lib/og-image';

export const alt = 'Join CCRC IT CLUB';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Join CCRC IT CLUB',
    subtitle: 'Become part of the tech community at CCRC',
    label: 'Membership',
  });
}
