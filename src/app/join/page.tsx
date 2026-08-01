'use client';

import {useEffect} from 'react';

interface TallyWindow extends Window {
  Tally?: { loadEmbeds: () => void };
}

export default function JoinClubPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as TallyWindow).Tally) {
        (window as TallyWindow).Tally?.loadEmbeds();
      }
    };
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-citc-navy transition-colors duration-300 flex items-center justify-center pt-24 px-4 w-full min-w-0 overflow-x-clip">
      <div className="w-full max-w-2xl">
        <iframe
          data-tally-src="https://tally.so/embed/yP4Dep?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="CCRC IT CLUB Reserve"
          className="tally-embed rounded-2xl dark:invert"
          style={{minHeight: '600px'}}
        />
      </div>
    </main>
  );
}
