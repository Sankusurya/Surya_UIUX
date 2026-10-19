import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { StepsGrid } from '../common/StepsGrid';
import { TodoText } from '../common/TodoText';

export const ThinkingView = () => {
  const { principles } = usePortfolio();

  return (
    <>
      <section style={{ paddingTop: '24px' }}>
        <div className="sh">
          <h2>Design thinking</h2>
          <span className="mono">How I make decisions</span>
        </div>
        <p
          className="read"
          style={{ fontSize: '20px', lineHeight: 1.45, marginBottom: '40px' }}
        >
          My process is simple to say and hard to skip: understand user needs,
          define the core problem, explore multiple directions, prototype and test early,
          and refine for clear developer handoff.
        </p>
        <StepsGrid />
      </section>

      <section>
        <div className="sh">
          <h2>Principles</h2>
          <span className="mono">With proof from my work</span>
        </div>
        <div className="principles">
          {principles.map((x, i) => (
            <div key={i} className="pr">
              <h3>{x.title}</h3>
              <div className="ev">
                <p>
                  <TodoText text={x.statement} />
                </p>
                <small>In practice</small>
                <p>
                  <TodoText text={x.practice} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ThinkingView;
