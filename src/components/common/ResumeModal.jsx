import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { resolveAssetUrl } from '../../data/initialData';

export const ResumeModal = () => {
  const { isResumeOpen, closeResume, profile } = usePortfolio();

  if (!isResumeOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const resumePdfUrl = resolveAssetUrl('assets/surya-teja-resume.pdf');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in"
      role="dialog"
      aria-modal="true"
      aria-label="Resume of Sanku Naga Surya Teja Spandan"
    >
      <div className="bg-sheet text-ink border border-line rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-10 my-auto">
        {/* Top Control Bar: Status Indicator, Download/Print Actions & Close */}
        <div className="flex flex-wrap items-center justify-between pb-5 border-b border-line gap-3 sticky top-0 bg-sheet/95 backdrop-blur-md z-10 -mt-1 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs text-ink-3 uppercase tracking-wider font-semibold">
              Curriculum Vitae · Updated 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumePdfUrl}
              download="Sanku_Surya_Teja_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-signal text-white font-medium text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download original PDF"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download PDF</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-paper hover:bg-sheet border border-line text-xs font-medium text-ink transition-colors cursor-pointer flex items-center gap-1.5"
              title="Print or save as PDF"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={closeResume}
              className="w-8 h-8 rounded-full bg-paper hover:bg-sheet border border-line flex items-center justify-center text-ink-2 hover:text-ink text-sm font-bold transition-colors cursor-pointer ml-1"
              aria-label="Close resume"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Resume Document Container */}
        <div className="mt-6 space-y-7" id="resume-document">
          {/* Header */}
          <div className="pb-5 border-b border-line space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-wider text-ink uppercase leading-none">
              Sanku Naga Surya Teja Spandan
            </h1>
            <p className="text-signal font-semibold text-base sm:text-lg">
              User Experience Designer | Product Designer
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-2 font-mono pt-1">
              <span>Visakhapatnam, India</span>
              <span className="text-line">•</span>
              <a href="tel:+919291665104" className="hover:text-signal transition-colors underline">
                +91 92916 65104
              </a>
              <span className="text-line">•</span>
              <a href="mailto:suryasanku800@gmail.com" className="hover:text-signal transition-colors underline">
                suryasanku800@gmail.com
              </a>
              <span className="text-line">•</span>
              <a href="https://sankusurya.github.io/Surya_UIUX" target="_blank" rel="noreferrer" className="hover:text-signal transition-colors underline">
                sankusurya.github.io/Surya_UIUX ↗
              </a>
              <span className="text-line">•</span>
              <a href="https://linkedin.com/in/sankusurya" target="_blank" rel="noreferrer" className="hover:text-signal transition-colors underline">
                LinkedIn ↗
              </a>
              <span className="text-line">•</span>
              <a href="https://github.com/Sankusurya" target="_blank" rel="noreferrer" className="hover:text-signal transition-colors underline">
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
              Summary
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              UI/UX Designer with hands-on experience designing web and mobile products, backed by 1.5 years of design and engineering work in telecom. Currently designing EduProva, an AI-powered education and career super-app, from requirements to developer-ready screens. Skilled in user research, information architecture, user flows, wireframing, high-fidelity UI, interactive prototyping, and design systems in Figma. Uses vibe coding and the Figma MCP server to turn designs into working prototypes faster. Works closely with product and development teams to deliver clear, consistent, and easy-to-use experiences.
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Design Tools</span>
                <p className="text-ink-2">Figma, FigJam, Figma Make, Framer, Photoshop, Illustrator, Canva, LottieFiles for Figma</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Collaboration Tools</span>
                <p className="text-ink-2">Notion, Miro</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">UX Skills</span>
                <p className="text-ink-2">User Research, Usability Testing, Competitor Analysis, Information Architecture, User Flows, Wireframes, Prototypes, UX Principles & Laws (Hick's, Fitts's, Jakob's)</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">UI Skills</span>
                <p className="text-ink-2">Responsive Web Design, Design Systems, Accessibility, Interaction Design, Visual Design Principles</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Figma</span>
                <p className="text-ink-2">Auto Layout, Components, Variants, Variables, Styles, Grids, Interactive Prototypes, Dev Mode Handoff</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">AI in Design</span>
                <p className="text-ink-2">Figma Make, Figma MCP Server, AI-assisted research and ideation, knowing where AI fits in the design process</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">AI-Assisted Builds (Vibe Coding)</span>
                <p className="text-ink-2">Turning Figma designs into working prototypes with AI tools (JavaScript, React.js, Tailwind CSS, Git)</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Methods & Frameworks</span>
                <p className="text-ink-2">Design Thinking, User-Centered Design, Iterative Design</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Front-end Basics</span>
                <p className="text-ink-2">HTML5, CSS3 (Flexbox, Grid)</p>
              </div>

              <div className="p-2.5 rounded-xl bg-paper border border-line">
                <span className="font-semibold text-ink block mb-0.5">Collaboration</span>
                <p className="text-ink-2">Stakeholder Collaboration, Design Reviews, Developer Handoff</p>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
              Professional Experience
            </h2>

            {/* Experience 1: Dilshaj Infotech */}
            <div className="space-y-2 border-l-2 border-signal pl-4 py-0.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="font-bold text-sm text-ink">
                    Dilshaj Infotech, Visakhapatnam, India
                  </h3>
                  <p className="text-signal font-semibold text-xs">
                    UI/UX Designer
                  </p>
                </div>
                <span className="text-ink-3 font-mono text-xs">
                  Nov 2025 – Present
                </span>
              </div>

              <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-ink-2 leading-relaxed">
                <li>Handled end-to-end UI/UX design for EduProva, an AI-powered education and career super-app that brings learning, jobs, freelancing, and community into one platform.</li>
                <li>Turned product requirements into competitor analysis, information architecture, user flows, wireframes, and high-fidelity screens.</li>
                <li>Designed connected modules for online learning, AI resume builder, AI interview assistant, job portal with AI auto-apply, freelancing marketplace, social and messaging, payments, and certificates.</li>
                <li>Built reusable Figma components and a design system with auto layout and variants to keep the look and feel consistent across the platform.</li>
                <li>Created interactive prototypes and improved the AI job board and auto-apply flows based on usability feedback.</li>
                <li>Worked with developers and product stakeholders to deliver developer-ready designs and specs through Dev Mode handoff.</li>
                <li>Used the Figma MCP server with AI coding tools and vibe coding to turn Figma screens into working front-end prototypes, speeding up design-to-code handoff.</li>
              </ul>

              <div className="pt-1.5 text-xs bg-paper/60 p-2.5 rounded-lg border border-line space-y-1">
                <span className="font-semibold text-ink block font-mono text-[11px] uppercase tracking-wider text-signal">
                  Key Achievements:
                </span>
                <p className="text-ink-2">• Designed 6 major product areas of one platform (learning, AI tools, jobs, freelancing, community, and supporting flows) with a single, consistent visual language.</p>
                <p className="text-ink-2">• Created a reusable component library to keep the UI consistent across all modules and make developer handoff easier.</p>
              </div>
            </div>

            {/* Experience 2: Cyient */}
            <div className="space-y-2 border-l-2 border-line pl-4 py-0.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="font-bold text-sm text-ink">
                    Cyient, Visakhapatnam, India
                  </h3>
                  <p className="text-signal font-semibold text-xs">
                    Design Specialist – Telecom Network Engineering
                  </p>
                </div>
                <span className="text-ink-3 font-mono text-xs">
                  Oct 2023 – Apr 2025
                </span>
              </div>

              <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-ink-2 leading-relaxed">
                <li>Created detailed technical drawings and network layouts in AutoCAD, with true-to-scale dimensions and POP calculations.</li>
                <li>Led 12+ digitization projects, turning scanned coax and fiber network records into clear, accurate digital designs on the GRB land base.</li>
                <li>Followed strict drawing standards for layers, symbols, and labels, building a strong eye for detail, consistency, and visual clarity.</li>
                <li>Used MARLIN (ArcMap), Smallworld, TINA, GAMA, LARA, and GeoTev to design and update network maps.</li>
                <li>Reviewed and quality-checked every drawing before delivery so teams could read and use it without errors.</li>
              </ul>

              <div className="pt-1.5 text-xs bg-paper/60 p-2.5 rounded-lg border border-line">
                <span className="font-semibold text-ink block font-mono text-[11px] uppercase tracking-wider text-signal mb-1">
                  Key Achievements:
                </span>
                <p className="text-ink-2">• Recognized by Project Manager for consistent high-quality work delivery.</p>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
              Key Projects
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-paper border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">Fuel N Fix</h3>
                  <span className="text-signal font-mono font-medium">UI/UX Designer</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-ink-2">
                  <li>Designed a roadside assistance app concept to help drivers discover nearby fuel stations and vehicle repair services when support is needed on the road.</li>
                  <li>Worked on problem framing, case-study structure, interface hierarchy, and visual design to make nearby assistance easier to understand and access.</li>
                  <li>Focused on clearer service identification and helping users distinguish fuel support from vehicle repair options.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-paper border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">AI Job Board</h3>
                  <span className="text-signal font-mono font-medium">UI/UX Designer</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-ink-2">
                  <li>Designed an AI-enabled job discovery and application experience focused on reducing friction throughout the job search process.</li>
                  <li>Worked on job cards, job details, recruiter-side drafts and confirmation screens, and the AI auto-apply flow.</li>
                  <li>Explored resume-based job matching, screening-question support, personalized cover letters, application tracking, and status updates.</li>
                  <li>Iterated on the auto-apply experience based on usability-testing feedback.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-paper border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink">EduProva — AI Tech Skill Super-App</h3>
                  <span className="text-signal font-mono font-medium">UI/UX Designer</span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-ink-2">
                  <li>Designed and refined a multi-module education and career product spanning online courses, live and recorded learning, AI tools, job discovery, freelancing, community interactions, messaging, certificates, and support experiences.</li>
                  <li>Contributed user flows, wireframes, high-fidelity screens, responsive layouts, reusable Figma components, and interactive prototypes.</li>
                  <li>Worked across job-board flows, freelancing, onboarding, live learning, and AI interview assistance.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
              Education
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
              <div>
                <p className="font-bold text-ink">Andhra University, Visakhapatnam</p>
                <p className="text-ink-2">Bachelor of Science (MECS)</p>
              </div>
              <span className="text-ink-3 font-mono">2020 – 2023</span>
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
                Certifications
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-ink-2">
                <li>
                  <span className="font-semibold text-ink">Certificate in UI-UX Development</span> – Tech Mahindra SMART Academy, Visakhapatnam (Apr – Aug 2025)
                </li>
                <li>
                  <span className="font-semibold text-ink">User Experience Designer (Grade A)</span> – Skill India / NSDC, Tech Mahindra Foundation (2025)
                </li>
                <li>
                  <span className="font-semibold text-ink">LottieFiles for Figma Course</span> – LottieFiles (2026)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-ink-3 border-b border-line pb-1 font-bold">
                Achievements
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-ink-2">
                <li>Cleared the NSDC User Experience Designer assessment with <span className="font-semibold text-ink">Grade A</span>, Tech Mahindra Foundation, 2025</li>
                <li>Recognized by Project Manager for <span className="font-semibold text-ink">consistent high-quality work delivery</span>, Cyient</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <a
            href={resumePdfUrl}
            download="Sanku_Surya_Teja_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-ink-3 hover:text-signal transition-colors underline flex items-center gap-1"
          >
            <span>📄</span> Download Official PDF File
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeResume}
              className="px-5 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink hover:bg-paper transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href="mailto:suryasanku800@gmail.com?subject=Discussion%20regarding%20Product%20%2F%20UI%2FUX%20Design%20Opportunity"
              className="px-5 py-2 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Contact Surya →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
