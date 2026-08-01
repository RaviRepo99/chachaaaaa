import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {createPageMetadata} from '@/lib/seo';
import {eventPath} from '@/lib/event-slug';
import {getEventBySlug} from '@/lib/events';
import EventDetailsClient from './EventDetailsClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return {title: 'Event not found | CCRC IT CLUB'};
  }

  const plain = event.description
      .replace(/[#*_`[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);

  return createPageMetadata({
    title: event.title,
    description: plain || `${event.title} — ${event.date} at ${event.location}`,
    path: eventPath(event),
    ogImagePath: `${eventPath(event)}/opengraph-image`,
  });
}

export default async function EventDetailsPage({params}: PageProps) {
  const {slug} = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailsClient event={event} />;
}
