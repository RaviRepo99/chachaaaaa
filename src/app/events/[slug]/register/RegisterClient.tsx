'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {motion} from 'framer-motion';
import {ArrowLeft, Loader2, ExternalLink} from 'lucide-react';
import type {Event} from '@/types';
import {eventPath} from '@/lib/event-slug';

interface RegisterClientProps {
  event: Event;
}

export default function RegisterClient({event}: RegisterClientProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const backPath = eventPath(event);
  const isTally = event.registrationLink?.includes('tally.so');

  // Handle redirection for non-Tally links
  useEffect(() => {
    if (event.registrationLink && !isTally) {
      window.location.href = event.registrationLink;
    }
  }, [event.registrationLink, isTally]);

  // Make sure Tally embed gets initialized on dynamic SPA page transitions
  useEffect(() => {
    if (isTally && typeof window !== 'undefined' && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, [isTally]);

  if (!event.registrationLink) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-citc-navy flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 max-w-md w-full shadow-md">
          <p className="text-red-500 dark:text-red-400 font-medium mb-4">
            Registration link is missing or invalid.
          </p>
          <Link
            href={backPath}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-citc-blue)] text-white font-bold hover:bg-[var(--color-citc-blue)]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Event
          </Link>
        </div>
      </div>
    );
  }

  // If it's not a Tally link, we are redirecting the user
  if (!isTally) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-citc-navy flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 max-w-md w-full shadow-md">
          <Loader2 className="w-8 h-8 text-[var(--color-citc-blue)] animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Redirecting to Registration</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            We are taking you to the external registration page. If it
            doesn&apos;t open automatically, click the button below.
          </p>
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-citc-blue)] text-white font-bold hover:bg-[var(--color-citc-blue)]/90 transition-colors"
          >
            Open Registration <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Determine iframe source URL
  // Tally embed url should use /embed/ instead of /r/ for optimal embedded experience
  let embedUrl = event.registrationLink;
  if (embedUrl.includes('tally.so/r/')) {
    embedUrl = embedUrl.replace('tally.so/r/', 'tally.so/embed/');
  } else if (embedUrl.includes('tally.so/') && !embedUrl.includes('tally.so/embed/')) {
    const match = embedUrl.match(/tally\.so\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      embedUrl = `https://tally.so/embed/${match[1]}`;
    }
  }

  // Add embed parameters for cleaner Tally look
  if (embedUrl.includes('tally.so/embed/')) {
    try {
      const urlObj = new URL(embedUrl);
      urlObj.searchParams.set('hideTitle', '1');
      urlObj.searchParams.set('transparentBackground', '1');
      embedUrl = urlObj.toString();
    } catch (e) {
      console.error('Failed to parse embed URL', e);
    }
  }

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-citc-navy transition-colors duration-300">
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).Tally) {
            (window as any).Tally.loadEmbeds();
          }
        }}
      />

      <div className="site-container max-w-3xl">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href={backPath}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[var(--color-citc-blue)] dark:text-slate-400 dark:hover:text-white mb-6 transition-colors group font-semibold"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Event Details</span>
          </Link>

          <motion.div
            initial={{opacity: 0, y: 15}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none"
          >
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-citc-blue)]/10 text-[var(--color-citc-blue)] dark:bg-citc-blue/20 dark:text-citc-blue-muted border border-[var(--color-citc-blue)]/10 uppercase tracking-wider">
              Registration
            </span>
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 dark:text-white mt-4">
              {event.title}
            </h1>
          </motion.div>
        </div>

        {/* Embedded Form Container */}
        <motion.div
          initial={{opacity: 0, scale: 0.98}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.4, delay: 0.1}}
          className="relative bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden min-h-[650px] md:min-h-[800px] w-full"
        >
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
              <Loader2 className="w-8 h-8 text-[var(--color-citc-blue)] animate-spin mb-4" />
              <p className="text-sm text-slate-500 font-medium animate-pulse">
                Loading registration form...
              </p>
            </div>
          )}

          <iframe
            data-tally-src={embedUrl}
            src={embedUrl}
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0 min-h-[650px] md:min-h-[800px]"
            title={`Register for ${event.title}`}
            onLoad={handleIframeLoad}
          />
        </motion.div>
      </div>
    </div>
  );
}
