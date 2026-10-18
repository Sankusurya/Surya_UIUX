import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const ResumeModal = () => {
  const { isResumeOpen, closeResume, profile } = usePortfolio();

  if (!isResumeOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-sheet text-ink border border-line rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-10 my-auto">
        {/* Close and Actions */}
        <div className="flex items-center justify-between pb-6 border-b border-line gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs text-ink-3 uppercase tracking-wider">
              Curriculum Vitae
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-paper hover:bg-sheet border border-line text-xs font-medium text-ink transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={closeResume}
              className="w-8 h-8 rounded-full bg-paper hover:bg-sheet border border-line flex items-center justify-center text-ink-2 hover:text-ink text-sm font-bold transition-colors cursor-pointer"
              aria-label="Close resume"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="mt-6 space-y-8" id="resume-document">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold font-display tracking-wider text-ink uppercase">
                {profile.name || 'Surya Teja'}
              </h1>
              <p className="text-signal font-medium text-base mt-0.5">
                Junior UX/UI & Product Designer
              </p>
              <p className="text-xs text-ink-3 mt-1">
                {profile.location || 'Andhra Pradesh, India · Open to Remote & Relocation'}
              </p>
            </div>

            <div className="text-xs text-ink-2 sm:text-right space-y-1 font-mono">
              <div>
                <a href={`mailto:${profile.email || 'sankusurya@gmail.com'}`} className="hover:text-signal underline">
                  {profile.email || 'sankusurya@gmail.com'}
                </a>
              </div>
              <div>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-signal underline">
                  LinkedIn Profile ↗
                </a>
              </div>
              <div>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-signal underline">
                  GitHub Profile ↗
                </a>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1">
              Summary
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Product-minded UX/UI Designer with front-end engineering proficiency. Passionate about transforming messy, high-friction product problems into intuitive, battle-tested interfaces users grasp on first tap. Experienced in conducting user research, prototyping in Figma, building comprehensive design systems, and shipping production-ready web interfaces.
            </p>
          </div>

          {/* Core Toolkit & Skills */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1">
              Core Toolkit & Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-paper border border-line">
                <span className="font-semibold block text-ink mb-1">Design & UX</span>
                <p className="text-ink-2">
                  UX Research, Usability Testing, Information Architecture, Wireframing, Rapid Prototyping, Design Systems, Mobile Apps, Micro-interactions.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-paper border border-line">
                <span className="font-semibold block text-ink mb-1">Tools & Code</span>
                <p className="text-ink-2">
                  Figma, FigJam, HTML5 (Semantic), CSS3 (Flexbox, Grid), JavaScript (ES6+), React.js, Tailwind CSS, Git, Responsive Web Design.
                </p>
              </div>
            </div>
          </div>

          {/* Featured Projects & Case Studies */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1">
              Featured Case Studies & Work
            </h2>

            <div className="space-y-4 text-xs">
              <div className="border-l-2 border-signal pl-4 py-0.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">Personal Portfolio & CMS Platform</h3>
                  <span className="text-ink-3 font-mono">2026</span>
                </div>
                <p className="text-signal font-medium">Solo — Product Design, UX Research, React & Tailwind Development</p>
                <p className="text-ink-2">
                  Designed and built an end-to-end recruiter-optimized portfolio with a real-time Studio CMS admin panel. Optimized scanning time to under 5 seconds for role identification and provided one-click navigation to all case studies.
                </p>
              </div>

              <div className="border-l-2 border-line pl-4 py-0.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">2025 Movies Showcase</h3>
                  <span className="text-ink-3 font-mono">2025</span>
                </div>
                <p className="text-signal font-medium">UI Design & Front-End Engineering</p>
                <p className="text-ink-2">
                  Built a fully accessible, semantic media showcase with high keyboard navigability, screen-reader landmark hierarchies, and dynamic responsive layouts.
                </p>
              </div>

              <div className="border-l-2 border-line pl-4 py-0.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">Gentleman Boutique Menswear Store</h3>
                  <span className="text-ink-3 font-mono">2025</span>
                </div>
                <p className="text-signal font-medium">UX Research, E-Commerce UI & Build</p>
                <p className="text-ink-2">
                  Redesigned the entire purchase funnel and mobile checkout experience for a menswear boutique, focusing on reducing cart abandonment through clear visual hierarchy.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Background */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1">
              Education & Background
            </h2>
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-ink">Bachelor's Degree in Computer Science / Engineering</p>
                <p className="text-ink-2">Specialized in Human-Computer Interaction & Web Technologies</p>
              </div>
              <span className="text-ink-3 font-mono">Andhra Pradesh, India</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-line flex justify-end gap-3">
          <button
            type="button"
            onClick={closeResume}
            className="px-5 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink hover:bg-paper transition-colors cursor-pointer"
          >
            Close
          </button>
          <a
            href={`mailto:${profile.email || 'sankusurya@gmail.com'}?subject=Discussion%20regarding%20Product%20Design%20Role`}
            className="px-5 py-2 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Contact Surya →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
