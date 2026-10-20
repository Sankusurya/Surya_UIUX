import React from 'react';
import { THINKING_STORY } from '../../data/initialData';

export const ThinkingView = () => {
  const { header, chapters, ai, rules } = THINKING_STORY;

  const scrollToChapter = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <article className="thinking-story-page" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
      {/* Page Header */}
      <header style={{ marginBottom: '48px' }}>
        <div className="sh">
          <h2>{header.title}</h2>
          <span className="mono">{header.label}</span>
        </div>
        <p
          className="read"
          style={{
            fontSize: 'clamp(18px, 2.2vw, 20px)',
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            maxWidth: '680px',
            marginBottom: '32px',
          }}
        >
          {header.intro}
        </p>

        {/* In This Story - Chapter Pills */}
        <div style={{ marginTop: '28px' }}>
          <div
            className="mono"
            style={{
              marginBottom: '12px',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--ink-3)',
            }}
          >
            IN THIS STORY
          </div>
          <nav
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
            aria-label="Story chapter navigation"
          >
            {chapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className="story-pill-btn"
                aria-label={`Jump to chapter ${ch.number}: ${ch.tag}`}
              >
                <span className="mono" style={{ color: 'var(--signal)', fontWeight: '700' }}>
                  {ch.number}
                </span>
                <span>{ch.tag.split('·')[1]?.trim()}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Chapters */}
      <div className="story-chapters-list">
        {chapters.map((ch, idx) => {
          /* Accent SVGs rotate through 3 decorative marks for visual rhythm */
          const accentSvgs = [
            /* Figma cursor spark */
            <svg key="cursor" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true" style={{ opacity: 0.55 }}>
              <path d="M10 6L10 38L19 29L25 45L30 43L24 27L36 27L10 6Z" fill="var(--signal)" stroke="var(--signal)" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="40" cy="10" r="3" fill="var(--signal)" opacity="0.6"/>
              <circle cx="46" cy="18" r="1.5" fill="var(--signal)" opacity="0.4"/>
              <circle cx="44" cy="4" r="1.5" fill="var(--signal)" opacity="0.4"/>
            </svg>,
            /* Wireframe phone */
            <svg key="phone" width="44" height="60" viewBox="0 0 44 60" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <rect x="3" y="3" width="38" height="54" rx="7" stroke="var(--signal)" strokeWidth="1.8"/>
              <rect x="10" y="12" width="24" height="4" rx="2" fill="var(--signal)" opacity="0.5"/>
              <rect x="10" y="20" width="24" height="8" rx="2" stroke="var(--signal)" strokeWidth="1.2" opacity="0.6"/>
              <rect x="10" y="32" width="10" height="3" rx="1.5" fill="var(--signal)" opacity="0.4"/>
              <rect x="10" y="37" width="24" height="3" rx="1.5" fill="var(--signal)" opacity="0.3"/>
              <rect x="10" y="42" width="16" height="3" rx="1.5" fill="var(--signal)" opacity="0.3"/>
              <circle cx="22" cy="7" r="2" fill="var(--signal)" opacity="0.4"/>
            </svg>,
            /* Sticky note + pencil */
            <svg key="note" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <rect x="4" y="8" width="36" height="36" rx="4" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8"/>
              <rect x="10" y="18" width="24" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.5"/>
              <rect x="10" y="24" width="20" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.4"/>
              <rect x="10" y="30" width="16" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.3"/>
              <path d="M36 38L46 28L49 31L39 41Z" fill="var(--signal)" opacity="0.7"/>
              <path d="M46 25L51 30L49 31L46 28Z" fill="var(--signal)"/>
              <path d="M36 38L38 44L40 39Z" fill="var(--signal)" opacity="0.5"/>
            </svg>,
            /* Speech bubble */
            <svg key="bubble" width="56" height="48" viewBox="0 0 56 48" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <rect x="2" y="2" width="46" height="34" rx="10" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8"/>
              <path d="M14 36L8 46L22 38" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M10 14 Q12 11 15 14 Q18 17 21 14 Q24 11 27 14 Q30 17 33 14" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
              <path d="M10 23 Q13 20 17 23 Q21 26 25 23" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
            </svg>,
            /* Loupe / search */
            <svg key="loupe" width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <circle cx="20" cy="20" r="14" stroke="var(--signal)" strokeWidth="2"/>
              <circle cx="20" cy="20" r="8" stroke="var(--signal)" strokeWidth="1.2" opacity="0.4"/>
              <line x1="30" y1="30" x2="46" y2="46" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="14" r="2.5" fill="var(--signal)" opacity="0.35"/>
            </svg>,
            /* Component / grid */
            <svg key="grid" width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <rect x="4" y="4" width="18" height="18" rx="4" stroke="var(--signal)" strokeWidth="1.8"/>
              <rect x="28" y="4" width="18" height="18" rx="4" fill="var(--signal)" opacity="0.25" stroke="var(--signal)" strokeWidth="1.8"/>
              <rect x="4" y="28" width="18" height="18" rx="4" fill="var(--signal)" opacity="0.25" stroke="var(--signal)" strokeWidth="1.8"/>
              <rect x="28" y="28" width="18" height="18" rx="4" stroke="var(--signal)" strokeWidth="1.8"/>
              <circle cx="13" cy="13" r="3" fill="var(--signal)" opacity="0.5"/>
              <circle cx="37" cy="37" r="3" fill="var(--signal)" opacity="0.5"/>
            </svg>,
          ];
          const accentSvg = accentSvgs[idx % accentSvgs.length];

          return (
            <section
              key={ch.id}
              id={ch.id}
              style={{
                scrollMarginTop: '110px',
                paddingTop: idx === 0 ? '36px' : 'clamp(56px, 7vw, 80px)',
                marginTop: idx === 0 ? '0' : 'clamp(40px, 5vw, 56px)',
                borderTop: '1px solid var(--line)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* Main chapter content */}
              <div style={{ maxWidth: '640px', minWidth: 0 }}>
                {/* Chapter Tag */}
                <div
                  className="mono"
                  style={{
                    color: 'var(--signal)',
                    fontWeight: '700',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  {ch.fullTag}
                </div>

                {/* Chapter Title */}
                <h3
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 'clamp(28px, 4.5vw, 40px)',
                    textTransform: 'uppercase',
                    lineHeight: 1.08,
                    letterSpacing: '0.02em',
                    color: 'var(--ink)',
                    margin: '0 0 20px',
                  }}
                >
                  {ch.title}
                </h3>

                {/* Scene Quote */}
                <blockquote
                  style={{
                    fontFamily: 'var(--f-name)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(22px, 3.2vw, 30px)',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 28px',
                    padding: '0 0 0 16px',
                    borderLeft: '2px solid var(--line)',
                  }}
                >
                  "{ch.scene}"
                </blockquote>

                {/* What I Do Block */}
                <div style={{ marginBottom: '28px' }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)',
                      marginBottom: '10px',
                    }}
                  >
                    WHAT I DO
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    {ch.whatIDo.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '17px',
                          lineHeight: 1.6,
                          color: 'var(--ink-2)',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '10px',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--signal)',
                            fontSize: '15px',
                            fontWeight: '700',
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The Question I Keep Asking */}
                <div
                  style={{
                    background: 'var(--sheet)',
                    border: '1px solid var(--line)',
                    borderLeft: '4px solid var(--signal)',
                    borderRadius: '0 12px 12px 0',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)',
                      marginBottom: '6px',
                    }}
                  >
                    THE QUESTION I KEEP ASKING
                  </div>
                  <p
                    style={{
                      fontSize: '17px',
                      lineHeight: 1.5,
                      color: 'var(--ink)',
                      fontWeight: '500',
                    }}
                  >
                    "{ch.question}"
                  </p>
                </div>

                {/* What It Taught Me */}
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)',
                      marginBottom: '6px',
                    }}
                  >
                    WHAT IT TAUGHT ME
                  </div>
                  <p
                    style={{
                      fontSize: '17px',
                      lineHeight: 1.6,
                      fontWeight: '600',
                      color: 'var(--ink)',
                    }}
                  >
                    {ch.lesson}
                  </p>
                </div>
              </div>

              {/* Right gutter accent — decorative SVG sticker, hidden on mobile */}
              <div
                className="thinking-chapter-accent"
                aria-hidden="true"
                style={{
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: '72px',
                  flexShrink: 0,
                }}
              >
                {accentSvg}
              </div>
            </section>
          );
        })}
      </div>

      {/* Section: How I use AI */}
      <section
        style={{
          marginTop: 'clamp(64px, 8vw, 96px)',
          paddingTop: 'clamp(48px, 6vw, 64px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div className="sh" style={{ marginBottom: '20px' }}>
            <h2>{ai.title}</h2>
            <span className="mono">{ai.label}</span>
          </div>
          <div
            style={{
              background: 'var(--sheet)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
            }}
          >
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: 'var(--ink-2)',
                margin: 0,
              }}
            >
              {ai.text}
            </p>
          </div>
        </div>
      </section>

      {/* Section: The rules I keep */}
      <section
        style={{
          marginTop: 'clamp(64px, 8vw, 96px)',
          paddingTop: 'clamp(48px, 6vw, 64px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div className="sh" style={{ marginBottom: '24px' }}>
            <h2>{rules.title}</h2>
            <span className="mono">{rules.label}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '36px',
            }}
          >
            {rules.items.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '14px 18px',
                  background: 'var(--sheet)',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', minWidth: 0 }}>
                  <span
                    className="mono"
                    style={{
                      color: 'var(--signal)',
                      fontWeight: '700',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {r.chapterNumber}
                  </span>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: 'var(--ink)',
                      lineHeight: 1.45,
                    }}
                  >
                    {r.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToChapter(r.chapterId)}
                  className="chapter-jump-btn"
                  aria-label={`Jump back to Chapter ${r.chapterNumber}`}
                >
                  <span>Ch. {r.chapterNumber}</span>
                  <span aria-hidden="true">↑</span>
                </button>
              </div>
            ))}
          </div>

          <div>
            <a className="textlink" href="#work">
              See these habits in my case studies →
            </a>
          </div>
        </div>
      </section>
    </article>
  );
};

export default ThinkingView;
