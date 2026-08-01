'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
  }, [pathname, searchParams]);

  return null;
}
