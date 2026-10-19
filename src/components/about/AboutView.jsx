import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TodoText } from '../common/TodoText';
import { resolveAssetUrl } from '../../data/initialData';

export const AboutView = () => {
  const { about, profile } = usePortfolio();

  return (
    <>
      <header className="about-top">
        <div style={{ display: 'grid', gap: '20px' }}>
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
                'A UI/UX designer who works end to end — from research and user flows to developer-ready screens — and uses AI-assisted coding to turn designs into working prototypes.'
              }
            />
          </p>
        </div>
        <div className="portrait">
          <img
            src={resolveAssetUrl(about.photo || 'assets/surya-teja.jpg')}
            alt={profile.name || 'Surya Teja'}
            className="about-portrait-img"
          />
        </div>
      </header>

      <section style={{ paddingTop: '8px' }}>
        <details open>
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

        <details>
          <summary>Design philosophy</summary>
          <div className="in">
            <p>
              <TodoText
                text={
                  about.philosophy ||
                  'I simplify, then I humanize. First I remove anything that makes people think harder than they need to. Then I add the small touches, like clear feedback and gentle motion, that make a product feel considerate.'
                }
              />
            </p>
            <a className="textlink" href="#thinking">
              Read my full design thinking →
            </a>
          </div>
        </details>

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
