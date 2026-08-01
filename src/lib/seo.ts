import type {Metadata} from 'next';
import {SITE_CONFIG} from '@/lib/site-config';

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return SITE_CONFIG.url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = getSiteUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogImagePath?: string;
  noIndex?: boolean;
};

/** Shared metadata for public pages (title, description, canonical, Open Graph, Twitter). */
export function createPageMetadata({
  title,
  description,
  path,
  ogImagePath,
  noIndex = false,
}: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(ogImagePath ?? `${path}/opengraph-image`);

  const fullTitle = title.includes('CCRC IT CLUB') ? title : `${title} | CCRC IT CLUB`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {canonical},
    robots: noIndex ? {index: false, follow: false} : {index: true, follow: true},
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export const defaultSiteMetadata: Metadata = createPageMetadata({
  title: 'CCRC IT CLUB - Computer Science Innovation & Tech Club',
  description: SITE_CONFIG.description,
  path: '/',
  ogImagePath: '/opengraph-image',
});
