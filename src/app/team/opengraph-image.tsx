import {renderOgImage} from '@/lib/og-image';

export const alt = 'CCRC IT CLUB Team';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Meet the CCRC IT CLUB Team',
    subtitle: 'Board of Directors at CCRC',
    label: 'Team',
  });
}
