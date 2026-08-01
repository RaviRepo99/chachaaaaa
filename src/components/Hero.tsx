import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {SITE_CONFIG} from '@/lib/site-config';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[min(92vh,880px)] flex items-center bg-white text-black">
      <div className="relative z-10 flex w-full justify-center site-container py-28 md:py-36">
        <div className="mx-auto w-full max-w-xl text-center sm:max-w-2xl lg:max-w-3xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <p className="text-sm font-semibold tracking-wide text-[var(--color-citc-blue)] uppercase">
              {SITE_CONFIG.tagline}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-5xl font-bold tracking-tight text-black leading-[1.15] text-balance mx-auto">
              {SITE_CONFIG.fullName}
            </h1>

            <p className="mx-auto max-w-prose text-base sm:text-lg text-black/70 leading-relaxed">
              A student-driven innovation and technology community at CCRC, empowering students to explore, create, and lead through workshops, hackathons, competitions, technical events, and real-world projects.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 grid w-full max-w-md mx-auto grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-lg">
            <Link
              href="/join"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-slate-800 sm:px-8"
            >
              Join the Club
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
            <Link
              href="/events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 font-medium text-black sm:px-8"
            >
              See Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
