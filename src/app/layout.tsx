import type {Metadata} from 'next';
import Script from 'next/script';
import {Suspense} from 'react';
import ConditionalLayout from '@/components/ConditionalLayout';
import ScrollToTop from '@/components/ScrollToTop';
import {defaultSiteMetadata, getSiteUrl} from '@/lib/seo';
import {SITE_CONFIG} from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  ...defaultSiteMetadata,
  icons: {
    icon: [
      {url: '/favicon/favicon.ico', sizes: 'any'},
      {url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: {
    title: 'CCRC IT CLUB',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();

  const organizationJsonLd = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': SITE_CONFIG.fullName,
    'alternateName': SITE_CONFIG.name,
    'url': siteUrl,
    'logo': {
      '@type': 'ImageObject',
      'url': `${siteUrl}/ccrc_it_logo.jpg`,
    },
    'email': SITE_CONFIG.email,
    'foundingDate': SITE_CONFIG.foundingDate,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': SITE_CONFIG.location.city,
      'addressRegion': SITE_CONFIG.location.region,
      'addressCountry': SITE_CONFIG.location.country,
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'email': SITE_CONFIG.email,
      'contactType': 'technical support',
    },
    'sameAs': [
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.linkedin,
    ].filter(Boolean),
  };

  const websiteJsonLd = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'url': siteUrl,
    'name': SITE_CONFIG.name,
    'description': SITE_CONFIG.description,
    'publisher': {
      '@id': `${siteUrl}/#organization`,
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/events?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const navigationJsonLd = {
    '@type': 'ItemList',
    '@id': `${siteUrl}/#navigation`,
    'name': 'Main Navigation',
    'itemListElement': [
      {
        '@type': 'SiteNavigationElement',
        'position': 1,
        'name': 'Home',
        'url': `${siteUrl}/`,
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 2,
        'name': 'Events',
        'url': `${siteUrl}/events`,
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 3,
        'name': 'Team',
        'url': `${siteUrl}/team`,
      },
      {
        '@type': 'SiteNavigationElement',
        'position': 4,
        'name': 'Join Club',
        'url': `${siteUrl}/join`,
      },
    ],
  };

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd, websiteJsonLd, navigationJsonLd],
  };

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
                process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            })};`,
          }}
        />
        
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col w-full min-w-0 overflow-x-clip bg-white dark:bg-ccrcitclub-navy transition-colors duration-300">
        <Script src="/scripts/theme-init.js" strategy="beforeInteractive" />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
