import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CaseStudyBlockEditor } from './CaseStudyBlockEditor';

export const AdminProjectsTab = () => {
  const { projects, saveProjects } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  const emptyProject = {
    slug: '',
    title: '',
    year: '2026',
    type: ['UX case study'],
    role: 'Solo — UX/UI & Web dev',
    timeline: '[x weeks]',
    tools: 'Figma, HTML, CSS, React',
    cover: 'portfolio',
    coverImg: '',
    summary: '',
    outcome: '',
    caseStudy: {
      role: '',
      timeline: '',
      team: '',
      tools: '',
      blocks: []
    },
    problem: '',
    usersList: '',
    decisions: [
      { t: 'Core architectural choice', why: 'Better user clarity', trade: 'More upfront planning', res: 'Fast navigation' }
    ],
    metrics: [
      { val: '< 5s', label: 'understanding time' }
    ],
    reflection: ''
  };

  const [formData, setFormData] = useState(emptyProject);
  const [tagInput, setTagInput] = useState('');

  const handleEdit = (p) => {
    const problemSec = (p.sections || []).find((s) => s.id === 'problem');
    const usersSec = (p.sections || []).find((s) => s.id === 'users');
    const decisionsSec = (p.sections || []).find((s) => s.id === 'decisions');
    const outcomeSec = (p.sections || []).find((s) => s.id === 'outcome');
    const reflectionSec = (p.sections || []).find((s) => s.id === 'reflection');

    setFormData({
      slug: p.slug,
      title: p.title,
      year: p.year || '2026',
      type: p.type || ['UX case study'],
      role: p.role || '',
      timeline: p.timeline || '',
      tools: p.tools || '',
      cover: p.cover || 'portfolio',
      coverImg: p.coverImg || '',
      summary: p.summary || '',
      outcome: p.outcome || '',
      caseStudy: p.caseStudy || {
        role: p.role || '',
        timeline: p.timeline || '',
        team: '',
        tools: p.tools || '',
        blocks: []
      },
      problem: problemSec && problemSec.p ? problemSec.p.join('\n\n') : '',
      usersList: usersSec && usersSec.list ? usersSec.list.join('\n') : '',
      decisions: decisionsSec && decisionsSec.decisions ? [...decisionsSec.decisions] : [],
      metrics: outcomeSec && outcomeSec.metrics
        ? outcomeSec.metrics.map((m) => ({ val: m[0], label: m[1] }))
        : [],
      reflection: reflectionSec && reflectionSec.p ? reflectionSec.p.join('\n\n') : ''
    });
    setEditingSlug(p.slug);
    setIsEditing(true);
  };

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = projects.filter((p) => p.slug !== slug);
      saveProjects(updated);
      if (editingSlug === slug) {
        setIsEditing(false);
        setFormData(emptyProject);
      }
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    saveProjects(updated);
  };

  const handleAddDecision = () => {
    setFormData((prev) => ({
      ...prev,
      decisions: [...prev.decisions, { t: '', why: '', trade: '', res: '' }]
    }));
  };

  const handleUpdateDecision = (idx, field, val) => {
    setFormData((prev) => {
      const nextDecs = [...prev.decisions];
      nextDecs[idx][field] = val;
      return { ...prev, decisions: nextDecs };
    });
  };

  const handleRemoveDecision = (idx) => {
    setFormData((prev) => ({
      ...prev,
      decisions: prev.decisions.filter((_, i) => i !== idx)
    }));
  };

  const handleAddMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { val: '', label: '' }]
    }));
  };

  const handleUpdateMetric = (idx, field, val) => {
    setFormData((prev) => {
      const nextM = [...prev.metrics];
      nextM[idx][field] = val;
      return { ...prev, metrics: nextM };
    });
  };

  const handleRemoveMetric = (idx) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== idx)
    }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.type.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, type: [...prev.type, tagInput.trim()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (t) => {
    setFormData((prev) => ({ ...prev, type: prev.type.filter((x) => x !== t) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug =
      formData.slug.trim() ||
      formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const sections = [];

    // Problem
    if (formData.problem.trim()) {
      sections.push({
        id: 'problem',
        h: 'The problem',
        p: formData.problem.split('\n\n').filter(Boolean)
      });
    }

    // Users
    if (formData.usersList.trim()) {
      sections.push({
        id: 'users',
        h: 'Who it is for',
        list: formData.usersList.split('\n').filter(Boolean)
      });
    }

    // Decisions
    if (formData.decisions && formData.decisions.length > 0) {
      sections.push({
        id: 'decisions',
        h: 'Key decisions',
        decisions: formData.decisions.filter((d) => d.t.trim())
      });
    }

    // Outcome / Metrics
    if (formData.metrics && formData.metrics.length > 0) {
      sections.push({
        id: 'outcome',
        h: 'Outcome',
        metrics: formData.metrics.map((m) => [m.val, m.label])
      });
    }

    // Reflection
    if (formData.reflection.trim()) {
      sections.push({
        id: 'reflection',
        h: 'What I learned',
        p: formData.reflection.split('\n\n').filter(Boolean)
      });
    }

    const newProjectObj = {
      slug,
      title: formData.title,
      year: formData.year,
      type: formData.type,
      role: formData.caseStudy?.role || formData.role,
      timeline: formData.caseStudy?.timeline || formData.timeline,
      tools: formData.caseStudy?.tools || formData.tools,
      cover: formData.cover,
      coverImg: formData.coverImg,
      summary: formData.summary,
      outcome: formData.outcome,
      caseStudy: formData.caseStudy,
      sections
    };

    let updatedProjects;
    if (isEditing && editingSlug) {
      updatedProjects = projects.map((p) => (p.slug === editingSlug ? newProjectObj : p));
    } else {
      updatedProjects = [newProjectObj, ...projects];
    }

    saveProjects(updatedProjects);
    setIsEditing(false);
    setEditingSlug(null);
    setFormData(emptyProject);
    alert('Project successfully saved!');
  };

  return (
    <div className="space-y-10">
      {/* Existing Projects List */}
      <div className="bg-sheet border border-line rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
          <div>
            <h3 className="text-xl font-bold font-display uppercase tracking-wider">
              Live Projects ({projects.length})
            </h3>
            <p className="text-xs text-ink-3">Reorder, edit, or delete case studies</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setFormData(emptyProject);
                setIsEditing(true);
                setEditingSlug(null);
              }}
              className="px-4 py-2 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90"
            >
              + Add New Project
            </button>
          )}
        </div>

        <div className="divide-y divide-line">
          {projects.map((p, idx) => (
            <div
              key={p.slug}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="mono text-xs text-ink-3 w-6">{idx + 1}.</span>
                <div>
                  <h4 className="font-semibold text-sm text-ink">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="mono text-[11px] text-ink-3">#{p.slug}</span>
                    <span className="tag text-[10px] py-0 px-2">{p.year}</span>
                    <span className="text-[11px] text-ink-2 truncate max-w-xs">{p.summary}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  className="p-1 px-2 text-xs rounded border border-line disabled:opacity-30 hover:bg-paper"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  className="p-1 px-2 text-xs rounded border border-line disabled:opacity-30 hover:bg-paper"
                  title="Move Down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 rounded bg-paper text-ink text-xs font-medium border border-line hover:border-signal"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.slug, p.title)}
                  className="px-3 py-1 rounded bg-red-50 text-red-600 dark:bg-red-950/40 text-xs font-medium border border-red-200 dark:border-red-900/40 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Form Modal Popup */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-sheet text-ink border border-line rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line sticky -top-6 -mx-6 sm:-top-8 sm:-mx-8 px-6 sm:px-8 pt-6 sm:pt-8 bg-sheet z-10">
              <div>
                <span className="mono text-signal">{editingSlug ? 'Editing Mode' : 'New Project'}</span>
                <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-ink">
                  {editingSlug ? `Edit "${formData.title || 'Project'}"` : 'Create Case Study'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingSlug(null);
                  setFormData(emptyProject);
                }}
                className="w-8 h-8 rounded-full bg-paper hover:bg-sheet border border-line flex items-center justify-center text-ink-2 hover:text-ink text-sm font-bold transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-6">

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Designing this portfolio"
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="portfolio (leave blank to auto-generate)"
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Cover Visual Theme
              </label>
              <select
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              >
                <option value="portfolio">Portfolio (Dark theme with typography)</option>
                <option value="movies">Movies Showcase (&lt;HTML5/&gt; strip)</option>
                <option value="store">Store (Gentleman Boutique luxury style)</option>
                <option value="admin">Admin Panel (Studio dashboard illustration)</option>
                <option value="custom">Minimal Dark Card</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Custom Cover Image (Optional - overrides theme)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) setFormData({ ...formData, coverImg: ev.target.result });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-ink-3 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border file:border-line file:bg-paper file:text-xs file:font-medium file:cursor-pointer hover:file:bg-sheet"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.coverImg || ''}
                    onChange={(e) => setFormData({ ...formData, coverImg: e.target.value })}
                    placeholder="Or paste cover image URL"
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
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Category Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.type.map((t) => (
                <span
                  key={t}
                  className="tag flex items-center gap-1.5 cursor-pointer hover:border-red-400"
                  onClick={() => handleRemoveTag(t)}
                  title="Click to remove"
                >
                  {t} ✕
                </span>
              ))}
            </div>
            <div className="flex gap-2">
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
                placeholder="Add tag (e.g. UX case study, UI, Web dev)"
                className="flex-1 px-3.5 py-1.5 rounded-xl border border-line bg-paper text-ink text-xs focus:outline-none focus:border-signal"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl border border-line text-xs font-medium bg-paper hover:bg-sheet"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Timeline (use [brackets] for highlights)
              </label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="[4–6 weeks]"
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Tools
              </label>
              <input
                type="text"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                placeholder="Figma, HTML/CSS/JS, [backend]"
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Outcome Highlight
              </label>
              <input
                type="text"
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="Role readable in under 5 seconds..."
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
          </div>

          {/* Description / Summary */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Elevator Summary / Description
            </label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Short 1-2 sentence overview shown in the project header directly above the case study..."
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
            />
          </div>

          {/* NEW Case Study Section below description field */}
          <div className="pt-2">
            <CaseStudyBlockEditor
              caseStudy={formData.caseStudy}
              onChange={(newCaseStudy) => setFormData({ ...formData, caseStudy: newCaseStudy })}
              projectTitle={formData.title}
            />
          </div>

          {/* Legacy Outline Fields (Optional fallback for older projects) */}
          <details className="border border-line rounded-xl p-4 bg-paper/40 text-xs space-y-4">
            <summary className="cursor-pointer font-mono uppercase text-ink-3 hover:text-ink font-semibold select-none">
              ▾ Legacy Outline Sections (Optional backward-compatibility)
            </summary>

            {/* Problem */}
            <div className="pt-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                The Problem (Separate paragraphs with double enter)
              </label>
              <textarea
                rows={4}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            {/* Who it is for */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                Who it is for (One bullet point per line)
              </label>
              <textarea
                rows={3}
                value={formData.usersList}
                onChange={(e) => setFormData({ ...formData, usersList: e.target.value })}
                placeholder="Recruiters: need role, level and availability at a glance.&#10;Hiring managers: need decision-making evidence..."
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            {/* Key Decisions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                  Key Decisions
                </label>
                <button
                  type="button"
                  onClick={handleAddDecision}
                  className="text-xs text-signal font-medium hover:underline cursor-pointer"
                >
                  + Add Decision
                </button>
              </div>

              <div className="space-y-4">
                {formData.decisions.map((d, dIdx) => (
                  <div key={dIdx} className="p-4 rounded-xl border border-line bg-sheet space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveDecision(dIdx)}
                      className="absolute top-2 right-2 text-ink-3 hover:text-red-500 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                    <span className="mono text-[10px]">Decision {dIdx + 1}</span>
                    <input
                      type="text"
                      value={d.t}
                      onChange={(e) => handleUpdateDecision(dIdx, 't', e.target.value)}
                      placeholder="Decision Headline (e.g. A bold hero that states the role)"
                      className="w-full px-3 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-semibold"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={d.why}
                        onChange={(e) => handleUpdateDecision(dIdx, 'why', e.target.value)}
                        placeholder="Why"
                        className="px-2.5 py-1 rounded border border-line bg-paper text-xs"
                      />
                      <input
                        type="text"
                        value={d.trade}
                        onChange={(e) => handleUpdateDecision(dIdx, 'trade', e.target.value)}
                        placeholder="Trade-off"
                        className="px-2.5 py-1 rounded border border-line bg-paper text-xs"
                      />
                      <input
                        type="text"
                        value={d.res}
                        onChange={(e) => handleUpdateDecision(dIdx, 'res', e.target.value)}
                        placeholder="Result"
                        className="px-2.5 py-1 rounded border border-line bg-paper text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                  Outcome Metrics
                </label>
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="text-xs text-signal font-medium hover:underline cursor-pointer"
                >
                  + Add Metric
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formData.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-3 rounded-xl border border-line bg-sheet relative space-y-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(mIdx)}
                      className="absolute top-1 right-2 text-ink-3 hover:text-red-500 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                    <input
                      type="text"
                      value={m.val}
                      onChange={(e) => handleUpdateMetric(mIdx, 'val', e.target.value)}
                      placeholder="e.g. < 5s"
                      className="w-full px-2 py-1 rounded border border-line bg-paper text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleUpdateMetric(mIdx, 'label', e.target.value)}
                      placeholder="e.g. to understand role"
                      className="w-full px-2 py-1 rounded border border-line bg-paper text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                What I Learned
              </label>
              <textarea
                rows={3}
                value={formData.reflection}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>
          </details>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingSlug(null);
                    setFormData(emptyProject);
                  }}
                  className="px-5 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90 shadow-sm cursor-pointer"
                >
                  {editingSlug ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsTab;
