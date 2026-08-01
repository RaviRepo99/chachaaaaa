import {renderOgImage} from '@/lib/og-image';

export const alt = 'CCRC IT CLUB Events';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'CCRC IT CLUB Events',
    subtitle: 'Workshops, competitions, and club activities',
    label: 'Events',
  });
}
