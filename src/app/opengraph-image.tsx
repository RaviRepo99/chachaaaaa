import {SITE_CONFIG} from '@/lib/site-config';
import {renderOgImage} from '@/lib/og-image';

export const alt = 'CCRC IT CLUB at CCRC';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: SITE_CONFIG.fullName,
    subtitle: SITE_CONFIG.tagline,
    label: 'Home',
  });
}
