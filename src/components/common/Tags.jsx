import React from 'react';

export const Tags = ({ types = [], year }) => {
  return (
    <div className="tags">
      {types.map((t, i) => (
        <span key={i} className={`tag${i === 0 ? ' k' : ''}`}>
          {t}
        </span>
      ))}
      {year && <span className="tag">{year}</span>}
    </div>
  );
};

export default Tags;
