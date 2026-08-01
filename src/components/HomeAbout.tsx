'use client';

import {useRef} from 'react';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {motion, useInView, useReducedMotion} from 'framer-motion';
import {seedAssetPath} from '@/lib/seed-assets';
import {SITE_CONFIG} from '@/lib/site-config';

const tiles = [
  {
    href: '/events',
    layout: 'md:col-start-1 md:row-start-1 md:row-span-2',
    eyebrow: 'Workshops',
    title: 'Prompt to Image – AI Creativity Competition',
    body: 'Unleash your creativity with AI! Join the Prompt to Image competition at CCRC Hall A and transform your ideas into stunning AI-generated artwork.',
    cta: 'Past events',
    featured: true,
    image: seedAssetPath('event/003/IoTExpo2082.png'),
  },
  {
    href: '/events',
    layout: 'md:col-start-2 md:col-span-2 md:row-start-1',
    eyebrow: 'Competitions',
    title: 'Club-run contests',
    body: 'Structured challenges like Prompt to Image with real judging and prizes.',
    cta: 'See results',
    featured: false,
  },
  {
    href: '/team',
    layout: 'md:col-start-2 md:row-start-2',
    eyebrow: 'People',
    title: 'Students who organize it',
    body: 'Mentors, executives, and advisors from comp eng who book the room and run the night.',
    cta: 'Meet the team',
    featured: false,
  },
  {
    href: '/join',
    layout: 'md:col-start-3 md:row-start-2',
    eyebrow: 'Join',
    title: 'Open to all CCRC students',
    body: 'Show up for the next workshop or competition. No prior club membership required.',
    cta: 'Sign up',
    featured: false,
  },
] as const;

export default function HomeAbout() {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    amount: 0.15,
    once: false,
    margin: '0px 0px -12% 0px',
  });
  const easeOut = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.section
      ref={ref}
      initial={shouldReduceMotion ? false : {opacity: 0, y: 60, filter: 'blur(10px)'}}
      animate={
        shouldReduceMotion ?
          {opacity: 1, y: 0, filter: 'blur(0px)'} :
          isInView ?
            {opacity: 1, y: 0, filter: 'blur(0px)'} :
            {opacity: 0, y: 60, filter: 'blur(10px)'}
      }
      transition={shouldReduceMotion ? undefined : {duration: 0.8, ease: easeOut}}
      style={{willChange: 'transform, opacity, filter'}}
      className="relative -mt-20 overflow-hidden bg-white pt-4 text-slate-900 sm:-mt-28 sm:pt-6 dark:bg-slate-900 dark:text-white"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20 bg-gradient-to-b from-white to-transparent sm:h-28 dark:from-citc-navy"
        aria-hidden
      />
      <div className="relative z-10 site-container py-12 md:py-14">
        <motion.header
          initial={shouldReduceMotion ? false : {opacity: 0, y: 20, filter: 'blur(6px)'}}
          animate={
            shouldReduceMotion ?
              {opacity: 1, y: 0, filter: 'blur(0px)'} :
              isInView ?
                {opacity: 1, y: 0, filter: 'blur(0px)'} :
                {opacity: 0, y: 20, filter: 'blur(6px)'}
          }
          transition={shouldReduceMotion ? undefined : {duration: 0.55, ease: easeOut}}
          style={{willChange: 'transform, opacity, filter'}}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-balance text-slate-900 md:text-3xl dark:text-white">
            What we do
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {SITE_CONFIG.name} is run by computer science students.
          </p>
        </motion.header>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3 md:grid-rows-2 md:gap-4 md:min-h-[22rem] lg:min-h-[24rem]">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.title}
              initial={shouldReduceMotion ? false : {opacity: 0, y: 40, scale: 0.97}}
              animate={
                shouldReduceMotion ?
                  {opacity: 1, y: 0, scale: 1} :
                  isInView ?
                    {opacity: 1, y: 0, scale: 1} :
                    {opacity: 0, y: 40, scale: 0.97}
              }
              transition={shouldReduceMotion ? undefined : {duration: 0.58, ease: easeOut, delay: index * 0.12}}
              whileHover={shouldReduceMotion ? undefined : {y: -6, scale: 1.02}}
              style={{willChange: 'transform, opacity'}}
              className="transform-gpu"
            >
              <Link
                href={tile.href}
                className={`group relative flex h-full min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-slate-900/10 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.07] md:p-6 ${
                  tile.layout
                }`}
              >
                {tile.featured && tile.image ? (
                  <>
                    <div className="absolute inset-0">
                      <Image
                        src={tile.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover opacity-[0.12] transition-opacity group-hover:opacity-[0.18] dark:opacity-20 dark:group-hover:opacity-25"
                        aria-hidden
                      />
                    </div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/92 to-slate-50/55 dark:from-citc-navy dark:via-citc-navy/88 dark:to-citc-navy/45"
                      aria-hidden
                    />
                  </>
                ) : null}

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {tile.eyebrow}
                  </p>
                  <h3
                    className={`mt-2 font-bold text-citc-navy dark:text-white ${tile.featured ? 'text-xl md:text-2xl' : 'text-lg'}`}
                  >
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-[0.9375rem]">
                    {tile.body}
                  </p>
                </div>

                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-900 dark:text-white dark:group-hover:text-white/90">
                  {tile.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
