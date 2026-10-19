import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminProfileTab = () => {
  const { profile, saveProfile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: profile.name || 'Surya Teja',
    roleLine1: profile.roleLine1 || 'USER EXPERIENCE',
    roleLine2: profile.roleLine2 || 'DESIGNER',
    badge: profile.badge || profile.status || 'Available for Junior User Experience & UI Roles',
    lead: profile.lead || 'I turn messy product problems into intuitive, battle-tested interfaces that users understand on first tap — and I know how to build them in code.',
    highlightedPhrase: profile.highlightedPhrase || 'intuitive, battle-tested interfaces',
    specialization: profile.specialization || profile.focus || 'UX Research, Mobile Apps, Design Systems, E-Commerce',
    coreToolkit: profile.coreToolkit || profile.strengths || 'Figma, FigJam, HTML5, CSS Grid, JavaScript',
    location: profile.location || profile.basedIn || 'Andhra Pradesh, India · Open to Remote & Relocation',
    email: profile.email || 'suryasanku800@gmail.com',
    socials: profile.socials || [
      { label: 'LinkedIn', note: 'view profile', href: 'https://linkedin.com' },
      { label: 'GitHub', note: 'view code', href: 'https://github.com/Sankusurya' },
      { label: 'Resume', note: 'view resume', href: '#resume' }
    ]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index, field, value) => {
    const nextSocials = [...formData.socials];
    nextSocials[index] = { ...nextSocials[index], [field]: value };
    setFormData((prev) => ({ ...prev, socials: nextSocials }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile({
      ...profile,
      ...formData,
      status: formData.badge, // keep sync
      focus: formData.specialization,
      strengths: formData.coreToolkit,
      basedIn: formData.location
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-6 animate-in">
      <div className="pb-3 border-b border-line flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="mono text-signal">Hero & Identity CMS</span>
          <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-ink">
            Hero Section & Profile Settings
          </h3>
          <p className="text-xs text-ink-3">
            Directly configure the hero typography, availability status, specialization, toolkit, and contact info.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold animate-in">
            ✓ Changes saved successfully!
          </span>
        )}
      </div>

      {/* Hero Left Column Fields */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-3">
          1. Hero Typography & Status
        </h4>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Availability Status Badge (With Pulsing Dot)
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="Available for Junior User Experience & UI Roles"
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Display Name (Italic Serif)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Surya Teja"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Headline Line 1 (Condensed Cream)
            </label>
            <input
              type="text"
              value={formData.roleLine1}
              onChange={(e) => handleChange('roleLine1', e.target.value)}
              placeholder="USER EXPERIENCE"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Headline Line 2 (Condensed Orange)
            </label>
            <input
              type="text"
              value={formData.roleLine2}
              onChange={(e) => handleChange('roleLine2', e.target.value)}
              placeholder="DESIGNER"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal font-bold uppercase text-signal"
            />
          </div>
        </div>
      </div>

      {/* Hero Right Column Fields */}
      <div className="space-y-4 pt-4 border-t border-line">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-3">
          2. Hero Pitch & Metadata
        </h4>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Lead Pitch Paragraph
          </label>
          <textarea
            rows={2}
            value={formData.lead}
            onChange={(e) => handleChange('lead', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Highlighted Orange Phrase in Pitch
          </label>
          <input
            type="text"
            value={formData.highlightedPhrase}
            onChange={(e) => handleChange('highlightedPhrase', e.target.value)}
            placeholder="intuitive, battle-tested interfaces"
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-signal font-semibold text-sm focus:outline-none focus:border-signal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              placeholder="UX Research, Mobile Apps, Design Systems, E-Commerce"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Core Toolkit
            </label>
            <input
              type="text"
              value={formData.coreToolkit}
              onChange={(e) => handleChange('coreToolkit', e.target.value)}
              placeholder="Figma, FigJam, HTML5, CSS Grid, JavaScript"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Andhra Pradesh, India · Open to Remote & Relocation"
              className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
            />
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="space-y-4 pt-4 border-t border-line">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-3">
          3. Contact & Social Channels
        </h4>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal max-w-md"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
            Social Profiles & Links
          </label>
          {(formData.socials || []).map((s, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="mono text-xs w-28 text-ink font-semibold">{s.label}:</span>
              <input
                type="text"
                value={s.href || ''}
                onChange={(e) => handleSocialChange(idx, 'href', e.target.value)}
                placeholder="URL or anchor (e.g. https://... or #resume)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-signal"
              />
              <input
                type="text"
                value={s.note || ''}
                onChange={(e) => handleSocialChange(idx, 'note', e.target.value)}
                placeholder="Hover note"
                className="w-36 px-3 py-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-signal"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-line">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90 shadow-sm cursor-pointer transition-opacity"
        >
          Save All Hero & Profile Changes
        </button>
      </div>
    </form>
  );
};

export default AdminProfileTab;
