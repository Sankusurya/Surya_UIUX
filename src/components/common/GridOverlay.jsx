import React, { useState, useEffect } from 'react';

/**
 * Figma-style layout grid overlay (12 columns on desktop, 8 on tablet, 4 on mobile).
 * Toggle with the "G" key or via the floating indicator.
 */
export const GridOverlay = () => {
  if (!import.meta.env.DEV) return null;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Visual Figma Grid Overlay */}
      {isVisible && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 flex justify-center"
        >
          <div
            className="w-full h-full"
            style={{
              maxWidth: 'var(--container-max, 1320px)',
              paddingLeft: 'var(--margin, 32px)',
              paddingRight: 'var(--margin, 32px)',
            }}
          >
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: 'repeat(var(--grid-columns, 12), minmax(0, 1fr))',
                columnGap: 'var(--gutter, 48px)',
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full relative"
                  style={{
                    backgroundColor: 'rgba(255, 90, 31, 0.08)',
                    borderLeft: '1px dashed rgba(255, 90, 31, 0.3)',
                    borderRight: '1px dashed rgba(255, 90, 31, 0.3)',
                  }}
                >
                  <span
                    className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold"
                    style={{ color: 'rgba(255, 90, 31, 0.7)' }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button (visible in corner for touch/click access) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider border shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
            isVisible
              ? 'bg-signal text-white border-signal'
              : 'bg-sheet/90 backdrop-blur-xs text-ink-3 hover:text-ink border-line hover:border-signal/50'
          }`}
          title="Toggle Figma Layout Grid (Shortcut: Press 'G')"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isVisible ? '#22c55e' : '#a8a29e' }} />
          <span>Figma Grid: {isVisible ? 'ON' : 'OFF'}</span>
          <kbd className="px-1 py-0.2 rounded border border-white/20 text-[9px] bg-black/10">G</kbd>
        </button>
      </div>
    </>
  );
};

export default GridOverlay;
