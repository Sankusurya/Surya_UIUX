import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { uploadImageToStorage, formatBytes, processCaseStudyImage } from '../../utils/imageStorage';
import { normalizeProject } from '../../data/initialData';
import { Tags } from '../common/Tags';
import { ImageViewer } from '../common/ImageViewer';

export const AdminProjectsTab = () => {
  const { projects, saveProjects, showToast } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Upload States
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Clean Project Form State matching public page fields in exact order
  const emptyProject = {
    title: '',
    slug: '',
    year: '2026',
    type: ['UX case study'],
    summary: '',
    role: '',
    timeline: '',
    tools: '',
    prototypeUrl: '',
    caseStudyUrl: '',
    coverImg: '',
    images: [],
  };

  const [formData, setFormData] = useState(emptyProject);
  const [tagInput, setTagInput] = useState('');

  // Sanitize URL helper
  const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleEdit = (rawP) => {
    const p = normalizeProject(rawP);
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      year: p.year || '2026',
      type: Array.isArray(p.type) ? p.type : ['UX case study'],
      summary: p.summary || '',
      role: p.role || '',
      timeline: p.timeline || '',
      tools: p.tools || '',
      prototypeUrl: p.prototypeUrl || '',
      caseStudyUrl: p.caseStudyUrl || '',
      coverImg: p.coverImg || '',
      images: Array.isArray(p.images) ? [...p.images] : [],
    });
    setEditingSlug(p.slug);
    setIsEditing(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setFormData(emptyProject);
    setEditingSlug(null);
    setIsEditing(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = projects.filter((p) => p.slug !== slug);
      saveProjects(updated);
      showToast('info', 'Project Deleted', `"${title}" was removed.`);
      if (editingSlug === slug) {
        setIsEditing(false);
        setFormData(emptyProject);
      }
    }
  };

  const handleMoveProject = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    saveProjects(updated);
  };

  // Tag Management
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const tag = tagInput.trim();
    if (!formData.type.includes(tag)) {
      setFormData((prev) => ({ ...prev, type: [...prev.type, tag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type.filter((t) => t !== tag),
    }));
  };

  // Cover Image Upload Handler (100% Original Uncompressed)
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    showToast('info', 'Uploading Cover Artwork...', 'Uploading in 100% original quality without compression.');
    try {
      const result = await uploadImageToStorage(file, 'covers');
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          coverImg: result.url,
          coverImgWidth: result.width || 0,
          coverImgHeight: result.height || 0,
          coverImgSize: file.size,
        }));
        showToast('success', 'Cover Artwork Uploaded ✓', result.sizeInfo);
      } else {
        showToast('error', 'Cover Upload Failed', result.error);
      }
    } catch (err) {
      showToast('error', 'Upload Error', err.message);
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // Multi-Image Upload Handler for Case Study Deliverables (with automatic tall image slicing for phone sharpness)
  const handleMultiImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImages(true);
    setUploadProgress({ current: 0, total: files.length, name: '' });

    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length, name: file.name });
      try {
        const result = await processCaseStudyImage(file, (p) => {
          setUploadProgress({
            current: i + 1,
            total: files.length,
            name: `${file.name} · ${p.step}`,
          });
        });

        if (result.success) {
          newImages.push({
            id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}`,
            url: result.url,
            originalUrl: result.originalUrl || result.url,
            alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            width: result.width || 0,
            height: result.height || 0,
            fileSize: result.fileSize || file.size,
            slices: result.slices || [{ url: result.url, width: result.width, height: result.height, index: 0 }],
            isSliced: result.isSliced || false,
          });
        } else {
          showToast('error', `Failed to upload ${file.name}`, result.error);
        }
      } catch (err) {
        showToast('error', `Error uploading ${file.name}`, err.message);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));

    setIsUploadingImages(false);
    setUploadProgress(null);
    showToast('success', `${newImages.length} case study deliverable(s) uploaded ✓`);
    e.target.value = '';
  };

  // Single Image Replace Handler
  const handleReplaceImage = async (index, file) => {
    if (!file) return;
    showToast('info', 'Replacing Visual...', 'Processing and uploading in 100% full original quality.');
    try {
      const result = await processCaseStudyImage(file);
      if (result.success) {
        const updatedImages = [...formData.images];
        updatedImages[index] = {
          ...updatedImages[index],
          url: result.url,
          originalUrl: result.originalUrl || result.url,
          width: result.width || 0,
          height: result.height || 0,
          fileSize: result.fileSize || file.size,
          slices: result.slices || [{ url: result.url, width: result.width, height: result.height, index: 0 }],
          isSliced: result.isSliced || false,
        };
        setFormData((prev) => ({ ...prev, images: updatedImages }));
        showToast('success', 'Image Replaced ✓', result.sizeInfo);
      } else {
        showToast('error', 'Replace Failed', result.error);
      }
    } catch (err) {
      showToast('error', 'Upload Error', err.message);
    }
  };

  // Case Study Image List Manipulation
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMoveImage = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= formData.images.length) return;
    const nextImages = [...formData.images];
    const [moved] = nextImages.splice(index, 1);
    nextImages.splice(target, 0, moved);
    setFormData((prev) => ({ ...prev, images: nextImages }));
  };

  const handleUpdateImageAlt = (index, alt) => {
    const nextImages = [...formData.images];
    nextImages[index] = { ...nextImages[index], alt };
    setFormData((prev) => ({ ...prev, images: nextImages }));
  };

  // Drag and drop reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const nextImages = [...formData.images];
    const [draggedItem] = nextImages.splice(draggedIndex, 1);
    nextImages.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setFormData((prev) => ({ ...prev, images: nextImages }));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Save Project Handler (Instant Real-Time Persistence)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('error', 'Missing Title', 'Please enter a project title.');
      return;
    }

    const slug = formData.slug.trim() || generateSlug(formData.title);
    const existing = (isEditing && editingSlug)
      ? (projects.find((p) => p.slug === editingSlug) || {})
      : {};

    const cleanCover = typeof formData.coverImg === 'string'
      ? formData.coverImg.trim()
      : (formData.coverImg?.url || '');

    const newProject = {
      ...existing,
      slug,
      title: formData.title.trim(),
      year: formData.year.trim() || '2026',
      type: formData.type.length > 0 ? formData.type : ['UX case study'],
      summary: formData.summary.trim(),
      role: formData.role.trim(),
      timeline: formData.timeline.trim(),
      tools: formData.tools.trim(),
      prototypeUrl: sanitizeUrl(formData.prototypeUrl),
      caseStudyUrl: sanitizeUrl(formData.caseStudyUrl),
      coverImg: cleanCover,
      images: Array.isArray(formData.images) ? formData.images : [],
    };

    let updatedProjects;
    if (isEditing && editingSlug) {
      updatedProjects = projects.map((p) => (p.slug === editingSlug ? newProject : p));
    } else {
      updatedProjects = [newProject, ...projects];
    }

    await saveProjects(updatedProjects);
    setIsEditing(false);
    setEditingSlug(null);
    setFormData(emptyProject);
  };

  return (
    <div className="space-y-10">
      {/* 1. Existing Projects List */}
      <div className="bg-sheet border border-line rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-line flex-wrap gap-3">
          <div>
            <h3 className="text-xl font-bold font-display uppercase tracking-wider text-ink">
              Live Projects ({projects.length})
            </h3>
            <p className="text-xs text-ink-3 mt-0.5">
              Reorder, edit, or launch the simplified case study builder
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
          >
            <span>+</span>
            <span>New Project</span>
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((rawP, index) => {
            const p = normalizeProject(rawP);
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-line bg-paper/60 hover:bg-paper transition-colors gap-3 flex-wrap sm:flex-nowrap"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-line bg-sheet shrink-0 flex items-center justify-center">
                    {p.coverImg ? (
                      <img src={p.coverImg} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-mono text-signal uppercase">No cover</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-ink truncate">{p.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-ink-3">
                      <span>{p.year}</span>
                      <span>·</span>
                      <span>{(p.images || []).length} case study visuals</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Reorder, Edit, View, Delete */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveProject(index, -1)}
                    className="p-1.5 rounded-lg border border-line bg-sheet text-ink hover:text-signal disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                    title="Move project up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1}
                    onClick={() => handleMoveProject(index, 1)}
                    className="p-1.5 rounded-lg border border-line bg-sheet text-ink hover:text-signal disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                    title="Move project down"
                  >
                    ↓
                  </button>

                  <a
                    href={`#case-${p.slug}`}
                    className="px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs text-ink-2 hover:text-ink hover:border-signal/40 transition-colors"
                  >
                    View ↗
                  </a>

                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-signal/10 text-signal border border-signal/30 hover:bg-signal/20 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.slug, p.title)}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Simplified Project Editor (Identical structure to public page) */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-8 shadow-md animate-in"
        >
          {/* Header */}
          <div className="pb-4 border-b border-line flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="mono text-signal text-xs uppercase tracking-wider block mb-1">
                {editingSlug ? 'Editing Project' : 'New Project'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-ink">
                {formData.title || 'Untitled Project'}
              </h3>
              <p className="text-xs text-ink-3 mt-1">
                Fields appear on the public case study page in this exact order.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2 rounded-full border border-line bg-paper text-ink hover:text-signal text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>👁</span>
                <span>Preview Page</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 rounded-full border border-line text-xs font-medium text-ink-3 hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* 1. Project Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
              1. Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  slug: prev.slug || generateSlug(title),
                }));
              }}
              placeholder="e.g. Designing this portfolio"
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-base font-bold focus:outline-none focus:border-signal"
            />
          </div>

          {/* 2. Tags and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
                2. Category Tags
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. UX case study, Mobile app"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-paper border border-line text-xs font-semibold text-ink hover:text-signal cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                {formData.type.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-paper border border-line text-ink"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2026"
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
          </div>

          {/* 3. Short Project Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
              3. Short Project Description (2–3 sentences)
            </label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="A brief summary of what this project solves and who it is for..."
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm leading-relaxed focus:outline-none focus:border-signal"
            />
          </div>

          {/* 4. Small Row of Facts: My Role, Timeline, Tools */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-2 font-semibold">
              4. Project Facts (Optional — only filled fields appear on page)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-[11px] font-mono text-signal uppercase mb-1">
                  My Role
                </span>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Solo — UX Research, Product Design"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <span className="block text-[11px] font-mono text-signal uppercase mb-1">
                  Timeline
                </span>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g. 4 Weeks · Jan–Feb 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <span className="block text-[11px] font-mono text-signal uppercase mb-1">
                  Tools
                </span>
                <input
                  type="text"
                  value={formData.tools}
                  onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                  placeholder="e.g. Figma, React, CSS Grid"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>
            </div>
          </div>

          {/* 5 & 6. Links: Prototype link & Full case study link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
                5. Prototype Link (Figma, Framer, Live URL)
              </label>
              <input
                type="url"
                value={formData.prototypeUrl}
                onChange={(e) => setFormData({ ...formData, prototypeUrl: e.target.value })}
                placeholder="https://www.figma.com/proto/..."
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
              />
              <span className="text-[10px] text-ink-3 mt-1 block">
                Generates top "View Prototype" button and interactive live embed at the bottom.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
                6. Full Case Study Link (Behance, Notion, optional)
              </label>
              <input
                type="url"
                value={formData.caseStudyUrl}
                onChange={(e) => setFormData({ ...formData, caseStudyUrl: e.target.value })}
                placeholder="https://www.behance.net/gallery/..."
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
              />
              <span className="text-[10px] text-ink-3 mt-1 block">
                Generates top "View on Behance" button.
              </span>
            </div>
          </div>

          {/* 7. Cover Image Upload */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">
              7. Main Cover Image (Full Width, Never Cropped)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingCover}
                  onChange={handleCoverUpload}
                  className="w-full text-xs text-ink-3 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border file:border-line file:bg-paper file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-sheet disabled:opacity-50"
                />
                {isUploadingCover && (
                  <span className="text-[11px] font-mono text-signal mt-1 block animate-pulse">
                    Uploading in 100% original quality...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.coverImg}
                  onChange={(e) => setFormData({ ...formData, coverImg: e.target.value })}
                  placeholder="Or paste image URL directly"
                  className="flex-1 px-3.5 py-1.5 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
                {formData.coverImg && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImg: '' })}
                    className="px-2 py-1 text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Cover Preview */}
            {formData.coverImg && (
              <div className="mt-3 p-3 rounded-xl border border-line bg-paper">
                <span className="text-[10px] font-mono text-ink-3 uppercase block mb-1.5">
                  Cover Preview (Uncropped):
                </span>
                <div className="w-full rounded-lg border border-line bg-sheet overflow-hidden">
                  <img
                    src={formData.coverImg}
                    alt="Cover Preview"
                    className="w-full h-auto block mx-auto"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                {/* Dimensions + size info + warnings */}
                <div className="mt-2.5 space-y-1.5">
                  {formData.coverImgWidth > 0 && (
                    <p className="text-[11px] font-mono text-ink-3">
                      {formData.coverImgWidth} × {formData.coverImgHeight} px
                      {formData.coverImgSize ? ` · ${formatBytes(formData.coverImgSize)}` : ''}
                    </p>
                  )}
                  {formData.coverImgWidth > 0 && formData.coverImgWidth < 1600 && (
                    <p className="text-[11px] font-mono font-semibold text-amber-500 flex items-center gap-1.5">
                      ⚠️ This cover artwork is {formData.coverImgWidth}px wide (narrower than 1,600px) and may look blurry on high-resolution screens. We recommend exporting from Figma at 2× for the sharpest results.
                    </p>
                  )}
                  {formData.coverImgHeight > 0 && (formData.coverImgHeight > formData.coverImgWidth * 1.5 || formData.coverImgHeight > 2000) && (
                    <p className="text-[11px] font-mono text-ink-2 bg-sheet p-2.5 rounded-lg border border-line flex items-start gap-2">
                      <span>💡</span>
                      <span>
                        <strong>Note:</strong> This cover artwork is quite tall ({formData.coverImgWidth} × {formData.coverImgHeight} px). Very tall vertical designs are usually best placed under &apos;Case Study Visuals&apos; so visitors can scroll down to read through them, but it is fully supported as a cover image if you prefer.
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 8. Case Study Images (Multi-upload, drag & reorder, replace, alt text) */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 font-semibold">
                  8. Case Study Visuals ({formData.images.length})
                </label>
                <p className="text-xs text-ink-3 mt-0.5">
                  Upload multiple design slices. They stack continuously at full content width with zero cropping.
                </p>
              </div>

              <label className="px-4 py-2 rounded-full font-semibold text-xs tracking-wider uppercase border border-signal/40 bg-signal/10 text-signal hover:bg-signal/20 transition-all cursor-pointer flex items-center gap-1.5">
                <span>+ Upload Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploadingImages}
                  onChange={handleMultiImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Progress Indicator */}
            {isUploadingImages && uploadProgress && (
              <div className="p-4 rounded-xl bg-signal/10 border border-signal/20 space-y-1.5 text-xs text-signal font-mono animate-in">
                <div className="flex items-center justify-between">
                  <span>
                    Uploading visual {uploadProgress.current} of {uploadProgress.total} in 100% original quality...
                  </span>
                  <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-signal/20 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-signal h-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Case Study Image Previews List */}
            {formData.images.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-line bg-paper/50 text-center space-y-2">
                <span className="text-2xl block">🖼️</span>
                <p className="font-semibold text-sm text-ink">No Case Study Visuals Uploaded</p>
                <p className="text-xs text-ink-3 max-w-sm mx-auto">
                  Export your full-resolution case study sections from Figma (PNG, JPG, SVG, WebP) and upload them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border bg-paper transition-all cursor-move ${
                      draggedIndex === idx ? 'border-signal shadow-lg bg-sheet opacity-80' : 'border-line hover:border-line-hover'
                    }`}
                  >
                    {/* Order badge */}
                    <span className="w-6 h-6 rounded-full bg-sheet border border-line text-[11px] font-mono text-signal font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-line bg-sheet shrink-0 flex items-center justify-center">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>

                    {/* Alt description input + dim info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <input
                        type="text"
                        value={img.alt || ''}
                        onChange={(e) => handleUpdateImageAlt(idx, e.target.value)}
                        placeholder="Description for accessibility / caption"
                        className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                      />
                      {/* Pixel dimensions + file size + slicing status */}
                      {img.width > 0 && (
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-mono text-ink-3">
                              {img.width} × {img.height} px
                              {img.fileSize ? ` · ${formatBytes(img.fileSize)}` : ''}
                            </span>
                            {Array.isArray(img.slices) && img.slices.length > 1 && (
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                ✨ Sliced into {img.slices.length} pieces for mobile sharpness
                              </span>
                            )}
                          </div>
                          {img.width < 1600 && (
                            <p className="text-[11px] font-mono font-semibold text-amber-500 flex items-center gap-1">
                              ⚠️ This image is {img.width}px wide (narrower than 1,600px) and may look blurry. Export from Figma at 2× for sharp results.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Controls: Up, Down, Replace, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveImage(idx, -1)}
                        className="p-1.5 rounded-lg border border-line bg-sheet text-ink hover:text-signal disabled:opacity-20 cursor-pointer text-xs"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.images.length - 1}
                        onClick={() => handleMoveImage(idx, 1)}
                        className="p-1.5 rounded-lg border border-line bg-sheet text-ink hover:text-signal disabled:opacity-20 cursor-pointer text-xs"
                        title="Move Down"
                      >
                        ↓
                      </button>

                      {/* Replace Image */}
                      <label
                        className="p-1.5 rounded-lg border border-line bg-sheet text-ink hover:text-signal cursor-pointer text-xs"
                        title="Replace this visual"
                      >
                        🔄
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleReplaceImage(idx, f);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer text-xs"
                        title="Remove visual"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-line flex items-center justify-between flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-5 py-2.5 rounded-full border border-line bg-paper text-ink hover:text-signal text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>👁</span>
              <span>Preview Live Page</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full border border-line text-xs font-medium text-ink-3 hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer hover:opacity-95 active:scale-[0.99]"
                style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
              >
                {editingSlug ? 'Save Changes ✓' : 'Publish Project ✓'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. Live Full-Fidelity Preview Modal */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-6"
        >
          {/* Top Bar */}
          <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/20 mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-signal font-mono text-xs uppercase tracking-wider font-bold">
                Live Preview
              </span>
              <span className="text-white/60 text-xs">
                (How recruiters and visitors see this case study)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Preview ✕
            </button>
          </div>

          {/* Rendered Preview Page */}
          <div className="max-w-5xl w-full mx-auto bg-paper rounded-2xl border border-line p-6 sm:p-10 shadow-2xl space-y-6">
            <span className="text-xs font-mono text-ink-3 uppercase">← All work</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display uppercase tracking-wider text-ink leading-tight">
              {formData.title || 'Untitled Project'}
            </h1>
            <Tags types={formData.type} year={formData.year} />
            {formData.summary && (
              <p className="text-lg text-ink-2 max-w-3xl leading-relaxed">
                {formData.summary}
              </p>
            )}

            {(formData.role || formData.timeline || formData.tools) && (
              <div className="flex flex-wrap gap-8 py-4 border-y border-line text-sm">
                {formData.role && (
                  <div>
                    <span className="block text-[11px] font-mono text-signal uppercase font-semibold">My Role</span>
                    <span className="font-semibold text-ink">{formData.role}</span>
                  </div>
                )}
                {formData.timeline && (
                  <div>
                    <span className="block text-[11px] font-mono text-signal uppercase font-semibold">Timeline</span>
                    <span className="font-semibold text-ink">{formData.timeline}</span>
                  </div>
                )}
                {formData.tools && (
                  <div>
                    <span className="block text-[11px] font-mono text-signal uppercase font-semibold">Tools</span>
                    <span className="font-semibold text-ink">{formData.tools}</span>
                  </div>
                )}
              </div>
            )}

            {(formData.prototypeUrl || formData.caseStudyUrl) && (
              <div className="flex flex-wrap gap-3">
                {formData.prototypeUrl && (
                  <span className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold text-xs inline-flex items-center gap-1.5">
                    View Prototype ↗
                  </span>
                )}
                {formData.caseStudyUrl && (
                  <span className="px-5 py-2.5 rounded-full border border-line bg-sheet text-ink font-semibold text-xs inline-flex items-center gap-1.5">
                    View on Behance ↗
                  </span>
                )}
              </div>
            )}

            {formData.coverImg && (
              <div className="w-full overflow-hidden rounded-2xl border border-line bg-sheet my-6">
                <img
                  src={formData.coverImg}
                  alt="Cover preview"
                  className="w-full h-auto block m-0 p-0"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {formData.images.length > 0 && (
              <div className="space-y-6 my-8">
                {formData.images.map((img, i) => {
                  const slices = Array.isArray(img.slices) && img.slices.length > 0
                    ? img.slices
                    : [{ url: img.url, width: img.width, height: img.height, index: 0 }];

                  return (
                    <div key={i} className="w-full overflow-hidden rounded-2xl border border-line bg-sheet" style={{ lineHeight: 0 }}>
                      <div className="w-full flex flex-col m-0 p-0" style={{ lineHeight: 0 }}>
                        {slices.map((slice, sIdx) => (
                          <img
                            key={slice.url || sIdx}
                            src={slice.url}
                            alt={img.alt || `Preview visual slice ${sIdx + 1}`}
                            className="w-full h-auto block m-0 p-0 border-0"
                            style={{ width: '100%', height: 'auto', display: 'block', verticalAlign: 'middle', margin: 0, padding: 0 }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsTab;
