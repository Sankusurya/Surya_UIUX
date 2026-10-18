import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Cover = ({ type, title = '', coverImg = null, className = '' }) => {
  if (coverImg) {
    return (
      <div className={`overflow-hidden bg-sheet rounded-2xl border border-line ${className}`} aria-hidden="true">
        <img
          src={coverImg}
          alt={title}
          loading="lazy"
          className="w-full h-auto block mx-auto"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden bg-sheet/80 border border-line rounded-2xl p-8 sm:p-12 flex flex-col justify-end min-h-[220px] sm:min-h-[280px] relative ${className}`}
      aria-hidden="true"
    >
      <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-signal px-2 py-0.5 rounded-full border border-signal/20 bg-signal/10">
        Design Case Study
      </div>
      <span className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ink font-extrabold leading-tight">
        {title || 'Project'}
      </span>
    </div>
  );
};

export default Cover;
