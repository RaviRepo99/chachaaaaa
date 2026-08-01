'use client';

import {Calendar, MapPin, Clock, ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EventRegistrationButton from '@/components/EventRegistrationButton';
import MediaImage from '@/components/MediaImage';
import {eventSlugFromTitle} from '@/lib/event-slug';
import type {Event} from '@/types';

interface EventDetailsClientProps {
  event: Event;
}

export default function EventDetailsClient({event}: EventDetailsClientProps) {
  const isRunning = event.status === 'running';

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-citc-navy transition-colors duration-300">
      <div className="h-10" />
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <MediaImage
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-citc-navy to-transparent" />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 site-container">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            {event.tags?.map((tag) => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-citc-blue)]/30 text-white backdrop-blur-md border border-[var(--color-citc-blue)]/40">
                {tag}
              </span>
            ))}
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isRunning ? 'bg-citc-blue text-white' : 'bg-slate-700 text-slate-200'}`}>
              {event.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-balance max-w-5xl">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="site-container py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-12">
          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 sticky top-24 shadow-sm dark:shadow-none">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Event Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[var(--color-citc-blue-muted)] dark:bg-citc-blue/20 text-[var(--color-citc-blue)]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Date</p>
                    <p className="text-slate-900 dark:text-slate-200 font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[var(--color-citc-blue-muted)] dark:bg-citc-blue/20 text-[var(--color-citc-blue)]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Time</p>
                    <p className="text-slate-900 dark:text-slate-200 font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[var(--color-citc-blue-muted)] dark:bg-citc-blue/20 text-[var(--color-citc-blue)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Location</p>
                    <p className="text-slate-900 dark:text-slate-200 font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>

              {(event.status === 'running' || event.status === 'upcoming') && event.registrationLink && (
                <div className="mt-8">
                  <EventRegistrationButton
                    href={event.registrationLink}
                    eventSlug={eventSlugFromTitle(event.title)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-citc-blue)] px-6 py-4 text-white font-bold transition-colors hover:bg-[var(--color-citc-blue)]/90"
                    iconClassName="w-5 h-5"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
                About the Event
              </h2>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event.description}
                </ReactMarkdown>
              </div>
            </div>

            {event.gallery && event.gallery.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Event Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.gallery.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                      <MediaImage
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
