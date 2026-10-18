import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Cover } from '../common/Cover';
import { Tags } from '../common/Tags';
import { TodoText } from '../common/TodoText';

const CATEGORIES = ["All", "UX case study", "UI", "Web dev"];

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

      <div className="grid2" id="grid">
        {filteredProjects.map((p) => (
          <a key={p.slug} className="tile" href={`#case-${p.slug}`}>
            <Cover type={p.cover} title={p.title} coverImg={p.coverImg} />
            <Tags types={p.type} year={p.year} />
            <h3>{p.title}</h3>
            <p>
              <TodoText text={p.summary} />
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default WorkView;
