import React, { useState, useEffect, useRef } from 'react';
import { resolveAssetUrl } from '../../data/initialData';

/**
 * Full-Screen Case Study Continuous Reader
 *
 * Requirements:
 * - Shows the entire case study as ONE continuous image (or seamless vertical slice stack)
 * - Fitted to the width of the screen, scrolling vertically from top to bottom
 * - Smooth Zoom In, Zoom Out, and Fit Width controls
 * - Escape key to close, prominent Close button
 * - Touch pinch-to-zoom support for mobile phones
 */
export const CaseStudyFullScreenViewer = ({
  isOpen,
  onClose,
  slices = [],
  title = 'Case Study',
}) => {
  const [zoom, setZoom] = useState(1.0); // 1.0 = 100% width fit
  const scrollContainerRef = useRef(null);
  const touchStartRef = useRef({ distance: 0, initialZoom: 1.0 });

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1.0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom((z) => Math.min(3.0, Math.round((z + 0.25) * 100) / 100));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom((z) => Math.max(0.6, Math.round((z - 0.25) * 100) / 100));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Touch Pinch-to-Zoom handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { distance: dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartRef.current.distance > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / touchStartRef.current.distance;
      const newZoom = Math.min(3.0, Math.max(0.6, touchStartRef.current.initialZoom * factor));
      setZoom(Math.round(newZoom * 100) / 100);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = { distance: 0, initialZoom: zoom };
  };

  if (!isOpen || !slices || slices.length === 0) return null;

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Full-Screen Case Study`}
      className="fixed inset-0 z-[9999] bg-stone-950/98 backdrop-blur-md flex flex-col select-none text-white animate-in"
      style={{ touchAction: 'pan-x pan-y' }}
    >
      {/* 1. Header Toolbar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 border-b border-white/10 flex items-center justify-between bg-black/70 backdrop-blur-md z-20 shrink-0 gap-3">
        {/* Left: Title & Reader info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-signal/20 text-signal text-[10px] font-mono uppercase tracking-widest font-bold border border-signal/30">
            Case Study View
          </span>
          <h2 className="text-xs sm:text-sm font-semibold truncate text-stone-200">
            {title}
          </h2>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-2 bg-stone-900/90 border border-white/10 rounded-full px-2 py-1 shadow-inner">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, Math.round((z - 0.25) * 100) / 100))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors text-base font-bold disabled:opacity-30 cursor-pointer"
            title="Zoom Out (-)"
            disabled={zoom <= 0.6}
            aria-label="Zoom Out"
          >
            −
          </button>

          <button
            type="button"
            onClick={() => setZoom(1.0)}
            className="px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to Fit Width (0)"
          >
            {zoomPercent === 100 ? 'Fit Width' : `${zoomPercent}%`}
          </button>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3.0, Math.round((z + 0.25) * 100) / 100))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors text-base font-bold disabled:opacity-30 cursor-pointer"
            title="Zoom In (+)"
            disabled={zoom >= 3.0}
            aria-label="Zoom In"
          >
            +
          </button>
        </div>

        {/* Right: Close Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-signal text-white hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 border border-white/15 hover:border-signal"
            title="Close viewer (Esc)"
            aria-label="Close Case Study Viewer"
          >
            <span>✕</span>
            <span className="hidden sm:inline">Close</span>
            <kbd className="hidden md:inline-block ml-1 text-[10px] font-mono opacity-60">Esc</kbd>
          </button>
        </div>
      </header>

      {/* 2. Scrollable Body showing continuous case study top to bottom */}
      <main
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto overflow-x-auto w-full relative touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="mx-auto my-4 sm:my-8 transition-all duration-150 ease-out"
          style={{
            width: zoom === 1.0 ? '100%' : `${zoom * 100}%`,
            maxWidth: zoom === 1.0 ? '1120px' : 'none',
            padding: zoom === 1.0 ? '0 12px' : '0 4px',
          }}
        >
          {/* Continuous Stack Container */}
          <div
            className="w-full rounded-2xl border border-white/15 overflow-hidden bg-stone-900 shadow-2xl"
            style={{ lineHeight: 0 }}
          >
            {slices.map((slice, idx) => (
              <img
                key={slice.url || idx}
                src={resolveAssetUrl(slice.url)}
                alt={`${title} - Slice ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-auto block m-0 p-0 border-0 outline-none"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  verticalAlign: 'middle',
                  margin: 0,
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* End of case study indicator */}
          <div className="py-12 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400">
              <span>✦</span> End of Case Study <span>✦</span>
            </span>
            <div className="mt-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-stone-900 text-stone-200 hover:text-white hover:border-signal text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudyFullScreenViewer;
