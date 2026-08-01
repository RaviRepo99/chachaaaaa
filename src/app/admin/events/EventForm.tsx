'use client';

import {ImageIcon, Images, Loader2, Upload, X} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
import AdminAlert from '@/components/admin/AdminAlert';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminUploadProgress, {
  type UploadProgressStepId,
} from '@/components/admin/AdminUploadProgress';
import MediaImage from '@/components/MediaImage';
import {useLocalImagePreview} from '@/lib/use-local-image-preview';
import {uploadAdminMedia} from '@/lib/admin-media-upload';
import {
  adminInputClass,
  adminLabelClass,
  adminSectionClass,
  adminSectionTitleClass,
} from '@/lib/admin-form-styles';
import {DEFAULT_ACADEMIC_YEAR, resolveAcademicYear} from '@/lib/years';
import type {Event} from '@/types';

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

interface Props {
  event?: Event;
}

export default function EventForm({event}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadProgressStepId | null>(
      null,
  );
  const [uploadFileName, setUploadFileName] = useState('');
  const {localPreview, setFromFile, revoke: revokePreview} = useLocalImagePreview();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || '');
  const [time, setTime] = useState(event?.time || '');
  const [location, setLocation] = useState(event?.location || '');
  const [description, setDescription] = useState(event?.description || '');
  const [image, setImage] = useState(event?.image || '');
  const [status, setStatus] = useState<Event['status']>(
      event?.status || 'upcoming',
  );
  const [registrationLink, setRegistrationLink] = useState(
      event?.registrationLink || '',
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(event?.tags || []);
  const [gallery, setGallery] = useState<string[]>(event?.gallery || []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [academicYear, setAcademicYear] = useState(
      event?.academicYear ?? DEFAULT_ACADEMIC_YEAR,
  );

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Image must be 12 MB or smaller.');
      return;
    }

    setFromFile(file);
    setUploadFileName(file.name);
    setUploadStep('selected');
    setUploading(true);

    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    try {
      setUploadStep('compress');
      const {compressImageToAvif} = await import('@/utils/imageCompressor');
      const {blob, fileName: compressedName} = await compressImageToAvif(
          file,
          {
            maxWidth: 1200,
            quality: 75,
          },
      );

      setUploadStep('upload');
      const {url, format} = await uploadAdminMedia(
          blob,
          compressedName,
          'events',
      );
      setImage(url);
      revokePreview();
      setUploadStep('done');
      const formatLabel = format === 'avif' ? 'AVIF' : format.toUpperCase();
      setUploadSuccess(
          format === 'avif' ?
            'Cover image converted to AVIF and uploaded. You can save the event when ready.' :
            `Cover image uploaded as ${formatLabel} (AVIF encoder was unavailable in this browser). Save when ready.`,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to compress or upload image';
      setUploadError(message);
      setUploadStep(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearImage = () => {
    setImage('');
    setUploadSuccess('');
    setUploadError('');
    setUploadStep(null);
    setUploadFileName('');
    revokePreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewSrc = localPreview || image;

  const handleGalleryUpload = async (
      e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryError('');
    setGalleryUploading(true);

    try {
      const {compressImageToAvif} = await import('@/utils/imageCompressor');

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > MAX_UPLOAD_BYTES) {
          setGalleryError(`${file.name} exceeds 12 MB limit, skipped.`);
          continue;
        }

        const {blob, fileName: compressedName} = await compressImageToAvif(
            file,
            {maxWidth: 1200, quality: 75},
        );
        const {url} = await uploadAdminMedia(blob, compressedName, 'events');
        setGallery((prev) => [...prev, url]);
      }
    } catch (err) {
      setGalleryError(
          err instanceof Error ? err.message : 'Failed to upload gallery image',
      );
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setUploadError('');

    if (!image.trim()) {
      setUploadError(
          'A cover image is required. Upload one above before saving.',
      );
      return;
    }

    if (uploading || galleryUploading) {
      setUploadError('Wait for image uploads to finish.');
      return;
    }

    setSaving(true);

    const id = event?.id || `e${Date.now()}`;
    const payload = {
      id,
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      image: image.trim(),
      status,
      registrationLink: registrationLink.trim() || null,
      tags,
      gallery: gallery.length > 0 ? gallery : null,
      academicYear: resolveAcademicYear(academicYear),
    };

    try {
      const url = event ? `/api/events/${event.id}` : '/api/events';
      const method = event ? 'PUT' : 'POST';
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
        event ? '/admin/events?flash=saved' : '/admin/events?flash=created',
      );
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={event ? 'Edit event' : 'Create event'}
        description={
          event ?
            'Update details and cover image. Upcoming or Running events show on the public Events page.' :
            'Add a new event. Upload a cover image, then save. Use Upcoming or Running for listings visitors see today.'
        }
        breadcrumbs={[
          {label: 'Dashboard', href: '/admin'},
          {label: 'Events', href: '/admin/events'},
          {label: event ? 'Edit' : 'New'},
        ]}
      />

      {saveError ? (
        <AdminAlert variant="error" title="Could not save" message={saveError} />
      ) : null}

      {uploadError ? (
        <AdminAlert variant="error" title="Image upload" message={uploadError} />
      ) : null}

      {uploadSuccess ? (
        <AdminAlert variant="success" title="Image ready" message={uploadSuccess} />
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-24">
        <section className={adminSectionClass}>
          <h2 className={adminSectionTitleClass}>Cover image *</h2>
          <p className="text-sm text-forest/60 -mt-2">
            Shown on the Events list and event page. Upload JPG or PNG — we
            resize and convert to <strong className="font-medium">AVIF</strong>{' '}
            before storing (smaller files, faster loads).
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <div
              className={`relative w-full sm:w-52 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border ${
                previewSrc ? 'border-stone/60' : 'border-dashed border-stone bg-clay-light/50'
              }`}
            >
              {previewSrc ? (
                localPreview ? (
                  <img
                    src={localPreview}
                    alt="Selected cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MediaImage
                    src={image}
                    alt="Event cover preview"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-forest/40">
                  <ImageIcon className="w-10 h-10" strokeWidth={1.25} />
                  <span className="text-xs font-medium">No image yet</span>
                </div>
              )}
              {uploading && localPreview ? (
                <div className="absolute inset-0 bg-forest/20 backdrop-blur-[1px]" />
              ) : null}
            </div>

            <div className="flex flex-col gap-3 min-w-0 flex-1">
              <AdminUploadProgress
                activeStep={uploadStep}
                fileName={uploadFileName}
              />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone/60 bg-white dark:bg-clay-light text-sm font-medium text-forest cursor-pointer hover:border-sage transition-colors">
                  <Upload className="w-4 h-4 text-sage" />
                  {uploading ? 'Uploading…' : image ? 'Replace image' : 'Upload image'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || saving}
                    className="hidden"
                  />
                </label>
                {previewSrc ? (
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={uploading || saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone/60 text-sm font-medium text-forest/70 hover:text-terracotta hover:border-terracotta/40 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-forest/50 leading-relaxed">
                Max 12 MB. Best size about 1200×630 px for social previews.
              </p>
            </div>
          </div>
        </section>

        <section className={adminSectionClass}>
          <h2 className={adminSectionTitleClass}>Event details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={adminLabelClass}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. IoT Workshop"
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Time *</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                placeholder="e.g. 11:00 AM – 1:00 PM"
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. NCIT Hall"
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Event['status'])}
                className={adminInputClass}
              >
                <option value="upcoming">Upcoming — shown as active</option>
                <option value="running">Running — shown as active</option>
                <option value="past">Past — archive only</option>
              </select>
            </div>
            <div>
              <label className={adminLabelClass}>Academic year *</label>
              <input
                type="number"
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                required
                min={2020}
                max={2100}
                className={adminInputClass}
              />
              <p className="text-xs text-forest/50 mt-1.5">
                Used to group events on the public site (e.g. {DEFAULT_ACADEMIC_YEAR}).
              </p>
            </div>
            <div className="md:col-span-2">
              <label className={adminLabelClass}>Registration link</label>
              <input
                type="url"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                placeholder="https://luma.com/zl9t5emj or https://…"
                className={adminInputClass}
              />
              <p className="text-xs text-forest/50 mt-1.5">
                Registration links open in a new browser tab.
              </p>
            </div>
          </div>
        </section>

        <section className={adminSectionClass}>
          <h2 className={adminSectionTitleClass}>Description *</h2>
          <p className="text-sm text-forest/60 -mt-2">
            Markdown supported — headings, lists, and links render on the public
            event page.
          </p>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={14}
            placeholder="## About this event&#10;&#10;Write the full description here…"
            className={`${adminInputClass} font-mono text-sm leading-relaxed`}
          />

          {description.trim() ? (
            <div className="p-4 rounded-xl bg-clay-light/60 border border-stone/40 max-h-40 overflow-y-auto">
              <p className="text-xs font-semibold text-forest/50 uppercase tracking-wider mb-2">
                Preview (plain text)
              </p>
              <p className="text-sm text-forest/70 whitespace-pre-wrap">
                {description.slice(0, 400)}
                {description.length > 400 ? '…' : ''}
              </p>
            </div>
          ) : null}
        </section>

        <section className={adminSectionClass}>
          <h2 className={adminSectionTitleClass}>Tags</h2>
          <p className="text-sm text-forest/60 -mt-2">
            Optional labels such as Workshop or Competition.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Type a tag and press Enter"
              className={`${adminInputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 rounded-xl border border-stone/60 bg-clay-light/80 text-sm font-medium text-forest hover:bg-clay-light transition-colors shrink-0"
            >
              Add tag
            </button>
          </div>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-light/80 text-forest text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-terracotta transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className={adminSectionClass}>
          <h2 className={adminSectionTitleClass}>Gallery images</h2>
          <p className="text-sm text-forest/60 -mt-2">
            Optional photos shown on the event detail page. You can upload
            multiple at once.
          </p>

          {galleryError ? (
            <AdminAlert variant="error" title="Gallery upload" message={galleryError} />
          ) : null}

          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-stone/60"
                >
                  <MediaImage
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    disabled={saving}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label={`Remove gallery image ${index + 1}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone/60 bg-white dark:bg-clay-light text-sm font-medium text-forest cursor-pointer hover:border-sage transition-colors">
              <Images className="w-4 h-4 text-sage" />
              {galleryUploading ? 'Uploading…' : 'Add gallery images'}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={galleryUploading || saving}
                className="hidden"
              />
            </label>
            {gallery.length > 0 ? (
              <span className="self-center text-xs text-forest/50">
                {gallery.length} image{gallery.length !== 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
        </section>

        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-4 md:-mx-8 md:px-8 bg-alabaster/95 border-t border-stone/40 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3 max-w-3xl">
            <button
              type="submit"
              disabled={saving || uploading || galleryUploading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest hover:bg-forest/90 dark:bg-ccrcit-blue dark:hover:bg-citc-blue/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : event ? (
                'Save changes'
              ) : (
                'Create event'
              )}
            </button>
            <Link
              href="/admin/events"
              className="px-6 py-3 text-sm font-semibold text-forest/70 hover:text-forest transition-colors"
            >
              Cancel
            </Link>
            {!image && !event ? (
              <span className="text-xs text-forest/50 w-full sm:w-auto">
                Upload a cover image to enable saving.
              </span>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
