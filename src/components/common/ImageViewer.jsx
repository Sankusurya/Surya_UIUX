import React, { useState, useEffect, useRef, useCallback } from 'react';
import { resolveAssetUrl } from '../../data/initialData';

/**
 * Full-screen Lightbox & Zoom Viewer for Case Study Images
 * Features:
 * - 100% full original resolution viewing
 * - Zoom in / Zoom out / 1:1 Reset / Fit toggle
 * - Double-click / double-tap to toggle 2x zoom
 * - Pan/drag when zoomed
 * - Previous / Next navigation with arrow keys and touch swipe
 * - Escape key to close
 * - Mobile friendly with touch events
 */
export const ImageViewer = ({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNavigate
}) => {
  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState(true); // true = fit to viewport; false = 1:1 pixel view
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const containerRef = useRef(null);

  const currentImage = images[currentIndex];

  // Reset zoom and pan when image changes or viewer opens
  useEffect(() => {
    setZoom(1);
    setFitMode(true);
    setPan({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else if (images.length > 1) {
      onNavigate(images.length - 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    } else if (images.length > 1) {
      onNavigate(0);
    }
  }, [currentIndex, images.length, onNavigate]);

  const handleZoomIn = () => {
    setFitMode(false);
    setZoom((z) => Math.min(z + 0.5, 8));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 0.25);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setFitMode(true);
    setPan({ x: 0, y: 0 });
  };

  const handleOneToOne = () => {
    setFitMode(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleZoom = (e) => {
    e.stopPropagation();
    if (fitMode) {
      // First double-click: go to 1:1 natural size
      handleOneToOne();
    } else if (zoom < 2) {
      setZoom(2);
    } else {
      handleResetZoom();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if (e.key === '1') {
        handleOneToOne();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e) => {
    if (fitMode && zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || (fitMode && zoom <= 1)) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile swipe & pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      if (zoom > 1 || !fitMode) {
        setIsDragging(true);
        panStartRef.current = { ...pan };
      }
    }
  };

  const handleTouchMove = (e) => {
    if (zoom > 1 && isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (zoom <= 1 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dt = Date.now() - touchStartRef.current.time;
      // Fast swipe detected (>50px within 350ms)
      if (Math.abs(dx) > 50 && dt < 350) {
        if (dx < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    setIsDragging(false);
  };

  if (!isOpen || !currentImage) return null;

  const rawUrl = typeof currentImage === 'string' ? currentImage : currentImage.url;
  const imageUrl = resolveAssetUrl(rawUrl);
  const imageAlt = typeof currentImage === 'object' ? (currentImage.alt || currentImage.caption) : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image full screen viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
    >
      {/* Top Bar: Counter & Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Image Counter */}
        <div className="flex items-center gap-2 text-white/80 font-mono text-xs pl-2">
          <span className="font-semibold text-white">
            {currentIndex + 1}
          </span>
          <span className="opacity-50">/</span>
          <span>{images.length}</span>
          {imageAlt && (
            <span className="hidden sm:inline-block text-white/60 text-xs ml-3 border-l border-white/20 pl-3 max-w-md truncate">
              {imageAlt}
            </span>
          )}
        </div>

        {/* Toolbar: Zoom controls & Close */}
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!fitMode && zoom <= 0.25}
            title="Zoom Out (-)"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-base"
          >
            −
          </button>

          {/* Zoom label / reset */}
          <button
            type="button"
            onClick={handleResetZoom}
            title="Fit to screen (0)"
            className={`px-2.5 h-9 rounded-full text-white text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${
              fitMode ? 'bg-signal/50 ring-1 ring-signal' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {fitMode ? 'Fit' : `${Math.round(zoom * 100)}%`}
          </button>

          {/* 1:1 pixel button */}
          <button
            type="button"
            onClick={handleOneToOne}
            title="View at real pixel size (1)"
            className={`px-2.5 h-9 rounded-full text-white text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${
              !fitMode && zoom === 1 ? 'bg-signal/50 ring-1 ring-signal' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            1:1
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 8}
            title="Zoom In (+)"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-base"
          >
            +
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close viewer (Esc)"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer font-bold text-sm ml-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleToggleZoom}
      >
        <img
          src={imageUrl}
          alt={imageAlt || 'Full resolution case study design'}
          draggable={false}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: (!fitMode || zoom > 1) ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            // fitMode: constrain to viewport. 1:1 mode: no max constraints → natural pixels
            maxHeight: fitMode ? '92vh' : 'none',
            maxWidth: fitMode ? '94vw' : 'none',
            width: fitMode ? 'auto' : undefined,
            height: fitMode ? 'auto' : undefined,
          }}
          className="object-contain select-none"
        />
      </div>

      {/* Navigation Chevrons (Only if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Previous image (Left arrow)"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer text-lg shadow-lg"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Next image (Right arrow)"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer text-lg shadow-lg"
          >
            ›
          </button>
        </>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-white/50 text-[11px] font-mono text-center">
        Double-click for 1:1 pixel view · <kbd className="opacity-60">1</kbd> = real size · <kbd className="opacity-60">0</kbd> = fit · Esc to close
      </div>
    </div>
  );
};

export default ImageViewer;
