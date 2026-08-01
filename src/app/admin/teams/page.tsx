import {count, desc} from 'drizzle-orm';
import {db} from '@/db';
import {members, teams} from '@/db/schema';
import TeamsManager from '@/app/admin/teams/TeamsManager';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {sortYearsDesc} from '@/lib/years';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const allTeams = await db.select().from(teams).orderBy(desc(teams.year));
  const memberCounts = await db
      .select({teamId: members.teamId, count: count()})
      .from(members)
      .groupBy(members.teamId);

  const countMap = new Map(memberCounts.map((c) => [c.teamId, c.count]));
  const years = sortYearsDesc(allTeams.map((t) => t.year));

  return (
    <div>
      <AdminPageHeader
        title="Teams"
        description="Start here each academic year: create Patron and Board of Directors teams before adding members."
        breadcrumbs={[
          {label: 'Dashboard', href: '/admin'},
          {label: 'Teams'},
        ]}
      />

      <TeamsManager teams={allTeams} countMap={countMap} years={years} />
    </div>
  );
}
