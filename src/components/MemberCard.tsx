'use client';

import {memo, useEffect, useState} from 'react';
import {Mail, User, Globe} from 'lucide-react';
import Image from 'next/image';
import {Github, Linkedin, Instagram} from '@/components/Icons';
import {motion} from 'framer-motion';
import {getMemberPhotoUrl} from '@/lib/media';
import type {Member} from '@/types';

interface MemberCardProps {
  member: Member;
  priority?: boolean;
  onSelect: () => void;
}

const cardItemVariants = {
  hidden: {y: 40, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {type: 'spring' as const, stiffness: 80, damping: 16},
  },
};

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  priority = false,
  onSelect,
}) => {
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'error'>(
      'loading',
  );

  const photoUrl = getMemberPhotoUrl(member);

  useEffect(() => {
    setImageState(photoUrl ? 'loading' : 'error');
  }, [photoUrl]);

  const showPhoto = photoUrl && imageState !== 'error';

  return (
    <motion.button
      type="button"
      id={`member-${member.id}`}
      variants={cardItemVariants}
      onClick={onSelect}
      className="group relative mx-auto w-full max-w-[300px] scroll-mt-32 overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white text-left shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citc-blue focus-visible:ring-offset-2 dark:border-white/10 dark:bg-slate-900/80"
      aria-label={`View profile for ${member.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {showPhoto ? (
          <>
            {imageState === 'loading' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <div className="w-12 h-12 border-4 border-citc-blue/30 border-t-citc-blue rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={photoUrl}
              alt={member.name}
              fill
              unoptimized
              onLoadingComplete={() => setImageState('ready')}
              onError={() => setImageState('error')}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
            <User className="w-24 h-24 text-slate-400 dark:text-slate-500" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="rounded-full border border-white/25 bg-white/15 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-citc-blue"
              title="Email"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {member.socials?.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 bg-white/15 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-slate-800"
              title="GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 bg-white/15 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#0077b5]"
              title="LinkedIn"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.socials?.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 bg-white/15 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-600 hover:to-orange-500"
              title="Instagram"
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
          {member.socials?.website && (
            <a
              href={member.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 bg-white/15 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500"
              title="Website"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white">
          <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
            {member.type || 'Member'}
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">
            {member.name}
          </h3>
          <p className="text-xs leading-5 text-slate-200">
            {member.title ||
              (member.department ?
                member.department :
                `${member.collegeYear ? `Year ${member.collegeYear}` : ''} ${member.type}`.trim())}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/80 bg-white/90 px-5 py-3.5 dark:border-white/10 dark:bg-slate-900/70">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Tap to view profile
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700 transition-all duration-300 group-hover:border-citc-blue group-hover:bg-citc-blue/10 group-hover:text-citc-blue dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
          →
        </span>
      </div>
    </motion.button>
  );
};

export default memo(MemberCard);
