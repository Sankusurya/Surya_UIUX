import React, { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TodoText } from '../common/TodoText';
import { resolveAssetUrl } from '../../data/initialData';

// Helper for exact illustration and sticker URLs
const ill = (name) => `${import.meta.env.BASE_URL}assets/illustrations/${encodeURIComponent(name)}`;

export const AboutView = () => {
  const { about, profile } = usePortfolio();

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

  return (
    <>
      <header className="about-top" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gap: '20px', position: 'relative' }}>
          {/* Curly Arrow Doodle: empty area above "← Home", pointing toward photo */}
          <img
            src={ill("Orange “That’s Me!” Curly Arrow Doodle.png")}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="160"
            height="160"
            className="about-hero-arrow"
            style={{
              position: 'absolute',
              top: '-36px',
              right: '10px',
              width: '160px',
              height: 'auto',
              transform: 'rotate(-6deg)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 5,
            }}
          />

          <a className="back" href="#home">
            ← Home
          </a>
          <h1>
            Hi, I'm <span>{profile.name || 'Surya Teja'}</span>
          </h1>
          <p
            style={{
              fontSize: '20px',
              lineHeight: 1.45,
              color: 'var(--ink-2)',
              maxWidth: '560px',
            }}
          >
            <TodoText
              text={
                about.bio ||
                'A UI/UX designer who makes design decisions and iterates on user and stakeholder feedback until the product is ready to use.'
              }
            />
          </p>
        </div>

        {/* Photo with peeking stickers */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px', marginLeft: 'auto' }}>
          {/* Top-right: Orange Pen Tool Sticker */}
          <img
            src={ill("Orange Pen Tool Sticker Icon.png")}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="90"
            height="90"
            className="sticker-img"
            style={{
              top: '-20px',
              right: '-20px',
              width: '90px',
              height: 'auto',
              '--base-rot': 'rotate(10deg)',
              transform: 'rotate(10deg)',
            }}
          />

          {/* Bottom-left: Orange Grade A Award Badge */}
          <img
            src={ill("Orange Grade A Award Badge.png")}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="110"
            height="110"
            className="sticker-img"
            style={{
              bottom: '-24px',
              left: '-24px',
              width: '110px',
              height: 'auto',
              '--base-rot': 'rotate(-8deg)',
              transform: 'rotate(-8deg)',
            }}
          />

          <div className="portrait">
            <img
              src={resolveAssetUrl(about.photo || 'assets/surya-teja.jpg')}
              alt={profile.name || 'Surya Teja'}
              className="about-portrait-img"
            />
          </div>
        </div>
      </header>

      {/* Decorative UX illustration strip — wraps on tablet and hides on small screens */}
      <div
        aria-hidden="true"
        className="about-process-icons"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 3.5vw, 40px)',
          padding: '24px 0 12px',
          flexWrap: 'wrap',
          overflow: 'hidden',
        }}
      >
        {/* Cursor spark */}
        <svg width="48" height="48" viewBox="0 0 52 52" fill="none" style={{ opacity: 0.45, flexShrink: 0 }}>
          <path d="M10 6L10 38L19 29L25 45L30 43L24 27L36 27L10 6Z" fill="var(--signal)" stroke="var(--signal)" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="40" cy="10" r="3" fill="var(--signal)" opacity="0.7"/>
          <circle cx="46" cy="18" r="1.5" fill="var(--signal)" opacity="0.45"/>
          <circle cx="44" cy="4" r="1.5" fill="var(--signal)" opacity="0.45"/>
        </svg>

        {/* Dotted connector */}
        <svg width="60" height="4" viewBox="0 0 60 4" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
          <line x1="0" y1="2" x2="60" y2="2" stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 5"/>
        </svg>

        {/* Wireframe phone */}
        <svg width="38" height="52" viewBox="0 0 44 60" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
          <rect x="3" y="3" width="38" height="54" rx="7" stroke="var(--signal)" strokeWidth="1.8"/>
          <rect x="10" y="12" width="24" height="4" rx="2" fill="var(--signal)" opacity="0.5"/>
          <rect x="10" y="20" width="24" height="8" rx="2" stroke="var(--signal)" strokeWidth="1.2" opacity="0.6"/>
          <rect x="10" y="32" width="24" height="3" rx="1.5" fill="var(--signal)" opacity="0.3"/>
          <rect x="10" y="38" width="16" height="3" rx="1.5" fill="var(--signal)" opacity="0.25"/>
          <circle cx="22" cy="7" r="2" fill="var(--signal)" opacity="0.4"/>
        </svg>

        {/* Dotted connector */}
        <svg width="60" height="4" viewBox="0 0 60 4" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
          <line x1="0" y1="2" x2="60" y2="2" stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 5"/>
        </svg>

        {/* Sticky note + pencil */}
        <svg width="48" height="48" viewBox="0 0 52 52" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
          <rect x="4" y="8" width="36" height="36" rx="4" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8"/>
          <rect x="10" y="18" width="24" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.5"/>
          <rect x="10" y="24" width="20" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.4"/>
          <rect x="10" y="30" width="14" height="2.5" rx="1.25" fill="var(--signal)" opacity="0.3"/>
          <path d="M36 38L46 28L49 31L39 41Z" fill="var(--signal)" opacity="0.7"/>
          <path d="M46 25L51 30L49 31L46 28Z" fill="var(--signal)"/>
          <path d="M36 38L38 44L40 39Z" fill="var(--signal)" opacity="0.5"/>
        </svg>

        {/* Dotted connector */}
        <svg width="60" height="4" viewBox="0 0 60 4" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
          <line x1="0" y1="2" x2="60" y2="2" stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 5"/>
        </svg>

        {/* Component grid */}
        <svg width="48" height="48" viewBox="0 0 50 50" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
          <rect x="4" y="4" width="18" height="18" rx="4" stroke="var(--signal)" strokeWidth="1.8"/>
          <rect x="28" y="4" width="18" height="18" rx="4" fill="var(--signal)" opacity="0.2" stroke="var(--signal)" strokeWidth="1.8"/>
          <rect x="4" y="28" width="18" height="18" rx="4" fill="var(--signal)" opacity="0.2" stroke="var(--signal)" strokeWidth="1.8"/>
          <rect x="28" y="28" width="18" height="18" rx="4" stroke="var(--signal)" strokeWidth="1.8"/>
          <circle cx="13" cy="13" r="3" fill="var(--signal)" opacity="0.5"/>
          <circle cx="37" cy="37" r="3" fill="var(--signal)" opacity="0.5"/>
        </svg>

        {/* Dotted connector */}
        <svg width="60" height="4" viewBox="0 0 60 4" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
          <line x1="0" y1="2" x2="60" y2="2" stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 5"/>
        </svg>

        {/* Speech bubble */}
        <svg width="52" height="44" viewBox="0 0 56 48" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
          <rect x="2" y="2" width="46" height="34" rx="10" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8"/>
          <path d="M14 36L8 46L22 38" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M10 14 Q12 11 15 14 Q18 17 21 14 Q24 11 27 14 Q30 17 33 14" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M10 23 Q13 20 17 23 Q21 26 25 23" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>

        {/* Loupe */}
        <svg width="60" height="4" viewBox="0 0 60 4" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
          <line x1="0" y1="2" x2="60" y2="2" stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 5"/>
        </svg>

        <svg width="46" height="46" viewBox="0 0 50 50" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
          <circle cx="20" cy="20" r="14" stroke="var(--signal)" strokeWidth="2"/>
          <circle cx="20" cy="20" r="8" stroke="var(--signal)" strokeWidth="1.2" opacity="0.4"/>
          <line x1="30" y1="30" x2="46" y2="46" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="14" r="2.5" fill="var(--signal)" opacity="0.35"/>
        </svg>
      </div>

      <section style={{ paddingTop: '8px' }}>
        {/* 2. "Background" section — 2-column layout with .frame-card + Chai sticker */}
        <div className="ill-section-grid" style={{ borderTop: '1px solid var(--line)', paddingBlock: '4px' }}>
          <div className="ill-text-col">
            <details open style={{ border: 'none', padding: 0 }}>
              <summary>Background</summary>
              <div className="in">
                {about.background && Array.isArray(about.background) ? (
                  about.background.map((p, i) => (
                    <p key={i}>
                      <TodoText text={p} />
                    </p>
                  ))
                ) : (
                  <p>
                    <TodoText text={about.background} />
                  </p>
                )}
              </div>
            </details>
          </div>
          <div className="ill-frame-col">
            <div className="ill-frame frame-card ill-reveal">
              <img
                src={ill("Orange Cable to Smartphone Schematic.png")}
                className="ill-img"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="380"
                height="475"
              />
              <img
                src={ill("Powered by Chai Sticker.png")}
                className="sticker-img"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="100"
                height="100"
                style={{
                  bottom: '-24px',
                  right: '-24px',
                  width: '100px',
                  height: 'auto',
                  '--base-rot': 'rotate(6deg)',
                  transform: 'rotate(6deg)',
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. "Design philosophy" section — 2-column layout with .frame-circle + Less But Better sticker */}
        <div className="ill-section-grid" style={{ borderTop: '1px solid var(--line)', paddingBlock: '4px' }}>
          <div className="ill-text-col">
            <details open style={{ border: 'none', padding: 0 }}>
              <summary>Design philosophy</summary>
              <div className="in">
                {about.philosophy && Array.isArray(about.philosophy) ? (
                  about.philosophy.map((p, i) => (
                    <p key={i}>
                      <TodoText text={p} />
                    </p>
                  ))
                ) : (
                  <p>
                    <TodoText text={about.philosophy} />
                  </p>
                )}
                <a className="textlink" href="#thinking">
                  Read my full design thinking →
                </a>
              </div>
            </details>
          </div>
          <div className="ill-frame-col">
            <div className="ill-frame frame-circle ill-reveal">
              <img
                src={ill("Orange Sticky Note Magnifier Sketch.png")}
                className="ill-img"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="360"
                height="360"
              />
              <img
                src={ill("Less, But Better Sticker.png")}
                className="sticker-img"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="130"
                height="130"
                style={{
                  top: '16px',
                  left: '-48px',
                  width: '130px',
                  height: 'auto',
                  '--base-rot': 'rotate(-5deg)',
                  transform: 'rotate(-5deg)',
                }}
              />
            </div>
          </div>
        </div>

        <details>
          <summary>Experience</summary>
          <div className="in">
            <div className="timeline">
              {about.experience &&
                about.experience.map((exp, i) => (
                  <div key={i} className="tl">
                    <b>
                      <TodoText text={exp.role} />
                    </b>
                    <span>
                      <TodoText text={exp.period} />
                    </span>
                    <p>
                      <TodoText text={exp.desc} />
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </details>

        <details>
          <summary>Tools I use</summary>
          <div className="in">
            <div className="tools">
              {(about.tools || []).map((t, i) => (
                <span key={i} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </details>

        <details>
          <summary>Things I love</summary>
          <div className="in">
            <p>
              <TodoText text={about.interests} />
            </p>
          </div>
        </details>
      </section>
    </>
  );
};

export default AboutView;
