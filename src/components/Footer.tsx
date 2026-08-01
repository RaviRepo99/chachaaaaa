import {Mail, MapPin} from 'lucide-react';
import {Github, Linkedin, Facebook, Instagram} from '@/components/Icons';
import Link from 'next/link';
import {SITE_CONFIG} from '@/lib/site-config';

const socialIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
};

const navLinks = [
  {name: 'Home', path: '/'},
  {name: 'Events', path: '/events'},
  {name: 'Our Team', path: '/team'},
  {name: 'Join Club', path: '/join'},
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-10 dark:border-white/5 dark:bg-citc-navy sm:pt-16 sm:pb-12">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-block">
              <img
                src="/ccrc_it_logo.jpg"
                alt={SITE_CONFIG.name}
                width={480}
                height={209}
                className="h-20 w-auto sm:h-24 dark:hidden"
              />
              <img
                src="/ccrc_it_logo.jpg"
                alt={SITE_CONFIG.name}
                width={480}
                height={209}
                className="h-20 w-auto sm:h-24 hidden dark:block"
              />
            </Link>
            <p className="text-sm font-semibold text-[var(--color-citc-blue)]">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {Object.entries(SITE_CONFIG.social).map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-transparent text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-[var(--color-citc-blue)] dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-[var(--color-citc-blue)]"
                    aria-label={platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-citc-navy dark:text-white mb-4">
              Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-[var(--color-citc-blue)] transition-colors flex items-center min-h-11 sm:min-h-0"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-citc-navy dark:text-white mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-citc-blue-muted)] dark:bg-citc-blue/20 flex items-center justify-center shrink-0 border border-black/10">
                  <Mail className="w-4 h-4 text-[var(--color-citc-blue)]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </span>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm sm:text-base text-slate-700 dark:text-slate-200 hover:text-[var(--color-citc-blue)] transition-colors font-medium break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-citc-blue-muted)] dark:bg-citc-blue/20 flex items-center justify-center shrink-0 border border-black/10">
                  <MapPin className="w-4 h-4 text-[var(--color-citc-blue)]" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-snug">
                    CCRC, Balkumari, Lalitpur, Nepal
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-white/5">
          <div className="flex flex-col items-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-relaxed text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. {SITE_CONFIG.tagline}
            </p>
            <div className="flex items-center justify-center sm:justify-end">
              <Link href="https://ccrc.edu.np/" target="_blank" rel="noopener noreferrer">
                <img src="/CCRCLogo.webp" alt="CCRC Logo" className="h-12 w-auto object-contain" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
