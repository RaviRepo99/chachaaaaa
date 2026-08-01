import {count, desc} from 'drizzle-orm';
import {
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import MediaImage from '@/components/MediaImage';
import {getMemberThumbnailUrl} from '@/lib/media';
import {db} from '@/db';
import {events, members, teams} from '@/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [memberCount] = await db.select({count: count()}).from(members);
  const [eventCount] = await db.select({count: count()}).from(events);
  const [teamCount] = await db.select({count: count()}).from(teams);

  const recentMembers = await db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt))
      .limit(5);

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-forest tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-forest/60">
          Manage what appears on the public CCRC IT CLUB website
        </p>
      </div>

      <div className="rounded-2xl border border-sage/25 bg-sage-light/40 px-5 py-4">
        <p className="text-sm font-semibold text-forest mb-2">Recommended order</p>
        <ol className="text-sm text-forest/70 space-y-1 list-decimal list-inside">
          <li>
            <Link href="/admin/teams" className="text-sage font-medium hover:underline">
              Teams
            </Link>{' '}
            — set up groups for each academic year
          </li>
          <li>
            <Link href="/admin/members" className="text-sage font-medium hover:underline">
              Members
            </Link>{' '}
            — add people to those teams
          </li>
          <li>
            <Link href="/admin/events" className="text-sage font-medium hover:underline">
              Events
            </Link>{' '}
            — publish workshops and competitions
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {(
          [
            {
              label: 'Members',
              count: memberCount.count,
              icon: Users,
              tag: 'In database',
              href: '/admin/members',
            },
            {
              label: 'Events',
              count: eventCount.count,
              icon: Calendar,
              tag: 'All time',
              href: '/admin/events',
            },
            {
              label: 'Teams',
              count: teamCount.count,
              icon: Layers,
              tag: 'All years',
              href: '/admin/teams',
            },
          ] as const
        ).map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative bg-white dark:bg-clay-light rounded-2xl border border-stone/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-forest/50 uppercase tracking-widest">
                    {card.label}
                  </p>
                  <span className="text-3xl md:text-4xl font-bold text-forest leading-none tabular-nums">
                    {card.count}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-clay-light flex items-center justify-center text-sage shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-forest/50">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sage-light text-forest font-medium text-[10px] uppercase tracking-wider">
                  {card.tag}
                </span>
                <span className="group-hover:text-sage transition-colors">
                  Open →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-clay-light rounded-2xl border border-stone/60 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
          <div className="px-5 md:px-6 py-4 border-b border-stone/60 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-forest uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
              Recent Members
            </h2>
          </div>
          <div className="p-2 md:p-3 space-y-0.5">
            {recentMembers.map((m) => {
              const thumbUrl = getMemberThumbnailUrl(m);
              return (
                <Link
                  key={m.id}
                  href={`/admin/members/${m.id}/edit`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-clay-light/60 transition-all duration-200 active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
                >
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-clay-light text-forest/60 flex items-center justify-center text-sm font-semibold">
                    {thumbUrl ? (
                      <MediaImage
                        src={thumbUrl}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{m.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-forest group-hover:text-sage transition-colors duration-200 truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-forest/50 flex items-center gap-1.5 mt-0.5">
                      <span>Year {m.memberYear}</span>
                      <span className="text-stone">&bull;</span>
                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-clay-light text-forest/60">
                        {m.type}
                      </span>
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-stone group-hover:text-sage group-hover:translate-x-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100 shrink-0"
                    strokeWidth={1.5}
                  />
                </Link>
              );
            })}
            {recentMembers.length === 0 && (
              <div className="text-center py-10 text-forest/40 flex flex-col items-center justify-center gap-2">
                <Users className="w-8 h-8" strokeWidth={1.5} />
                <p className="text-sm">No members registered yet</p>
              </div>
            )}
          </div>
          <div className="px-5 md:px-6 py-3 border-t border-stone/60 bg-clay-light/20">
            <Link
              href="/admin/members/new"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sage hover:text-sage-dark transition-all duration-200 hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50 rounded-md"
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} />
              Add New Member
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-clay-light rounded-2xl border border-stone/60 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md">
          <div className="px-5 md:px-6 py-4 border-b border-stone/60">
            <h2 className="text-xs font-semibold text-forest uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
              Quick Actions
            </h2>
          </div>
          <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <Link
              href="/admin/members/new"
              className="flex flex-col justify-between p-4 rounded-xl border border-stone/60 transition-all duration-200 hover:border-sage/50 hover:bg-sage-light/15 active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
            >
              <div className="w-10 h-10 rounded-xl bg-clay-light flex items-center justify-center text-sage mb-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <UserPlus className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-forest">
                  New Member
                </h3>
                <p className="text-xs text-forest/50 mt-0.5 leading-normal">
                  Register a member under a team and year
                </p>
              </div>
            </Link>

            <Link
              href="/admin/events/new"
              className="flex flex-col justify-between p-4 rounded-xl border border-stone/60 transition-all duration-200 hover:border-terracotta/40 hover:bg-terracotta/5 active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
            >
              <div className="w-10 h-10 rounded-xl bg-clay-light flex items-center justify-center text-terracotta mb-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Calendar className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-forest">New Event</h3>
                <p className="text-xs text-forest/50 mt-0.5 leading-normal">
                  Publish workshops, contests, or seminars
                </p>
              </div>
            </Link>

            <Link
              href="/admin/teams"
              className="flex flex-col justify-between p-4 rounded-xl border border-stone/60 transition-all duration-200 hover:border-forest/30 hover:bg-forest/[0.03] active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
            >
              <div className="w-10 h-10 rounded-xl bg-clay-light flex items-center justify-center text-forest mb-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Layers className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-forest">
                  Manage Teams
                </h3>
                <p className="text-xs text-forest/50 mt-0.5 leading-normal">
                  Configure team tiers for academic years
                </p>
              </div>
            </Link>

            <Link
              href="/admin/members"
              className="flex flex-col justify-between p-4 rounded-xl border border-stone/60 transition-all duration-200 hover:border-sage/40 hover:bg-sage-light/15 active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
            >
              <div className="w-10 h-10 rounded-xl bg-clay-light flex items-center justify-center text-sage mb-3 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Users className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-forest">
                  Browse Registry
                </h3>
                <p className="text-xs text-forest/50 mt-0.5 leading-normal">
                  Search, filter, edit, or delete members
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
