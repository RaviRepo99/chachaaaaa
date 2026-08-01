import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {createPageMetadata} from '@/lib/seo';
import {eventPath} from '@/lib/event-slug';
import {getEventBySlug} from '@/lib/events';
import RegisterClient from './RegisterClient';

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
    return {title: 'Event not found | CITC'};
  }

  return createPageMetadata({
    title: `Register for ${event.title} | CCRC IT CLUB`,
    description: `Register for ${event.title} - Computer Science Innovation & Tech Club (CCRC IT CLUB)`,
    path: `${eventPath(event)}/register`,
  });
}

export default async function EventRegisterPage({params}: PageProps) {
  const {slug} = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return <RegisterClient event={event} />;
}
