'use client';

import {useState} from 'react';
import {motion} from 'framer-motion';
import {Calendar, History} from 'lucide-react';
import EventCard from '@/components/EventCard';
import {resolveAcademicYear, sortYearsDesc} from '@/lib/years';
import type {Event} from '@/types';

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.1},
  },
};

interface EventsClientProps {
  events: Event[];
}

export default function EventsClient({events}: EventsClientProps) {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const years = sortYearsDesc(events.map((e) => resolveAcademicYear(e.academicYear)));

  const filteredEvents = activeYear ?
    events.filter((e) => resolveAcademicYear(e.academicYear) === activeYear) :
    events;

  const runningEvents = filteredEvents.filter((e) => e.status === 'running');
  const upcomingEvents = filteredEvents.filter((e) => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter((e) => e.status === 'past');

  const activeEvents = [...runningEvents, ...upcomingEvents];

  return (
    <div className="min-h-screen pt-40 pb-20 bg-white dark:bg-citc-navy transition-colors duration-300">
      <div className="site-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-citc-navy dark:text-white mb-6">
            Events &amp; Workshops
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join us in our upcoming events or take a look at what we&apos;ve
            accomplished so far.
          </p>
        </div>

        {years.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              type="button"
              onClick={() => setActiveYear(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    !activeYear ?
                    'bg-[var(--color-citc-blue)] text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setActiveYear(year)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeYear === year ?
                    'bg-[var(--color-citc-blue)] text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {activeEvents.length > 0 ? (
          <section className="mb-20">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="hidden sm:block h-px flex-1 min-w-[2rem] bg-slate-200 dark:bg-white/10" />
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-citc-navy dark:text-white text-center">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-citc-blue)] shrink-0" />
                Running &amp; Upcoming
              </h2>
              <div className="hidden sm:block h-px flex-1 min-w-[2rem] bg-slate-200 dark:bg-white/10" />
            </div>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, margin: '-50px'}}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          </section>
        ) : (
          !pastEvents.length && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">
                No events found for this academic year.
              </p>
            </div>
          )
        )}

        {pastEvents.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="hidden sm:block h-px flex-1 min-w-[2rem] bg-slate-200 dark:bg-white/10" />
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400 text-center">
                <History className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                Past Events
              </h2>
              <div className="hidden sm:block h-px flex-1 min-w-[2rem] bg-slate-200 dark:bg-white/10" />
            </div>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, margin: '-50px'}}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
