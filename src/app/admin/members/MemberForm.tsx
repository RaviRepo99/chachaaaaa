'use client';

import {Upload} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
import AdminAlert from '@/components/admin/AdminAlert';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminUploadProgress, {
  MEMBER_UPLOAD_STEPS,
  type UploadProgressStepId,
} from '@/components/admin/AdminUploadProgress';
import {uploadAdminMedia} from '@/lib/admin-media-upload';
import {sortTeamsForDisplay} from '@/lib/team-order';
import {useLocalImagePreview} from '@/lib/use-local-image-preview';
import type {Member, Team} from '@/types';

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ACTIVE_TEAM_ID_PREFIXES = ['t_patron', 't_exec'];

interface Props {
  teams: Team[];
  member?: Member;
}

export default function MemberForm({teams, member}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadProgressStepId | null>(
      null,
  );
  const [uploadFileName, setUploadFileName] = useState('');
  const {localPreview, setFromFile, revoke: revokePreview} = useLocalImagePreview();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(member?.name || '');
  const [type, setType] = useState(member?.type || 'President');
  const [department, setDepartment] = useState(member?.department || '');
  const [email, setEmail] = useState(member?.email || '');
  const [photo, setPhoto] = useState(member?.photo || '');
  const [photoThumb, setPhotoThumb] = useState(member?.photoThumb || '');
  const [photoVersion, setPhotoVersion] = useState(member?.photoVersion ?? 0);
  const [memberYear, setMemberYear] = useState(
      member?.memberYear || new Date().getFullYear(),
  );
  const [teamId, setTeamId] = useState(member?.teamId || '');
  const [github, setGithub] = useState(member?.socials?.github || '');
  const [linkedin, setLinkedin] = useState(member?.socials?.linkedin || '');
  const [instagram, setInstagram] = useState(member?.socials?.instagram || '');
  const [facebook, setFacebook] = useState(member?.socials?.facebook || '');
  const [twitter, setTwitter] = useState(member?.socials?.twitter || '');
  const [website, setWebsite] = useState(member?.socials?.website || '');

  const filteredTeams = sortTeamsForDisplay(
      teams.filter(
          (t) =>
            t.year === memberYear &&
          ACTIVE_TEAM_ID_PREFIXES.some((prefix) => t.id.startsWith(prefix)),
      ),
  );

  const getTeamDisplayName = (team: Team) => {
    if (team.name === 'Executive Committee') return 'Board of Directors';
    return team.name;
  };

  const handleYearChange = (year: number) => {
    setMemberYear(year);
    const validTeams = sortTeamsForDisplay(
        teams.filter(
            (t) =>
              t.year === year &&
            ACTIVE_TEAM_ID_PREFIXES.some((prefix) => t.id.startsWith(prefix)),
        ),
    );
    if (!validTeams.some((t) => t.id === teamId)) {
      setTeamId('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Image must be 12 MB or smaller.');
      return;
    }

    setError('');
    setFromFile(file);
    setUploadFileName(file.name);
    setUploadStep('selected');
    setUploading(true);

    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    try {
      setUploadStep('compress');
      const {compressImageToAvif, generateThumbnail} = await import(
          '@/utils/imageCompressor'
      );

      const [
        {blob: mainBlob, fileName: mainName},
        {blob: thumbBlob, fileName: thumbName},
      ] = await Promise.all([
        compressImageToAvif(file, {maxWidth: 500, quality: 75}),
        generateThumbnail(file, {size: 64, quality: 60}),
      ]);

      setUploadStep('upload');
      const [{url: mainUrl}, {url: thumbUrl}] = await Promise.all([
        uploadAdminMedia(mainBlob, mainName, 'members'),
        uploadAdminMedia(thumbBlob, thumbName, 'members'),
      ]);

      setPhoto(mainUrl);
      setPhotoThumb(thumbUrl);
      setPhotoVersion((v) => v + 1);
      revokePreview();
      setUploadStep('done');
    } catch (err) {
      setError(
          err instanceof Error ? err.message : 'Failed to compress or upload photo',
      );
      setUploadStep(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearPhoto = () => {
    setPhoto('');
    setPhotoThumb('');
    setUploadStep(null);
    setUploadFileName('');
    revokePreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const photoPreview = localPreview || photo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (photo && !photoThumb) {
      setError(
          'Upload the photo again so a small list thumbnail can be generated.',
      );
      return;
    }

    setSaving(true);

    const cleanSocials: Record<string, string> = {};
    if (github) cleanSocials.github = github;
    if (linkedin) cleanSocials.linkedin = linkedin;
    if (instagram) cleanSocials.instagram = instagram;
    if (facebook) cleanSocials.facebook = facebook;
    if (twitter) cleanSocials.twitter = twitter;
    if (website) cleanSocials.website = website;

    const payload = {
      name,
      type,
      title: null,
      department: department || null,
      email,
      photo: photo || null,
      photoThumb: photoThumb || null,
      photoVersion,
      memberYear,
      teamId,
      collegeYear: null,
      socials: Object.keys(cleanSocials).length > 0 ? cleanSocials : null,
    };

    try {
      const url = member ? `/api/members/${member.id}` : '/api/members';
      const method = member ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      router.push(
        member ? '/admin/members?flash=saved' : '/admin/members?flash=created',
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={member ? 'Edit member' : 'Add member'}
        description={
          member ?
            'Update profile, team, and photo. Changes appear on the public team page.' :
            'Add a member to a team for the selected academic year.'
        }
        breadcrumbs={[
          {label: 'Dashboard', href: '/admin'},
          {label: 'Members', href: '/admin/members'},
          {label: member ? 'Edit' : 'New'},
        ]}
      />

      {error ? (
        <AdminAlert variant="error" title="Could not save" message={error} />
      ) : null}

      {filteredTeams.length === 0 ? (
        <AdminAlert
          variant="info"
          title="Create teams first"
          message={`No teams exist for ${memberYear}. Go to Teams and add Patron and Board of Directors groups for this year before adding members.`}
          dismissible={false}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Chief Innovation Director">Chief Innovation Director</option>
                <option value="Secretary">Secretary</option>
                <option value="Program Incharge">Program Incharge</option>
                <option value="Executive Head">Executive Head</option>
                <option value="IT Head">IT Head</option>
                <option value="Content Creator">Content Creator</option>
                <option value="Advisor">Advisor</option>
                <option value="Sponsorship Director">Sponsorship Director</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Patron">Patron</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
            Membership Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Team *
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select team</option>
                {filteredTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {getTeamDisplayName(team)}
                  </option>
                ))}
              </select>
              {filteredTeams.length === 0 && (
                <p className="text-xs text-red-500 mt-1.5">
                  No teams configured for year {memberYear}. Please add teams
                  for this year first.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Member Year *
              </label>
              <input
                type="number"
                value={memberYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
            Photo
          </h2>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative w-28 h-36 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              {uploading && localPreview ? (
                <div className="absolute inset-0 bg-slate-900/15" />
              ) : null}
            </div>
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <AdminUploadProgress
                activeStep={uploadStep}
                fileName={uploadFileName}
                steps={MEMBER_UPLOAD_STEPS}
              />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:border-cyan-500 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Processing…' : photo ? 'Replace photo' : 'Upload photo'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || saving}
                    className="hidden"
                  />
                </label>
                {photoPreview ? (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    disabled={uploading || saving}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommended portrait 400×500 px. Converts to AVIF automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
            Social Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub Username
              </label>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                <span className="px-3 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800 py-2.5 border-r border-slate-300 dark:border-slate-700">
                  gh/
                </span>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="username"
                  className="flex-1 px-3 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Personal Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : member ? 'Update Member' : 'Create Member'}
          </button>
          <Link
            href="/admin/members"
            className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
