import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CaseStudyBlockRenderer } from '../casestudy/CaseStudyBlockRenderer';
import { isTrustedEmbedUrl, getDomainFromUrl } from '../../utils/embedSecurity';
import { uploadImageToStorage } from '../../utils/imageStorage';

export const CaseStudyBlockEditor = ({
  caseStudy = { role: '', timeline: '', team: '', tools: '', blocks: [] },
  onChange,
  projectTitle = ''
}) => {
  const { showToast } = usePortfolio();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const blocks = Array.isArray(caseStudy.blocks) ? caseStudy.blocks : [];

  const updateField = (field, value) => {
    onChange({
      ...caseStudy,
      [field]: value
    });
  };

  const updateBlocks = (newBlocks) => {
    onChange({
      ...caseStudy,
      blocks: newBlocks
    });
  };

  // Add block helpers
  const handleAddBlock = (type) => {
    const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    let newBlock = { id, type };

    switch (type) {
      case 'heading':
        newBlock = { ...newBlock, text: 'New Section Heading', subtitle: '' };
        break;
      case 'paragraph':
        newBlock = {
          ...newBlock,
          text: 'Write detailed case study insights here. Separate multiple paragraphs with an empty line.'
        };
        break;
      case 'image':
        newBlock = {
          ...newBlock,
          url: '',
          alt: '',
          caption: ''
        };
        break;
      case 'gallery':
        newBlock = {
          ...newBlock,
          images: [
            { url: '', alt: 'First exploration visual', caption: '' },
            { url: '', alt: 'Second exploration visual', caption: '' }
          ],
          caption: ''
        };
        break;
      case 'quote':
        newBlock = {
          ...newBlock,
          quote: 'Design is not just what it looks like and feels like. Design is how it works.',
          author: 'Steve Jobs'
        };
        break;
      case 'metrics':
        newBlock = {
          ...newBlock,
          items: [
            { value: '+140%', label: 'engagement increase', description: 'After redesign' },
            { value: '< 3s', label: 'time to comprehend', description: 'Tested with 8 users' }
          ]
        };
        break;
      case 'embed':
        newBlock = {
          ...newBlock,
          url: '',
          title: 'Interactive Prototype',
          caption: 'Figma interactive prototype or demo video'
        };
        break;
      case 'divider':
        newBlock = { ...newBlock, style: 'line' };
        break;
      default:
        break;
    }

    updateBlocks([...blocks, newBlock]);
  };

  // Reorder, duplicate, delete
  const handleMoveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateBlocks(updated);
  };

  const handleDuplicateBlock = (index) => {
    const target = blocks[index];
    const duplicate = JSON.parse(JSON.stringify(target));
    duplicate.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicate);
    updateBlocks(updated);
  };

  const handleDeleteBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    updateBlocks(updated);
  };

  const handleUpdateBlockField = (index, field, value) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    updateBlocks(updated);
  };

  // Image upload with compression and online cloud storage
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast?.('warning', 'Invalid File Format', 'Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    showToast?.('info', 'Uploading Case Study Image...', 'Uploading in 100% original pixel-perfect quality without compression.');
    try {
      const result = await uploadImageToStorage(file, 'casestudies');
      if (result.success) {
        callback(result.url);
        showToast?.('success', 'Image Uploaded to Cloud Storage ✓', result.sizeInfo);
      } else {
        showToast?.('error', 'Image Upload Failed', result.error);
      }
    } catch (err) {
      showToast?.('error', 'Image Upload Error', err.message);
    }
  };

  return (
    <div className="border border-line rounded-2xl bg-sheet p-5 sm:p-6 space-y-6">
      {/* Section Header with Preview Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="mono text-signal text-xs uppercase tracking-wider block mb-0.5">
            Full Case Study (Optional)
          </span>
          <h4 className="text-xl font-bold font-display uppercase tracking-wider text-ink">
            Case Study Builder
          </h4>
          <p className="text-xs text-ink-3 mt-0.5">
            Configure project metadata and assemble modular content blocks in any order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isPreviewMode
                ? 'bg-signal text-white border-signal shadow-sm'
                : 'border-line text-ink-2 bg-paper hover:text-ink hover:bg-sheet'
            }`}
            aria-pressed={isPreviewMode}
          >
            <span>{isPreviewMode ? '✏ Return to Editor' : '👁 Preview Case Study'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Mode */}
      {isPreviewMode ? (
        <div className="space-y-6 bg-paper/50 p-6 rounded-2xl border border-line animate-in">
          <div className="pb-3 border-b border-line flex items-center justify-between">
            <span className="mono text-signal text-xs">Live Preview Mode</span>
            <span className="text-xs text-ink-3">({blocks.length} blocks)</span>
          </div>

          {/* Metadata Row Preview */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-xl overflow-hidden shadow-sm">
            <div className="bg-sheet p-3.5">
              <dt className="mono text-signal text-[11px] font-semibold">Role</dt>
              <dd className="m-0 text-xs font-semibold text-ink mt-0.5">
                {caseStudy.role || 'Not specified'}
              </dd>
            </div>
            <div className="bg-sheet p-3.5">
              <dt className="mono text-signal text-[11px] font-semibold">Timeline</dt>
              <dd className="m-0 text-xs font-semibold text-ink mt-0.5">
                {caseStudy.timeline || 'Not specified'}
              </dd>
            </div>
            <div className="bg-sheet p-3.5">
              <dt className="mono text-signal text-[11px] font-semibold">Team</dt>
              <dd className="m-0 text-xs font-semibold text-ink mt-0.5">
                {caseStudy.team || 'Solo'}
              </dd>
            </div>
            <div className="bg-sheet p-3.5">
              <dt className="mono text-signal text-[11px] font-semibold">Tools</dt>
              <dd className="m-0 text-xs font-semibold text-ink mt-0.5">
                {caseStudy.tools || 'Not specified'}
              </dd>
            </div>
          </dl>

          {/* Blocks Preview */}
          {blocks.length === 0 ? (
            <div className="py-12 text-center text-ink-3 text-xs">
              No content blocks added yet. Click "Return to Editor" to add blocks.
            </div>
          ) : (
            <div className="space-y-6">
              {blocks.map((block, idx) => (
                <CaseStudyBlockRenderer key={block.id || idx} block={block} index={idx} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Top Metadata Fields: Role, Timeline, Team, Tools in a neat row */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-2 font-semibold">
              Project Case Study Metadata
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-signal mb-1">
                  My Role
                </label>
                <input
                  type="text"
                  value={caseStudy.role || ''}
                  onChange={(e) => updateField('role', e.target.value)}
                  placeholder="e.g. Solo — UX/UI & Web Dev"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-signal mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  value={caseStudy.timeline || ''}
                  onChange={(e) => updateField('timeline', e.target.value)}
                  placeholder="e.g. 4 Weeks · Q1 2026"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-signal mb-1">
                  Team
                </label>
                <input
                  type="text"
                  value={caseStudy.team || ''}
                  onChange={(e) => updateField('team', e.target.value)}
                  placeholder="e.g. Solo Designer, 1 Mentor"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-signal mb-1">
                  Tools Used
                </label>
                <input
                  type="text"
                  value={caseStudy.tools || ''}
                  onChange={(e) => updateField('tools', e.target.value)}
                  placeholder="e.g. Figma, React, Tailwind"
                  className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
                />
              </div>
            </div>
          </div>

          {/* Content Blocks Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 font-semibold">
                  Content Blocks ({blocks.length})
                </label>
                <span className="text-[11px] text-ink-3">
                  Assemble your case study using headings, text, media, quotes, numbers, and embeds.
                </span>
              </div>
            </div>

            {/* Quick Add Toolbar */}
            <div className="p-3 bg-paper rounded-xl border border-line space-y-2">
              <span className="mono text-[10px] text-ink-3 uppercase tracking-wider block">
                + Add Content Block
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: 'heading', label: 'Section Heading', icon: 'H' },
                  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
                  { type: 'image', label: 'Single Image', icon: '🖼' },
                  { type: 'gallery', label: 'Image Gallery', icon: '▦' },
                  { type: 'quote', label: 'Quote', icon: '“' },
                  { type: 'metrics', label: 'Key Numbers', icon: '#' },
                  { type: 'embed', label: 'Embed (Figma/Video)', icon: '⧉' },
                  { type: 'divider', label: 'Divider Line', icon: '—' }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddBlock(item.type)}
                    className="px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink hover:border-signal hover:text-signal text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-signal font-bold">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blocks List */}
            {blocks.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-line rounded-xl text-ink-3 text-xs space-y-1">
                <p>No content blocks in this case study yet.</p>
                <p className="text-[11px]">
                  Click any button above to add a section heading, paragraph, image, quote, or embed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, idx) => (
                  <div
                    key={block.id || idx}
                    className="p-4 rounded-xl border border-line bg-paper/60 space-y-3 relative group"
                  >
                    {/* Block Toolbar Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-line/60">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[11px] text-ink-3 font-semibold">
                          #{idx + 1}
                        </span>
                        <span className="mono text-[11px] font-bold px-2 py-0.5 rounded bg-sheet border border-line uppercase text-signal">
                          {block.type}
                        </span>
                      </div>

                      {/* Reorder, Duplicate, Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, -1)}
                          disabled={idx === 0}
                          className="px-2 py-1 rounded bg-sheet border border-line text-xs font-bold text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer"
                          aria-label={`Move block ${idx + 1} up`}
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, 1)}
                          disabled={idx === blocks.length - 1}
                          className="px-2 py-1 rounded bg-sheet border border-line text-xs font-bold text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer"
                          aria-label={`Move block ${idx + 1} down`}
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateBlock(idx)}
                          className="px-2 py-1 rounded bg-sheet border border-line text-xs text-ink-2 hover:text-ink cursor-pointer"
                          aria-label={`Duplicate block ${idx + 1}`}
                          title="Duplicate"
                        >
                          ⧉
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(idx)}
                          className="px-2 py-1 rounded bg-sheet border border-line text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          aria-label={`Delete block ${idx + 1}`}
                          title="Delete Block"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Block Inputs according to type */}

                    {/* 1. Heading Block */}
                    {block.type === 'heading' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Heading Text (Shown in Table of Contents)
                          </label>
                          <input
                            type="text"
                            value={block.text || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'text', e.target.value)}
                            placeholder="e.g. 01. The Problem"
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs font-bold focus:outline-none focus:border-signal"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Optional Subtitle or Category Tag
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'subtitle', e.target.value)}
                            placeholder="e.g. User Research & Pain Point Discovery"
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Paragraph Block */}
                    {block.type === 'paragraph' && (
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                          Body Text (Use double enter to separate paragraphs)
                        </label>
                        <textarea
                          rows={4}
                          value={block.text || ''}
                          onChange={(e) => handleUpdateBlockField(idx, 'text', e.target.value)}
                          placeholder="Write rich paragraph text. Use [brackets] to highlight key phrases..."
                          className="w-full px-3 py-2 rounded-lg border border-line bg-sheet text-ink text-xs leading-relaxed focus:outline-none focus:border-signal"
                        />
                      </div>
                    )}

                    {/* 3. Single Image Block */}
                    {block.type === 'image' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Image File Upload
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, (dataUrl) =>
                                  handleUpdateBlockField(idx, 'url', dataUrl)
                                )
                              }
                              className="w-full text-xs text-ink-3 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-line file:bg-sheet file:text-xs file:font-medium file:cursor-pointer hover:file:bg-paper"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Or Image URL
                            </label>
                            <input
                              type="text"
                              value={block.url || ''}
                              onChange={(e) => handleUpdateBlockField(idx, 'url', e.target.value)}
                              placeholder="https://... or upload file"
                              className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                            />
                          </div>
                        </div>

                        {/* Thumbnail Preview */}
                        {block.url && (
                          <div className="flex items-center gap-3 p-2 rounded-lg border border-line bg-sheet">
                            <img
                              src={block.url}
                              alt="preview"
                              className="w-16 h-12 object-cover rounded border border-line"
                            />
                            <div className="flex-1 truncate text-[11px] text-ink-3">
                              Image loaded
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdateBlockField(idx, 'url', '')}
                              className="text-xs text-red-500 hover:underline px-2"
                            >
                              Clear
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Alt Text (Screen Reader Description) *
                            </label>
                            <input
                              type="text"
                              required
                              value={block.alt || ''}
                              onChange={(e) => handleUpdateBlockField(idx, 'alt', e.target.value)}
                              placeholder="Describe the image for accessibility"
                              className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Optional Caption
                            </label>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleUpdateBlockField(idx, 'caption', e.target.value)}
                              placeholder="Caption displayed under the image"
                              className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Gallery Block */}
                    {block.type === 'gallery' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-mono uppercase text-ink-3">
                            Gallery Images ({(block.images || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Array.isArray(block.images) ? block.images : [];
                              handleUpdateBlockField(idx, 'images', [
                                ...curr,
                                { url: '', alt: 'Gallery visual', caption: '' }
                              ]);
                            }}
                            className="text-xs text-signal font-semibold hover:underline cursor-pointer"
                          >
                            + Add Image to Gallery
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(block.images || []).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="p-3 rounded-lg border border-line bg-sheet space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="mono text-[10px] text-ink-3">
                                  Image #{imgIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextImgs = block.images.filter((_, i) => i !== imgIdx);
                                    handleUpdateBlockField(idx, 'images', nextImgs);
                                  }}
                                  className="text-xs text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-mono text-ink-3 mb-0.5">
                                    Upload File
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileUpload(e, (dataUrl) => {
                                        const nextImgs = [...block.images];
                                        nextImgs[imgIdx].url = dataUrl;
                                        handleUpdateBlockField(idx, 'images', nextImgs);
                                      })
                                    }
                                    className="w-full text-xs text-ink-3 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border file:border-line file:bg-paper file:text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-ink-3 mb-0.5">
                                    Or URL
                                  </label>
                                  <input
                                    type="text"
                                    value={img.url || ''}
                                    onChange={(e) => {
                                      const nextImgs = [...block.images];
                                      nextImgs[imgIdx].url = e.target.value;
                                      handleUpdateBlockField(idx, 'images', nextImgs);
                                    }}
                                    placeholder="https://..."
                                    className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  required
                                  value={img.alt || ''}
                                  onChange={(e) => {
                                    const nextImgs = [...block.images];
                                    nextImgs[imgIdx].alt = e.target.value;
                                    handleUpdateBlockField(idx, 'images', nextImgs);
                                  }}
                                  placeholder="Alt description for screen readers *"
                                  className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                                />
                                <input
                                  type="text"
                                  value={img.caption || ''}
                                  onChange={(e) => {
                                    const nextImgs = [...block.images];
                                    nextImgs[imgIdx].caption = e.target.value;
                                    handleUpdateBlockField(idx, 'images', nextImgs);
                                  }}
                                  placeholder="Caption (optional)"
                                  className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Overall Gallery Caption (Optional)
                          </label>
                          <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'caption', e.target.value)}
                            placeholder="e.g. Iterative wireframes and interface components"
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                          />
                        </div>
                      </div>
                    )}

                    {/* 5. Quote Block */}
                    {block.type === 'quote' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Highlighted Quote Text
                          </label>
                          <textarea
                            rows={3}
                            value={block.quote || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'quote', e.target.value)}
                            placeholder="Enter highlighted quote..."
                            className="w-full px-3 py-2 rounded-lg border border-line bg-sheet text-ink text-xs italic font-serif leading-relaxed focus:outline-none focus:border-signal"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Quote Author / Attribution
                          </label>
                          <input
                            type="text"
                            value={block.author || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'author', e.target.value)}
                            placeholder="e.g. Senior Recruiter, Lead Designer"
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                          />
                        </div>
                      </div>
                    )}

                    {/* 6. Key Results / Numbers Block */}
                    {block.type === 'metrics' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-mono uppercase text-ink-3">
                            Key Results & Numbers ({(block.items || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Array.isArray(block.items) ? block.items : [];
                              handleUpdateBlockField(idx, 'items', [
                                ...curr,
                                { value: '+50%', label: 'metric label', description: '' }
                              ]);
                            }}
                            className="text-xs text-signal font-semibold hover:underline cursor-pointer"
                          >
                            + Add Key Number
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(block.items || []).map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-lg border border-line bg-sheet space-y-1.5 relative"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const nextItems = block.items.filter((_, i) => i !== mIdx);
                                  handleUpdateBlockField(idx, 'items', nextItems);
                                }}
                                className="absolute top-2 right-2 text-xs text-ink-3 hover:text-red-500"
                              >
                                ✕
                              </button>
                              <div>
                                <label className="block text-[10px] font-mono text-signal uppercase font-bold">
                                  Number Value (e.g. &lt; 5s, +140%, 82%)
                                </label>
                                <input
                                  type="text"
                                  value={m.value || ''}
                                  onChange={(e) => {
                                    const nextItems = [...block.items];
                                    nextItems[mIdx].value = e.target.value;
                                    handleUpdateBlockField(idx, 'items', nextItems);
                                  }}
                                  placeholder="+140%"
                                  className="w-full px-2 py-1 rounded border border-line bg-paper text-xs font-bold text-signal"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-ink-3 uppercase">
                                  Label
                                </label>
                                <input
                                  type="text"
                                  value={m.label || ''}
                                  onChange={(e) => {
                                    const nextItems = [...block.items];
                                    nextItems[mIdx].label = e.target.value;
                                    handleUpdateBlockField(idx, 'items', nextItems);
                                  }}
                                  placeholder="comprehension speed"
                                  className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-ink-3 uppercase">
                                  Optional Subtext
                                </label>
                                <input
                                  type="text"
                                  value={m.description || ''}
                                  onChange={(e) => {
                                    const nextItems = [...block.items];
                                    nextItems[mIdx].description = e.target.value;
                                    handleUpdateBlockField(idx, 'items', nextItems);
                                  }}
                                  placeholder="Tested across 12 recruiters"
                                  className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. Embed Link Block */}
                    {block.type === 'embed' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                            Embed URL (Figma, YouTube, Vimeo, Framer, PDF)
                          </label>
                          <input
                            type="text"
                            value={block.url || ''}
                            onChange={(e) => handleUpdateBlockField(idx, 'url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=... or https://www.figma.com/file/..."
                            className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                          />
                        </div>

                        {/* Domain Security Feedback Badge */}
                        {block.url && (
                          <div className="flex items-center gap-2 text-xs">
                            {isTrustedEmbedUrl(block.url) ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-mono text-[11px]">
                                ✓ Trusted Domain ({getDomainFromUrl(block.url)}) · Safe to Embed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 font-mono text-[11px]">
                                ⚠ Domain ({getDomainFromUrl(block.url) || 'unknown'}) is not in whitelist. Will render as a safe external link button.
                              </span>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Accessible Title / Label *
                            </label>
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleUpdateBlockField(idx, 'title', e.target.value)}
                              placeholder="e.g. Figma Prototype Demo"
                              className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase text-ink-3 mb-1">
                              Optional Caption
                            </label>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleUpdateBlockField(idx, 'caption', e.target.value)}
                              placeholder="e.g. Interactive walkthrough of the final user flow"
                              className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-ink text-xs focus:outline-none focus:border-signal"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 8. Divider Block */}
                    {block.type === 'divider' && (
                      <div className="py-2 flex items-center justify-center">
                        <div className="w-full border-t border-line my-1 relative flex items-center justify-center">
                          <span className="bg-paper px-3 text-[10px] font-mono text-ink-3 uppercase">
                            Divider Line Preview
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyBlockEditor;
