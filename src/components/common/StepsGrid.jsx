import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const StepsGrid = () => {
  const { steps } = usePortfolio();

  return (
    <div className="steps">
      {steps.map((x, i) => {
        const num = String(x.n !== undefined ? x.n : i + 1).padStart(2, '0');
        return (
          <div key={i} className="step">
            <span className="n">{num}</span>
            <h3>{x.title || x[0]}</h3>
            <p>{x.desc || x[1]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StepsGrid;
