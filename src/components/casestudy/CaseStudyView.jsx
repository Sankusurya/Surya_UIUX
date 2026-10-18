import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Cover } from '../common/Cover';
import { Tags } from '../common/Tags';
import { TodoText } from '../common/TodoText';
import { CaseStudyBlockRenderer, slugifyHeading } from './CaseStudyBlockRenderer';

export const CaseStudyView = () => {
  const { currentRoute, projects } = usePortfolio();

  const slug = currentRoute.replace('case-', '');
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projectIndex !== -1 ? projects[projectIndex] : projects[0];

  const [activeSectionId, setActiveSectionId] = useState('');

  const nextProject = projects.length > 1
    ? projects[(projectIndex + 1) % projects.length]
    : null;

  const hasModernCaseStudy = Boolean(
    project?.caseStudy &&
    Array.isArray(project.caseStudy.blocks) &&
    project.caseStudy.blocks.length > 0
  );

  const headings = hasModernCaseStudy
    ? project.caseStudy.blocks
        .filter((b) => b.type === 'heading' && b.text)
        .map((b) => ({
          id: b.id || slugifyHeading(b.text),
          text: b.text
        }))
    : [];

  // Track active section for Table of Contents with IntersectionObserver
  useEffect(() => {
    if (!hasModernCaseStudy || headings.length === 0) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasModernCaseStudy, headings]);

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold font-display uppercase tracking-wider">Project not found</h2>
        <a className="textlink mt-4 inline-block text-signal" href="#work">
          ← Back to work
        </a>
      </div>
    );
  }

  const handleScrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionId(id);
    }
  };

  const handleLegacyJump = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in">
      {/* Project Header */}
      <header className="cs-head pb-6">
        <a className="back" href="#work">
          ← All work
        </a>
        <Tags types={project.type} year={project.year} />
        <h1 className="font-display uppercase tracking-wider text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ink leading-[0.92]">
          {project.title}
        </h1>
        <p className="sum text-lg sm:text-xl text-ink-2 max-w-3xl leading-relaxed">
          <TodoText text={project.summary} />
        </p>

        {/* Cover Container */}
        <div className="w-full my-2">
          <Cover
            type={project.cover}
            title={project.title}
            coverImg={project.coverImg}
          />
        </div>

        {/* Fallback Legacy facts if no modern case study */}
        {!hasModernCaseStudy && (
          <dl className="facts">
            <div>
              <dt className="mono text-signal">Role</dt>
              <dd>
                <TodoText text={project.role} />
              </dd>
            </div>
            <div>
              <dt className="mono text-signal">Timeline</dt>
              <dd>
                <TodoText text={project.timeline} />
              </dd>
            </div>
            <div>
              <dt className="mono text-signal">Tools</dt>
              <dd>
                <TodoText text={project.tools} />
              </dd>
            </div>
            <div>
              <dt className="mono text-signal">Outcome</dt>
              <dd>
                <TodoText text={project.outcome} />
              </dd>
            </div>
          </dl>
        )}
      </header>

      {/* Modern Case Study View */}
      {hasModernCaseStudy ? (
        <div className="pt-2 pb-16">
          {/* Metadata Row: Role, Timeline, Team, Tools in a neat row */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden mb-12 shadow-sm">
            <div className="bg-sheet p-4 sm:p-5 flex flex-col gap-1">
              <dt className="mono text-signal text-[11px] uppercase tracking-wider font-semibold">
                Role
              </dt>
              <dd className="m-0 text-sm font-semibold text-ink leading-snug">
                <TodoText text={project.caseStudy.role || project.role || 'Solo'} />
              </dd>
            </div>
            <div className="bg-sheet p-4 sm:p-5 flex flex-col gap-1">
              <dt className="mono text-signal text-[11px] uppercase tracking-wider font-semibold">
                Timeline
              </dt>
              <dd className="m-0 text-sm font-semibold text-ink leading-snug">
                <TodoText text={project.caseStudy.timeline || project.timeline || 'Ongoing'} />
              </dd>
            </div>
            <div className="bg-sheet p-4 sm:p-5 flex flex-col gap-1">
              <dt className="mono text-signal text-[11px] uppercase tracking-wider font-semibold">
                Team
              </dt>
              <dd className="m-0 text-sm font-semibold text-ink leading-snug">
                <TodoText text={project.caseStudy.team || 'Solo UX/UI'} />
              </dd>
            </div>
            <div className="bg-sheet p-4 sm:p-5 flex flex-col gap-1">
              <dt className="mono text-signal text-[11px] uppercase tracking-wider font-semibold">
                Tools
              </dt>
              <dd className="m-0 text-sm font-semibold text-ink leading-snug">
                <TodoText text={project.caseStudy.tools || project.tools || 'Figma, Code'} />
              </dd>
            </div>
          </dl>



          {/* Main Case Study Content with Sticky TOC on Large Screens */}
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:gap-16 items-start">
            {/* Table of Contents - Hidden on phones, visible and sticky on large screens */}
            {headings.length > 0 && (
              <aside className="hidden lg:block sticky top-28 self-start pt-2">
                <nav aria-label="Table of contents" className="space-y-3">
                  <span className="mono text-signal text-[11px] uppercase tracking-wider font-bold block">
                    On this page
                  </span>
                  <ul className="space-y-1.5 border-l border-line">
                    {headings.map((h) => {
                      const isActive = activeSectionId === h.id;
                      return (
                        <li key={h.id}>
                          <button
                            type="button"
                            onClick={() => handleScrollToHeading(h.id)}
                            className={`w-full text-left text-xs py-1.5 pl-3 -ml-[1px] border-l-2 transition-all block truncate font-medium cursor-pointer ${
                              isActive
                                ? 'border-signal text-signal font-bold bg-signal/5 rounded-r-md'
                                : 'border-transparent text-ink-3 hover:text-ink hover:border-line'
                            }`}
                            title={h.text}
                          >
                            {h.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </aside>
            )}

            {/* Content Blocks in Order */}
            <article className={`space-y-6 ${headings.length === 0 ? 'max-w-4xl mx-auto' : ''}`}>
              {project.caseStudy.blocks.map((block, idx) => (
                <CaseStudyBlockRenderer key={block.id || idx} block={block} index={idx} />
              ))}
            </article>
          </div>

          {/* Link to Next Project */}
          {nextProject && (
            <div className="next mt-16 pt-8 border-t border-line flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="mono text-signal text-xs uppercase tracking-wider block">
                  Next Project
                </span>
                <a
                  href={`#case-${nextProject.slug}`}
                  className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink hover:text-signal transition-colors font-extrabold inline-flex items-center gap-2 mt-1"
                >
                  {nextProject.title} <span>→</span>
                </a>
              </div>
              <a
                href="#work"
                className="px-5 py-2.5 rounded-full border border-line text-xs font-semibold text-ink-2 hover:text-ink hover:bg-paper transition-colors"
              >
                ← All Projects
              </a>
            </div>
          )}
        </div>
      ) : (
        /* Legacy Sections for Projects Without Modern Case Study */
        <div className="cs-body">
          <nav className="toc" aria-label="On this page">
            <span className="mono">On this page</span>
            {(project.sections || []).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => handleLegacyJump(e, s.id)}
              >
                {s.h}
              </button>
            ))}
          </nav>

          <article>
            {(project.sections || []).map((s) => (
              <section key={s.id} className="cs-sec" id={s.id} style={{ padding: 0 }}>
                <h2>{s.h}</h2>

                {s.p &&
                  s.p.map((text, idx) => (
                    <p key={idx}>
                      <TodoText text={text} />
                    </p>
                  ))}

                {s.list && (
                  <ul>
                    {s.list.map((item, idx) => (
                      <li key={idx}>
                        <TodoText text={item} />
                      </li>
                    ))}
                  </ul>
                )}

                {s.decisions &&
                  s.decisions.map((d, j) => (
                    <div key={j} className="decision">
                      <span className="mono">Decision {j + 1}</span>
                      <h3>
                        <TodoText text={d.t} />
                      </h3>
                      <dl>
                        <dt>Why</dt>
                        <dd>
                          <TodoText text={d.why} />
                        </dd>
                        <dt>Trade-off</dt>
                        <dd>
                          <TodoText text={d.trade} />
                        </dd>
                        <dt>Result</dt>
                        <dd>
                          <TodoText text={d.res} />
                        </dd>
                      </dl>
                    </div>
                  ))}

                {s.metrics && (
                  <div className="metrics">
                    {s.metrics.map((m, idx) => (
                      <div key={idx} className="metric">
                        <b>
                          <TodoText text={m[0]} />
                        </b>
                        <span>
                          <TodoText text={m[1]} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {nextProject && (
              <div className="next">
                <span className="mono">Next project</span>
                <a href={`#case-${nextProject.slug}`}>
                  {nextProject.title} →
                </a>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
};

export default CaseStudyView;
