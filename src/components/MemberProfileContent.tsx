import {Mail, Globe} from 'lucide-react';
import {Github, Linkedin, Instagram, Facebook} from '@/components/Icons';
import MediaImage from '@/components/MediaImage';
import {getMemberPhotoUrl} from '@/lib/media';
import type {Member, Team} from '@/types';

function normalizeSocialUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

interface MemberProfileContentProps {
  member: Member;
  team: Team | null;
}

export default function MemberProfileContent({
  member,
  team,
}: MemberProfileContentProps) {
  const photoUrl = getMemberPhotoUrl(member);
  const roleLine =
    member.type ||
    member.title ||
    member.department ||
    (member.collegeYear ?
      `Year ${member.collegeYear}` :
      'Member');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8 items-start">
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md bg-slate-100 dark:bg-slate-800 aspect-[3/4] max-w-xs mx-auto sm:mx-0 w-full">
        {photoUrl ? (
          <MediaImage
            src={photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No photo
          </div>
        )}
      </div>

      <div className="space-y-5 min-w-0">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-citc-blue)] mb-1.5">
            {team?.name === 'Executive Committee' ? 'Board of Directors' : team?.name ?? 'CITC'} · {member.memberYear}
          </p>
          <h2
            id="member-profile-title"
            className="text-2xl md:text-3xl font-bold text-citc-navy dark:text-white"
          >
            {member.name}
          </h2>
          <p className="mt-1.5 text-base text-slate-600 dark:text-slate-400">
            {roleLine}
          </p>
        </header>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-citc-blue)] text-white text-sm font-semibold hover:bg-[var(--color-citc-blue)]/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          {member.socials?.website && (
            <a
              href={normalizeSocialUrl(member.socials.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-[var(--color-citc-blue)] transition-colors"
            >
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
        </div>

        {(member.socials?.github ||
          member.socials?.linkedin ||
          member.socials?.instagram ||
          member.socials?.facebook) && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Connect
            </p>
            <div className="flex flex-wrap gap-2.5">
              {member.socials.github && (
                <a
                  href={normalizeSocialUrl(member.socials.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[var(--color-citc-blue)] text-slate-700 dark:text-slate-200 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {member.socials.linkedin && (
                <a
                  href={normalizeSocialUrl(member.socials.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[var(--color-citc-blue)] text-slate-700 dark:text-slate-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {member.socials.instagram && (
                <a
                  href={normalizeSocialUrl(member.socials.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[var(--color-citc-blue)] text-slate-700 dark:text-slate-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {member.socials.facebook && (
                <a
                  href={normalizeSocialUrl(member.socials.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[var(--color-citc-blue)] text-slate-700 dark:text-slate-200 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
