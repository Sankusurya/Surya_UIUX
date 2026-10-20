/**
 * Helper to safely resolve illustration and sticker asset URLs.
 * Handles spaces, commas, curly quotes, etc. through encodeURIComponent.
 */
export const ill = (name) => `${import.meta.env.BASE_URL}assets/illustrations/${encodeURIComponent(name)}`;
