import {cache} from 'react';
import {eq} from 'drizzle-orm';
import {db} from '@/db';
import {events} from '@/db/schema';
import {eventSlugFromTitle} from '@/lib/event-slug';
import type {Event} from '@/types';

export const getEventBySlug = cache(async (slug: string): Promise<Event | null> => {
  const normalizedSlug = slug.toLowerCase();
  const allEvents = await db.select().from(events);
  return allEvents.find((event) => eventSlugFromTitle(event.title) === normalizedSlug) ?? null;
});

export async function getEventById(id: string): Promise<Event | null> {
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return event ?? null;
}
