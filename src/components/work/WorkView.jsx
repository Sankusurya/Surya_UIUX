import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { normalizeProject } from '../../data/initialData';

const CATEGORIES = ["All", "UX case study", "UI", "Web dev"];

const formatCategoryYear = (p) => {
  let category = '';
  if (p.category && typeof p.category === 'string') {
    category = p.category.trim();
  } else if (Array.isArray(p.type) && p.type.length > 0) {
    category = String(p.type[0] || '').trim();
  } else if (typeof p.type === 'string') {
    category = p.type.trim();
  }

  // Normalize common categories to clean Title Case
  if (category.toLowerCase() === 'ux case study') {
    category = 'UX Case Study';
  } else if (category.toLowerCase() === 'ui') {
    category = 'UI';
  } else if (category.toLowerCase() === 'web dev') {
    category = 'Web Dev';
  }

  const year = p.year ? String(p.year).trim() : '';

  if (category && year) {
    return `${category} · ${year}`;
  }
  return category || year || '';
};

export const WorkView = () => {
  const { projects, activeFilter, setActiveFilter } = usePortfolio();

  const filteredProjects = projects.filter(
    (p) => activeFilter === "All" || (p.type && p.type.includes(activeFilter))
  );

  return (
    <section style={{ paddingTop: '24px' }}>
      <div className="sh">
        <h2>All work</h2>
        <span className="mono" id="count">
          {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="filters" role="group" aria-label="Filter projects">
        {CATEGORIES.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={activeFilter === k}
            onClick={() => setActiveFilter(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="work-grid" id="grid">
        {filteredProjects.map((rawP) => {
          const p = normalizeProject(rawP);
          const rawCover = p.coverImg || p.coverImage || p.cover_img || '';
          const cleanCover = typeof rawCover === 'object' && rawCover !== null
            ? (rawCover.url || '')
            : String(rawCover || '').trim();
          const hasCover = Boolean(cleanCover && !cleanCover.startsWith('data:image/svg+xml'));
          const categoryYear = formatCategoryYear(p);

          return (
            <a
              key={p.slug}
              className="work-card"
              href={`#case-${p.slug}`}
              aria-label={`${p.title}${categoryYear ? ` — ${categoryYear}` : ''}`}
            >
              <div className="work-card-media">
                {hasCover ? (
                  <img
                    src={cleanCover}
                    alt={p.title}
                    loading="lazy"
                    className="work-card-img"
                  />
                ) : (
                  <div className="work-card-placeholder" aria-hidden="true">
                    <svg
                      className="work-card-placeholder-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="work-card-meta">
                <h3 className="work-card-title">{p.title}</h3>
                {categoryYear && (
                  <div className="work-card-sub">{categoryYear}</div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default WorkView;
