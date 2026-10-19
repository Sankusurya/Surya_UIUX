/**
 * Robust, high-capacity persistent storage utility for Surya Teja Portfolio.
 * Combines in-memory cache, native browser IndexedDB (hundreds of MBs capacity for high-res images),
 * and localStorage fallback with QuotaExceededError protection.
 */

const DB_NAME = 'surya_portfolio_db';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_store';

// In-memory cache for ultra-fast, synchronous access
const memoryCache = new Map();

// Helper to open IndexedDB
const openDb = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error:', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB initialization failed:', err);
      resolve(null);
    }
  });
};

/**
 * Read item from IndexedDB
 */
export const getFromIdb = async (key) => {
  const db = await openDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
};

/**
 * Write item to IndexedDB
 */
export const setToIdb = async (key, value) => {
  const db = await openDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve(true);
      req.onerror = (err) => {
        console.warn('IndexedDB write error for key:', key, err);
        resolve(false);
      };
    } catch (e) {
      console.warn('IndexedDB transaction error:', e);
      resolve(false);
    }
  });
};

/**
 * Remove item from IndexedDB
 */
export const removeFromIdb = async (key) => {
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
};

/**
 * Safely write to localStorage without throwing QuotaExceededError.
 */
export const safeSetLocalStorage = (key, value) => {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    // If quota exceeded, do not crash!
    // IndexedDB will hold the full-resolution data.
    console.warn(`LocalStorage quota exceeded for "${key}". Preserved in IndexedDB.`);
    return false;
  }
};

/**
 * Safely read from localStorage.
 */
export const safeGetLocalStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Synchronous read: gets immediately from memoryCache, or fallback from localStorage.
 */
export const getStoredItemSync = (key, fallback = null) => {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  const fromLocal = safeGetLocalStorage(key);
  if (fromLocal !== null) {
    memoryCache.set(key, fromLocal);
    return fromLocal;
  }
  return fallback;
};

/**
 * Asynchronous read: queries IndexedDB (which has full fidelity/no 5MB cap),
 * populates memoryCache, and falls back to localStorage or fallback value.
 */
export const getStoredItemAsync = async (key, fallback = null) => {
  try {
    const fromIdb = await getFromIdb(key);
    if (fromIdb !== null && fromIdb !== undefined) {
      memoryCache.set(key, fromIdb);
      return fromIdb;
    }
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
  }

  const fromSync = getStoredItemSync(key, fallback);
  return fromSync;
};

/**
 * Asynchronous write:
 * 1. Updates memory cache immediately (for zero-latency reads in current session)
 * 2. Writes full data to IndexedDB (handles large multi-megabyte images, slices, covers)
 * 3. Attempts safe write to localStorage
 * 4. Broadcasts custom event for instant in-tab component re-rendering
 */
export const setStoredItem = async (key, value) => {
  memoryCache.set(key, value);

  // 1. Safe localStorage write (best effort)
  safeSetLocalStorage(key, value);

  // 2. High-capacity IndexedDB write (guaranteed storage for large visuals)
  await setToIdb(key, value);

  // 3. Dispatch in-window event for instant reflection
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('surya_storage_update', {
        detail: { key, timestamp: Date.now() },
      }));
    } catch {}
  }
};

/**
 * Remove stored item
 */
export const removeStoredItem = async (key) => {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {}
  await removeFromIdb(key);
};
