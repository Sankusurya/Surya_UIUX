import React from 'react';
import { TodoText } from '../common/TodoText';
import { isTrustedEmbedUrl, getSafeEmbedUrl, getDomainFromUrl } from '../../utils/embedSecurity';
import { resolveAssetUrl } from '../../data/initialData';

/**
 * Slugifies text for section heading anchor IDs.
 */
export const slugifyHeading = (text) => {
  if (!text) return 'section';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const CaseStudyBlockRenderer = ({ block, index }) => {
  if (!block || !block.type) return null;

  switch (block.type) {
    case 'heading': {
      const anchorId = block.id || slugifyHeading(block.text);
      // Detect if there's a number prefix like "01." or "02." to accent with orange
      const matchNumber = block.text?.match(/^(\d+[\.\-\s]+)(.*)/);

      return (
        <div id={anchorId} className="cs-block-heading pt-6 pb-2 scroll-mt-28">
          <h2 className="font-display uppercase tracking-wider text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink leading-tight flex items-baseline flex-wrap gap-2">
            {matchNumber ? (
              <>
                <span className="text-signal font-mono text-xl sm:text-2xl mr-1">
                  {matchNumber[1]}
                </span>
                <span>{matchNumber[2]}</span>
              </>
            ) : (
              <span>{block.text}</span>
            )}
          </h2>
          {block.subtitle && (
            <p className="text-xs sm:text-sm font-mono text-signal uppercase tracking-wider mt-1.5">
              {block.subtitle}
            </p>
          )}
        </div>
      );
    }

    case 'paragraph': {
      const paragraphs = (block.text || '').split('\n\n').filter(Boolean);
      return (
        <div className="cs-block-paragraph max-w-2xl text-ink-2 text-base sm:text-lg leading-relaxed space-y-4">
          {paragraphs.map((pText, pIdx) => (
            <p key={pIdx}>
              <TodoText text={pText} />
            </p>
          ))}
        </div>
      );
    }

    case 'image': {
      return (
        <figure className="cs-block-image w-full max-w-4xl mx-auto my-6">
          <div className="rounded-2xl overflow-hidden border border-line bg-sheet shadow-sm">
            <img
              src={resolveAssetUrl(block.url)}
              alt={block.alt || block.caption || 'Case study illustration'}
              loading="lazy"
              className="w-full h-auto object-cover max-h-[640px]"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs sm:text-sm text-ink-3 text-center mt-2.5 font-mono italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'gallery': {
      const images = Array.isArray(block.images) ? block.images : [];
      if (images.length === 0) return null;

      // Determine column count: 2 columns for 2 images or 4, 3 columns for 3 or more
      const gridCols =
        images.length === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : images.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2';

      return (
        <div className="cs-block-gallery w-full max-w-4xl mx-auto my-6">
          <div className={`grid ${gridCols} gap-4`}>
            {images.map((img, imgIdx) => (
              <figure key={imgIdx} className="space-y-1.5 flex flex-col">
                <div className="rounded-xl overflow-hidden border border-line bg-sheet shadow-sm flex-1">
                  <img
                    src={resolveAssetUrl(img.url)}
                    alt={img.alt || img.caption || `Gallery image ${imgIdx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover min-h-[180px] max-h-[360px]"
                  />
                </div>
                {img.caption && (
                  <figcaption className="text-[11px] sm:text-xs text-ink-3 text-center font-mono">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          {block.caption && (
            <p className="text-xs text-ink-3 text-center mt-3 font-mono italic">
              {block.caption}
            </p>
          )}
        </div>
      );
    }

    case 'quote': {
      return (
        <blockquote className="cs-block-quote max-w-2xl my-6 pl-5 py-3 border-l-4 border-signal bg-sheet/40 rounded-r-xl">
          <p className="font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
            "{block.quote || block.text}"
          </p>
          {block.author && (
            <cite className="block not-italic text-xs font-mono uppercase tracking-wider text-signal mt-2 font-semibold">
              — {block.author}
            </cite>
          )}
        </blockquote>
      );
    }

    case 'metrics': {
      const items = Array.isArray(block.items) ? block.items : [];
      if (items.length === 0) return null;

      return (
        <div className="cs-block-metrics w-full max-w-4xl my-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((m, mIdx) => (
              <div
                key={mIdx}
                className="p-4 sm:p-5 rounded-xl border border-line bg-sheet/60 flex flex-col justify-between"
              >
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-signal tracking-wide leading-none">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm text-ink font-semibold mt-2.5 leading-snug">
                  {m.label}
                </div>
                {m.description && (
                  <div className="text-[11px] text-ink-3 mt-1 font-mono">
                    {m.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'embed': {
      const isTrusted = isTrustedEmbedUrl(block.url);
      const safeUrl = isTrusted ? getSafeEmbedUrl(block.url) : null;
      const domain = getDomainFromUrl(block.url);

      return (
        <figure className="cs-block-embed w-full max-w-4xl mx-auto my-6">
          <div className="rounded-2xl overflow-hidden border border-line bg-sheet shadow-sm relative">
            {isTrusted && safeUrl ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={safeUrl}
                  title={block.title || block.caption || 'Embedded Case Study Media'}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 bg-paper">
                <div className="text-2xl">🔒</div>
                <h4 className="font-semibold text-sm text-ink">External Resource</h4>
                <p className="text-xs text-ink-2 max-w-md mx-auto">
                  {domain
                    ? `Embedded content from "${domain}" is not in the whitelist for in-page iframe security.`
                    : 'Please provide a valid embed URL (YouTube, Vimeo, Figma, or prototype).'}
                </p>
                {block.url && (
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pill text-pill-ink text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Open Resource in New Tab ↗
                  </a>
                )}
              </div>
            )}
          </div>
          {block.caption && (
            <figcaption className="text-xs sm:text-sm text-ink-3 text-center mt-2.5 font-mono italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'divider': {
      return (
        <hr className="cs-block-divider border-0 border-t border-line my-10 w-full max-w-4xl mx-auto opacity-70" />
      );
    }

    default:
      return null;
  }
};
