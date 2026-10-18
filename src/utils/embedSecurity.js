/**
 * Security and sanitization utility for embedded external content.
 * Enforces strict whitelist of trusted domains to protect against XSS and clickjacking.
 */

// Trusted domains allowed to be embedded in iframes
export const TRUSTED_EMBED_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  'figma.com',
  'www.figma.com',
  'rive.app',
  'my.spline.design',
  'framer.com',
  'framer.website',
  'codepen.io',
  'loom.com',
  'www.loom.com',
  'drive.google.com',
  'docs.google.com'
];

/**
 * Extracts hostname from a given URL string safely.
 */
export const getDomainFromUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return '';
  try {
    const parsed = new URL(urlString.trim());
    return parsed.hostname.toLowerCase();
  } catch {
    return '';
  }
};

/**
 * Checks if the given URL belongs to a trusted domain.
 */
export const isTrustedEmbedUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return false;
  const domain = getDomainFromUrl(urlString);
  if (!domain) return false;

  return TRUSTED_EMBED_DOMAINS.some(
    (trusted) => domain === trusted || domain.endsWith('.' + trusted)
  );
};

/**
 * Converts standard share links (like YouTube watch, Figma file, Vimeo)
 * into their appropriate, secure embed iframe URLs.
 */
export const getSafeEmbedUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return null;
  const trimmed = urlString.trim();

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    // YouTube transformations
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let videoId = null;
      if (host.includes('youtu.be')) {
        videoId = url.pathname.slice(1);
      } else if (url.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${url.pathname}${url.search}`;
      } else {
        videoId = url.searchParams.get('v');
      }

      if (videoId) {
        // Strip any trailing non-id chars
        const cleanId = videoId.split('&')[0].split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(cleanId)}?rel=0`;
      }
    }

    // Vimeo transformations
    if (host.includes('vimeo.com')) {
      if (host.includes('player.vimeo.com')) {
        return trimmed;
      }
      const parts = url.pathname.split('/').filter(Boolean);
      const videoId = parts[parts.length - 1];
      if (/^\d+$/.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // Figma transformations
    if (host.includes('figma.com')) {
      if (url.pathname.startsWith('/embed')) {
        return trimmed;
      }
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(trimmed)}`;
    }

    // Google Drive / Docs PDF Viewer
    if (host.includes('drive.google.com') && url.pathname.includes('/file/d/')) {
      const match = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // Direct PDF URL
    if (trimmed.toLowerCase().endsWith('.pdf')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
    }

    // For other trusted domains already configured as embeds (Spline, Rive, Codepen, Framer)
    return trimmed;
  } catch {
    return null;
  }
};
