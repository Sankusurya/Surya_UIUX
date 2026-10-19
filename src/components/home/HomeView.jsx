import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Cover } from '../common/Cover';
import { Tags } from '../common/Tags';
import { TodoText } from '../common/TodoText';
import { StepsGrid } from '../common/StepsGrid';
import { normalizeProject } from '../../data/initialData';

export const HomeView = () => {
  const { projects, profile, openResume } = usePortfolio();
  const featured = projects.slice(0, 3);

  const handleCaseStudiesClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('fw');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'work';
    }
  };

  return (
    <>
      <header className="hero hero-exact" id="hero">
        <div className="hero-left">
          {/* Availability Status Badge */}
          <div className="hero-status-pill motion-badge">
            <span className="hero-green-dot" aria-hidden="true"></span>
            <span className="hero-status-text">
              {profile.badge || profile.status || 'Available for Junior User Experience & UI Roles'}
            </span>
          </div>

          {/* Huge Typographic Title with Motion */}
          <h1 className="hero-title-lockup">
            <span className="hero-name motion-title-1">{profile.name || 'Surya Teja'}</span>
            <span className="hero-role-1 motion-title-2">{profile.roleLine1 || 'USER EXPERIENCE'}</span>
            <span className="hero-role-2 motion-title-3">{profile.roleLine2 || 'DESIGNER'}</span>
          </h1>
        </div>

        <div className="hero-right">
          {/* Pitch Paragraph */}
          <p className="hero-pitch motion-pitch">
            I turn messy product problems into{' '}
            <span className="hero-accent">
              {profile.highlightedPhrase || 'intuitive, battle-tested interfaces'}
            </span>{' '}
            that users understand on first tap — and I know how to build them in code.
          </p>

          {/* Metadata Grid */}
          <dl className="hero-meta-grid motion-meta">
            <div className="hero-meta-row">
              <dt>SPECIALIZATION</dt>
              <dd>
                {(profile.specialization ||
                  profile.focus ||
                  'Product Design, UX Research, UI Design, Interaction Design, AI-Powered Products').replace(/E-Commerce/g, 'Ecommerce')}
              </dd>
            </div>
            <div className="hero-meta-row">
              <dt>CORE TOOLKIT</dt>
              <dd>
                {profile.coreToolkit ||
                  profile.strengths ||
                  'Figma, FigJam, Prototyping, Design Systems, AI-Assisted Design Workflows'}
              </dd>
            </div>
            <div className="hero-meta-row">
              <dt>LOCATION</dt>
              <dd>
                {profile.location ||
                  profile.basedIn ||
                  'Andhra Pradesh, India · Open to Remote Opportunities & Relocation'}
              </dd>
            </div>
          </dl>

          {/* Action Buttons */}
          <div className="hero-actions motion-actions">
            <a
              href="#fw"
              onClick={handleCaseStudiesClick}
              className="hero-btn-primary"
            >
              View Case Studies ↓
            </a>
            <button
              type="button"
              onClick={openResume}
              className="hero-btn-secondary"
            >
              <span>View Resume</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="opacity-70"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </button>
          </div>

          {/* Background Link */}
          <div className="motion-actions">
            <a href="#about" className="hero-bg-link">
              My background →
            </a>
          </div>
        </div>
      </header>

      <section aria-labelledby="fw">
        <div className="sh">
          <h2 id="fw">Selected work</h2>
          <a className="textlink" href="#work">
            All projects ({projects.length}) →
          </a>
        </div>

        <div className="cards">
          {featured.map((rawP) => {
            const p = normalizeProject(rawP);
            return (
              <a key={p.slug} className="card group" href={`#case-${p.slug}`}>
                <Cover title={p.title} coverImg={p.coverImg} aspectRatio="16/10" />
                <div className="meta">
                  <Tags types={p.type} year={p.year} />
                  <h3 className="group-hover:text-signal transition-colors">{p.title}</h3>
                  {p.summary && (
                    <p>
                      <TodoText text={p.summary} />
                    </p>
                  )}
                  {p.outcome && (
                    <p className="outcome">
                      <b>Outcome · </b>
                      <TodoText text={p.outcome} />
                    </p>
                  )}
                  <span className="textlink">Read case study</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="hw">
        <div className="sh">
          <h2 id="hw">How I work</h2>
          <a className="textlink" href="#thinking">
            My design thinking →
          </a>
        </div>
        <StepsGrid />
      </section>
    </>
  );
};

export default HomeView;
