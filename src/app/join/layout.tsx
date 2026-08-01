import type {Metadata} from 'next';
import {createPageMetadata} from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Join CCRC IT CLUB',
  description:
    'Apply to join the Computer Science Innovation & Tech Club at Capital College and Research Center.',
  path: '/join',
  ogImagePath: '/join/opengraph-image',
});

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
