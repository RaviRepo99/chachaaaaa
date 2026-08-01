'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {motion} from 'framer-motion';
import MemberCard from '@/components/MemberCard';
import MemberProfileModal from '@/components/MemberProfileModal';
import TeamYearPicker from '@/components/TeamYearPicker';
import {
  findMemberByYearAndSlug,
  memberSlugFromName,
} from '@/lib/member-slug';
import {sortYearsDesc} from '@/lib/years';
import {
  sortMembersBySeniorityAndName,
  sortTeamsForDisplay,
} from '@/lib/team-order';
import type {Member, Team, TeamData} from '@/types';

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.08},
  },
};

interface TeamClientProps {
  teamData: TeamData;
  initialYear?: number;
  initialMemberSlug?: string | null;
}

export default function TeamClient({
  teamData,
  initialYear,
  initialMemberSlug,
}: TeamClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberSlugFromUrl =
    searchParams.get('member') ?? initialMemberSlug ?? null;

  const years = useMemo(
      () => sortYearsDesc(teamData.members.map((m) => m.memberYear)),
      [teamData.members],
  );

  const latestYear = years[0] ?? new Date().getFullYear();
  const [activeYear, setActiveYear] = useState<number>(
    initialYear && years.includes(initialYear) ? initialYear : latestYear,
  );
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teamById = useMemo(() => {
    const map = new Map<string, Team>();
    for (const t of teamData.teams) map.set(t.id, t);
    return map;
  }, [teamData.teams]);

  const resolveMember = useCallback(
      (year: number, slug: string) => {
        const member = findMemberByYearAndSlug(teamData.members, year, slug);
        if (!member) return null;
        return {member, team: teamById.get(member.teamId) ?? null};
      },
      [teamData.members, teamById],
  );

  const openMember = useCallback(
      (member: Member) => {
        const team = teamById.get(member.teamId) ?? null;
        setSelectedMember(member);
        setSelectedTeam(team);
        if (member.memberYear !== activeYear) {
          setActiveYear(member.memberYear);
        }
        const slug = memberSlugFromName(member.name);
        router.replace(`/team/${member.memberYear}?member=${slug}`, {
          scroll: false,
        });
      },
      [activeYear, router, teamById],
  );

  const closeMember = useCallback(() => {
    setSelectedMember(null);
    setSelectedTeam(null);
    router.replace(`/team/${activeYear}`, {scroll: false});
  }, [activeYear, router]);

  useEffect(() => {
    if (!memberSlugFromUrl) {
      setSelectedMember(null);
      setSelectedTeam(null);
      return;
    }

    const year =
      initialYear && years.includes(initialYear) ? initialYear : activeYear;
    const resolved = resolveMember(year, memberSlugFromUrl);
    if (resolved) {
      setSelectedMember(resolved.member);
      setSelectedTeam(resolved.team);
      if (resolved.member.memberYear !== activeYear) {
        setActiveYear(resolved.member.memberYear);
      }
    }
  }, [memberSlugFromUrl, initialYear, activeYear, years, resolveMember]);

  const handleYearChange = (year: number) => {
    setActiveYear(year);
    setSelectedMember(null);
    setSelectedTeam(null);
    router.push(`/team/${year}`, {scroll: false});
  };

  const filteredMembers = teamData.members.filter(
      (m) => m.memberYear === activeYear,
  );

  const displayTeams = sortTeamsForDisplay(
      teamData.teams.filter(
          (t) =>
            t.year === activeYear &&
          (t.id.startsWith('t_patron') || t.id.startsWith('t_exec')),
      ),
  );

  const getTeamMembers = (teamId: string) => {
    const members = filteredMembers.filter((m) => m.teamId === teamId);
    if (teamId.startsWith('t_exec') || teamId.includes('mentor')) {
      return sortMembersBySeniorityAndName(members);
    }
    return [...members].sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="min-h-screen pt-40 pb-20 bg-white dark:bg-citc-navy transition-colors duration-300">
      <MemberProfileModal
        member={selectedMember}
        team={selectedTeam}
        open={selectedMember !== null}
        onClose={closeMember}
      />

      <div className="site-container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-citc-navy dark:text-white mb-4">
            Meet the Team
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Meet the people who run IT CLUB at CCRC. Tap a member for details.
          </p>
        </div>

        <div id="team-roster" className="space-y-24 scroll-mt-32">
          {displayTeams.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-12">
              No team roster found for academic year {activeYear}.
            </p>
          ) : (
            displayTeams.map((team) => {
              const teamMembers = getTeamMembers(team.id);
              if (teamMembers.length === 0) return null;

              const isSmallTeam = teamMembers.length <= 3;
              const titleText =
                team.id.startsWith('t_patron') ?
                  'Patron' :
                  'Board of Directors';

              return (
                <section key={team.id} id={team.id} className="scroll-mt-32">
                  <div className="mb-12 text-center">
                    <h2
                      className={`${
                        titleText === 'Board of Directors' ?
                          'text-2xl md:text-3xl font-semibold tracking-tight text-citc-navy dark:text-white' :
                          'text-2xl md:text-3xl font-bold text-citc-navy dark:text-white'
                      }`}
                    >
                      {titleText}
                    </h2>
                  </div>

                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, margin: '-50px'}}
                    className={`grid gap-5 ${
                      isSmallTeam ?
                        'grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-w-[1240px] mx-auto' :
                        'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
                    }`}
                  >
                    {teamMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        priority={team.id === 't_patron'}
                        onSelect={() => openMember(member)}
                      />
                    ))}
                  </motion.div>
                </section>
              );
            })
          )}
        </div>

        <TeamYearPicker
          members={teamData.members}
          activeYear={activeYear}
          onSelectYear={handleYearChange}
        />
      </div>
    </div>
  );
}
