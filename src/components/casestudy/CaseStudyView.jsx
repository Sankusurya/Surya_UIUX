import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Tags } from '../common/Tags';
import { TodoText } from '../common/TodoText';
import { CaseStudyFullScreenViewer } from './CaseStudyFullScreenViewer';
import { normalizeProject } from '../../data/initialData';

export const CaseStudyView = () => {
  const { currentRoute, projects } = usePortfolio();

  const slug = currentRoute.replace('case-', '');
  const rawProject = projects.find((p) => p.slug === slug) || projects[0];
  const project = normalizeProject(rawProject);

  // Full-Screen Continuous Case Study Reader State
  const [fullScreenViewerOpen, setFullScreenViewerOpen] = useState(false);
  const [activeSlices, setActiveSlices] = useState([]);
  const [viewerTitle, setViewerTitle] = useState('');

  if (!project) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-wider text-ink mb-4">
          Project not found
        </h2>
        <a
          href="#work"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-signal text-white font-semibold text-xs hover:opacity-90 transition-opacity"
        >
          ← Return to All Work
        </a>
      </div>
    );
  }

  const openViewerForCover = () => {
    if (!project.coverImg) return;
    setActiveSlices([{ url: project.coverImg, width: 0, height: 0, index: 0 }]);
    setViewerTitle(`${project.title} · Cover Artwork`);
    setFullScreenViewerOpen(true);
  };

  const openViewerForCaseStudy = (img) => {
    const slices = Array.isArray(img.slices) && img.slices.length > 0
      ? img.slices
      : [{ url: img.url, width: img.width || 0, height: img.height || 0, index: 0 }];

    setActiveSlices(slices);
    setViewerTitle(project.title);
    setFullScreenViewerOpen(true);
  };

  // Other projects for "More projects" section (exclude current project)
  const otherProjects = projects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  // Prototype embed URL helper
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.includes('figma.com/')) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(trimmed)}`;
    }
    if (trimmed.includes('youtube.com/watch') || trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/(?:youtu\.be\/|watch\?v=)([\w\-]+)/);
      if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
      }
    }
    return null;
  };

  const embedUrl = getEmbedUrl(project.prototypeUrl);

  return (
    <div className="animate-in pt-4 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. "All work" Back Link */}
      <nav className="mb-6">
        <a
          href="#work"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-3 hover:text-signal transition-colors cursor-pointer py-1"
        >
          <span>←</span> All work
        </a>
      </nav>

      {/* 2. Project Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display uppercase tracking-wider text-ink leading-[0.95] mb-4">
        {project.title}
      </h1>

      {/* 3. Category Tags */}
      {project.type && (
        <div className="mb-6">
          <Tags types={project.type} year={project.year} />
        </div>
      )}

      {/* 4. Short Project Description */}
      {project.summary && (
        <p className="text-lg sm:text-xl text-ink-2 max-w-3xl leading-relaxed mb-6 font-normal">
          <TodoText text={project.summary} />
        </p>
      )}

      {/* 5. Small Row of Facts: My Role, Timeline, Tools (Show only filled ones) */}
      {(project.role || project.timeline || project.tools) && (
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 py-4 border-y border-line mb-8 text-sm">
          {project.role && (
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-signal font-semibold">
                My Role
              </span>
              <span className="font-semibold text-ink leading-snug">
                <TodoText text={project.role} />
              </span>
            </div>
          )}

          {project.timeline && (
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-signal font-semibold">
                Timeline
              </span>
              <span className="font-semibold text-ink leading-snug">
                <TodoText text={project.timeline} />
              </span>
            </div>
          )}

          {project.tools && (
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-signal font-semibold">
                Tools
              </span>
              <span className="font-semibold text-ink leading-snug">
                <TodoText text={project.tools} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* 6. Prominent Action Buttons (View prototype & View on Behance) */}
      {(project.prototypeUrl || project.caseStudyUrl) && (
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {project.prototypeUrl && (
            <a
              href={project.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer"
              style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
            >
              <span>View Prototype</span>
              <span className="text-base leading-none">↗</span>
            </a>
          )}

          {project.caseStudyUrl && (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line bg-sheet text-ink hover:text-signal hover:border-signal/50 font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>View on Behance</span>
              <span className="text-base leading-none">↗</span>
            </a>
          )}
        </div>
      )}

      {/* 7. The Main Cover Image (Full width, Uncropped, Crisp) */}
      {project.coverImg && (
        <figure className="mb-10 w-full group">
          <div
            onClick={openViewerForCover}
            title="Click to view full screen"
            className="w-full overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm cursor-zoom-in transition-all duration-200 hover:border-signal/50 relative"
          >
            <img
              src={project.coverImg}
              alt={`${project.title} Cover`}
              loading="eager"
              className="w-full h-auto block m-0 p-0"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/75 text-white text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-xs flex items-center gap-1.5 border border-white/10 shadow-md">
              <span>🔍 Full Screen</span>
            </div>
          </div>
        </figure>
      )}

      {/* 8. The Case Study: All Images Stacked Continuously at Full Width */}
      {Array.isArray(project.images) && project.images.length > 0 && (
        <section aria-label="Case Study Deliverables" className="w-full space-y-10 my-10">
          {project.images.map((img, idx) => {
            const imgSlices = Array.isArray(img.slices) && img.slices.length > 0
              ? img.slices
              : [{ url: img.url, width: img.width || 0, height: img.height || 0, index: 0 }];

            return (
              <figure key={img.id || idx} className="w-full group">
                <div
                  onClick={() => openViewerForCaseStudy(img)}
                  title="Click anywhere to view full-screen case study reader"
                  className="w-full rounded-2xl border border-line bg-sheet overflow-hidden shadow-sm cursor-zoom-in transition-all duration-200 hover:border-signal/50 relative"
                  style={{ lineHeight: 0 }}
                >
                  {/* Seamless vertical stack of slices with zero gap */}
                  <div className="w-full flex flex-col m-0 p-0" style={{ lineHeight: 0 }}>
                    {imgSlices.map((slice, sIdx) => {
                      const hasAspect = slice.width && slice.height;
                      return (
                        <div
                          key={slice.url || sIdx}
                          className="w-full relative m-0 p-0 overflow-hidden bg-white/[0.02]"
                          style={{
                            aspectRatio: hasAspect ? `${slice.width} / ${slice.height}` : undefined,
                            lineHeight: 0,
                          }}
                        >
                          <img
                            src={slice.url}
                            alt={img.alt || `${project.title} Case Study Visual - Part ${sIdx + 1}`}
                            loading={sIdx === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="w-full h-auto block m-0 p-0 border-0 outline-none"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              verticalAlign: 'middle',
                              margin: 0,
                              padding: 0,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm flex items-center gap-2 border border-white/10 shadow-lg">
                    <span>🔍 Click to expand full-screen</span>
                  </div>
                </div>

                {img.alt && img.alt !== `${project.title} case study visual` && img.alt !== `${project.title} Case Study Visual` && (
                  <figcaption className="text-xs text-ink-3 text-center mt-2.5 font-mono">
                    {img.alt}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </section>
      )}

      {/* 9. Optional Embedded Live Prototype at the End of the Case Study */}
      {project.prototypeUrl && (
        <section aria-labelledby="prototype-embed-h" className="my-16 pt-8 border-t border-line space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="mono text-signal text-xs uppercase tracking-wider block mb-0.5">
                Interactive Deliverable
              </span>
              <h2 id="prototype-embed-h" className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-ink">
                Live Prototype
              </h2>
            </div>
            <a
              href={project.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-sheet text-ink hover:text-signal text-xs font-semibold transition-colors"
            >
              <span>Open in New Tab</span>
              <span>↗</span>
            </a>
          </div>

          {embedUrl ? (
            <div className="w-full aspect-[16/9] min-h-[380px] sm:min-h-[500px] rounded-2xl border border-line overflow-hidden bg-black shadow-md">
              <iframe
                title={`${project.title} Interactive Prototype`}
                src={embedUrl}
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-line bg-sheet flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-ink">
                  Test the Live Experience
                </h3>
                <p className="text-xs text-ink-2 mt-1 max-w-md">
                  Interact with the working flows, micro-interactions, and component states.
                </p>
              </div>
              <a
                href={project.prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-semibold text-xs sm:text-sm shrink-0 transition-transform active:scale-[0.99]"
                style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
              >
                Launch Prototype ↗
              </a>
            </div>
          )}
        </section>
      )}

      {/* 10. "More projects" Section */}
      {otherProjects.length > 0 && (
        <section aria-labelledby="more-projects-h" className="mt-20 pt-12 border-t border-line">
          <div className="flex items-center justify-between mb-8">
            <h2 id="more-projects-h" className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-ink">
              More Projects
            </h2>
            <a href="#work" className="text-xs font-mono uppercase tracking-wider text-signal hover:underline">
              View all work →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((p) => {
              const norm = normalizeProject(p);
              return (
                <a
                  key={norm.slug}
                  href={`#case-${norm.slug}`}
                  className="group rounded-2xl border border-line bg-sheet p-4 space-y-3 block transition-all duration-200 hover:-translate-y-1 hover:border-signal/50 hover:shadow-lg"
                >
                  {/* Card Cover (Uncropped) */}
                  <div className="w-full overflow-hidden rounded-xl border border-line bg-paper aspect-[16/10] flex items-center justify-center">
                    {norm.coverImg ? (
                      <img
                        src={norm.coverImg}
                        alt={norm.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="p-4 text-center">
                        <span className="font-display text-xl uppercase tracking-wider text-ink font-bold block">
                          {norm.title}
                        </span>
                        <span className="text-[10px] font-mono text-signal uppercase mt-1 block">
                          UX Case Study
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Tags types={norm.type} year={norm.year} />
                    <h3 className="font-display uppercase text-lg font-bold text-ink group-hover:text-signal transition-colors mt-2">
                      {norm.title}
                    </h3>
                    {norm.summary && (
                      <p className="text-xs text-ink-3 line-clamp-2 mt-1">
                        <TodoText text={norm.summary} />
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Full-Screen Continuous Case Study Reader */}
      <CaseStudyFullScreenViewer
        isOpen={fullScreenViewerOpen}
        onClose={() => setFullScreenViewerOpen(false)}
        slices={activeSlices}
        title={viewerTitle || project.title}
      />
    </div>
  );
};

export default CaseStudyView;
