import {db} from '@/db';
import {events} from '@/db/schema';
import {absoluteUrl} from '@/lib/seo';
import {resolveMediaUrl} from '@/lib/media';
import {renderOgImage} from '@/lib/og-image';
import {eventSlugFromTitle} from '@/lib/event-slug';

export const alt = 'CCRC IT CLUB event';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params;
  const allEvents = await db.select().from(events);
  const event = allEvents.find(
      (e) => eventSlugFromTitle(e.title) === slug.toLowerCase(),
  );

  if (!event) {
    return renderOgImage({
      title: 'CCRC IT CLUB Event',
      label: 'Events',
    });
  }

  const imagePath = resolveMediaUrl(event.image);
  const imageUrl = imagePath ? absoluteUrl(imagePath) : null;

  return renderOgImage({
    title: event.title,
    subtitle: `${event.date} · ${event.location}`,
    label: 'CCRC IT CLUB Event',
    imageUrl,
  });
}
