/**
 * Draft Persistence System for Surya's Portfolio Project Editor
 * Automatically stores in-progress project forms in localStorage to prevent
 * accidental data loss on system reloads, tab navigation, or crashes.
 */

const STORAGE_KEY = 'surya_project_drafts_v2';

/**
 * Returns true if a project form has meaningful user-entered content
 */
export const hasProjectContent = (data) => {
  if (!data) return false;
  return Boolean(
    (data.title && data.title.trim()) ||
    (data.summary && data.summary.trim()) ||
    (data.role && data.role.trim()) ||
    (data.timeline && data.timeline.trim()) ||
    (data.tools && data.tools.trim()) ||
    (data.prototypeUrl && data.prototypeUrl.trim()) ||
    (data.caseStudyUrl && data.caseStudyUrl.trim()) ||
    (data.coverImg && typeof data.coverImg === 'string' && data.coverImg.trim()) ||
    (Array.isArray(data.images) && data.images.length > 0) ||
    (Array.isArray(data.type) && data.type.length > 1)
  );
};

/**
 * Loads the full draft store from localStorage
 */
export const getDraftStore = () => {
  if (typeof window === 'undefined') {
    return { activeKey: null, isEditorOpen: false, drafts: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { activeKey: null, isEditorOpen: false, drafts: {} };
    const parsed = JSON.parse(raw);
    return {
      activeKey: parsed.activeKey || null,
      isEditorOpen: Boolean(parsed.isEditorOpen),
      drafts: parsed.drafts || {},
    };
  } catch (err) {
    console.warn('Could not read project drafts from localStorage:', err);
    return { activeKey: null, isEditorOpen: false, drafts: {} };
  }
};

/**
 * Saves the draft store to localStorage
 */
const saveDraftStore = (store) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('Could not save project draft to localStorage:', err);
  }
};

/**
 * Saves or updates a draft for a specific key ('__new__' or a project slug)
 */
export const saveProjectDraft = (key, formData, isEditorOpen = true) => {
  const draftKey = key || '__new__';
  const store = getDraftStore();

  // If the form has no real user input, don't store an empty shell
  if (!hasProjectContent(formData)) {
    if (store.drafts[draftKey]) {
      delete store.drafts[draftKey];
    }
    if (store.activeKey === draftKey) {
      store.activeKey = null;
      store.isEditorOpen = isEditorOpen;
    }
    saveDraftStore(store);
    return null;
  }

  const draftEntry = {
    key: draftKey,
    editingSlug: draftKey === '__new__' ? null : draftKey,
    formData,
    title: (formData.title && formData.title.trim()) || 'Untitled Draft',
    updatedAt: Date.now(),
  };

  store.drafts[draftKey] = draftEntry;
  store.activeKey = draftKey;
  store.isEditorOpen = isEditorOpen;

  saveDraftStore(store);
  return draftEntry;
};

/**
 * Retrieves the currently active in-progress draft (if any exists)
 */
export const getActiveProjectDraft = () => {
  const store = getDraftStore();
  if (!store.activeKey) return null;
  const draft = store.drafts[store.activeKey];
  if (draft && hasProjectContent(draft.formData)) {
    return {
      ...draft,
      isEditorOpen: store.isEditorOpen,
    };
  }
  return null;
};

/**
 * Retrieves a specific draft by key
 */
export const getProjectDraft = (key) => {
  const draftKey = key || '__new__';
  const store = getDraftStore();
  const draft = store.drafts[draftKey];
  return draft && hasProjectContent(draft.formData) ? draft : null;
};

/**
 * Clears a specific draft (called when a project is saved/published or explicitly discarded)
 */
export const clearProjectDraft = (key) => {
  const draftKey = key || '__new__';
  const store = getDraftStore();

  if (store.drafts[draftKey]) {
    delete store.drafts[draftKey];
  }
  if (store.activeKey === draftKey) {
    store.activeKey = null;
    store.isEditorOpen = false;
  }

  saveDraftStore(store);
};

/**
 * Clears all drafts completely
 */
export const clearAllProjectDrafts = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {}
};

/**
 * Returns a list of all existing saved drafts
 */
export const getDraftsList = () => {
  const store = getDraftStore();
  return Object.values(store.drafts || {}).filter((d) => hasProjectContent(d.formData));
};
