import React from 'react';

export const Cover = ({
  type,
  title = '',
  coverImg = null,
  className = '',
  aspectRatio = '16/10',
}) => {
  const cleanCover = typeof coverImg === 'string'
    ? coverImg.trim()
    : (coverImg?.url || '');

  const aspectStyle = { aspectRatio };

  if (cleanCover) {
    return (
      <div
        className={`cover w-full overflow-hidden bg-sheet rounded-2xl border border-line relative ${className}`}
        style={aspectStyle}
        aria-hidden="true"
      >
        <img
          src={cleanCover}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center block transition-transform duration-300"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`cover w-full overflow-hidden bg-sheet/80 border border-line rounded-2xl p-6 sm:p-8 flex flex-col justify-end relative ${className}`}
      style={aspectStyle}
      aria-hidden="true"
    >
      <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-signal px-2 py-0.5 rounded-full border border-signal/20 bg-signal/10">
        Design Case Study
      </div>
      <span className="font-display text-xl sm:text-2xl uppercase tracking-wider text-ink font-extrabold leading-tight">
        {title || 'Project'}
      </span>
    </div>
  );
};

export default Cover;
