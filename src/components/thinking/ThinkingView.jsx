import React, { useEffect } from 'react';
import { THINKING_STORY } from '../../data/initialData';

// Helper for exact illustration and sticker URLs
const ill = (name) => `${import.meta.env.BASE_URL}assets/illustrations/${encodeURIComponent(name)}`;

// Chapter illustration and sticker metadata
const CHAPTER_VISUALS = [
  {
    // Chapter 01 - Listen
    frame: 'frame-card',
    image: 'Orange Speech Bubbles with App Feedback.png',
    sticker: null,
  },
  {
    // Chapter 02 - Frame
    frame: 'frame-circle',
    image: 'One Clear Idea Among Many.png',
    sticker: {
      name: 'Orange Pencil Scribble Sticker.png',
      width: '90px',
      position: { bottom: '24px', left: '-24px' },
      rotate: '8deg',
    },
  },
  {
    // Chapter 03 - Explore
    frame: 'frame-arch',
    image: 'Orange Wireframe App Screens Emphasis-2.png',
    sticker: {
      name: 'Hick’s Law UI Sticker.png',
      width: '120px',
      position: { top: '-24px', right: '-24px' },
      rotate: '-6deg',
    },
  },
  {
    // Chapter 04 - Check
    frame: 'frame-card',
    image: 'Hesitant Choice on Smartphone.png',
    sticker: {
      name: 'Test It Sticker Badge.png',
      width: '110px',
      position: { bottom: '-24px', right: '-24px' },
      rotate: '5deg',
    },
  },
  {
    // Chapter 05 - Rethink
    frame: 'frame-circle',
    image: 'Orange Customer Support Exchange Icon.png',
    sticker: null,
  },
  {
    // Chapter 06 - Hand off
    frame: 'frame-arch',
    image: 'Wireframe to Code Transfer.png',
    sticker: {
      name: 'Ship It Rocket Sticker.png',
      width: '120px',
      position: { top: '-24px', left: '-24px' },
      rotate: '-7deg',
    },
  },
];

export const ThinkingView = () => {
  const { header, chapters, ai, rules } = THINKING_STORY;

  // Scroll reveal IntersectionObserver for frames
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const elements = document.querySelectorAll('.ill-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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

      {/* Chapters (vertical gap reduced by half so frames sit closer) */}
      <div className="story-chapters-list">
        {chapters.map((ch, idx) => {
          const visual = CHAPTER_VISUALS[idx] || CHAPTER_VISUALS[0];

          return (
            <section
              key={ch.id}
              id={ch.id}
              className="ill-section-grid"
              style={{
                scrollMarginTop: '110px',
                paddingTop: idx === 0 ? '24px' : 'clamp(28px, 3.5vw, 40px)',
                marginTop: idx === 0 ? '0' : 'clamp(20px, 2.5vw, 28px)',
                borderTop: '1px solid var(--line)',
              }}
            >
              {/* Left Column: Text Content (~60%, max-width 640px) */}
              <div className="ill-text-col">
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

              {/* Right Column: Frame + Sticker (~40%, sticky top 120px on desktop) */}
              <div className="ill-frame-col">
                <div className={`ill-frame ${visual.frame} ill-reveal`}>
                  <img
                    src={ill(visual.image)}
                    className="ill-img"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={visual.frame === 'frame-circle' ? '360' : '380'}
                    height={visual.frame === 'frame-circle' ? '360' : '475'}
                  />
                  {visual.sticker && (
                    <img
                      src={ill(visual.sticker.name)}
                      className="sticker-img"
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      width={parseInt(visual.sticker.width, 10)}
                      height={parseInt(visual.sticker.width, 10)}
                      style={{
                        ...visual.sticker.position,
                        width: visual.sticker.width,
                        height: 'auto',
                        '--base-rot': `rotate(${visual.sticker.rotate})`,
                        transform: `rotate(${visual.sticker.rotate})`,
                      }}
                    />
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Section: How I use AI */}
      <section
        className="ill-section-grid"
        style={{
          marginTop: 'clamp(48px, 6vw, 72px)',
          paddingTop: 'clamp(36px, 5vw, 52px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="ill-text-col">
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

        <div className="ill-frame-col">
          <div className="ill-frame frame-card ill-reveal" style={{ width: '400px' }}>
            <img
              src={ill("Collaborative AI UX Sketching.png")}
              className="ill-img"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="400"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* Section: The rules I keep */}
      <section
        className="ill-section-grid"
        style={{
          marginTop: 'clamp(48px, 6vw, 72px)',
          paddingTop: 'clamp(36px, 5vw, 52px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="ill-text-col">
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

        <div className="ill-frame-col">
          <div className="ill-frame frame-polaroid ill-reveal" style={{ width: '360px' }}>
            <img
              src={ill("Orange Concept Map Corkboard.png")}
              className="ill-img"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="360"
              height="270"
            />
          </div>
        </div>
      </section>
    </article>
  );
};

export default ThinkingView;
