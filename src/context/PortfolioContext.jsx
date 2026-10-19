import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  DEFAULT_PROJECTS,
  DEFAULT_PROFILE,
  DEFAULT_STEPS,
  DEFAULT_PRINCIPLES,
  DEFAULT_ABOUT,
  normalizeProject
} from '../data/initialData';

import {
  supabase,
  isSupabaseConfigured,
  ALLOWED_ADMIN_EMAIL,
  hashPassword,
  DEFAULT_PROTECTED_HASH
} from '../lib/supabase';

import {
  fetchCloudContent,
  saveCloudContent,
  seedCloudDatabase,
  fetchCloudMessages,
  saveCloudMessage,
  markCloudMessageRead,
  deleteCloudMessage
} from '../services/portfolioDb';

import { sendContactEmail } from '../services/emailService';
import {
  getStoredItemSync,
  getStoredItemAsync,
  setStoredItem,
  removeStoredItem
} from '../utils/persistentStorage';

const PortfolioContext = createContext(null);
export const REGISTERED_ADMIN_EMAIL = ALLOWED_ADMIN_EMAIL;

// Setup cross-tab sync channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('surya_portfolio_sync')
  : null;

export const PortfolioProvider = ({ children }) => {
  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('surya_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Global Toast State
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message, detail = '', duration = 5000) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message, detail, id: Date.now() });
    if (duration > 0) {
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, duration);
    }
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(null);
  };

  // Routing
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash.slice(1) || 'home';
  });

  // Selected filter on work page
  const [activeFilter, setActiveFilter] = useState('All');

  // Stored Data with Multi-Tier Persistence (IndexedDB + LocalStorage)
  const [projects, setProjects] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_projects');
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved.map(normalizeProject);
      }
      return DEFAULT_PROJECTS.map(normalizeProject);
    } catch {
      return DEFAULT_PROJECTS.map(normalizeProject);
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_profile');
      if (saved) {
        return {
          ...DEFAULT_PROFILE,
          ...saved,
          email: (saved.email && saved.email !== 'sankusurya@gmail.com') ? saved.email : DEFAULT_PROFILE.email,
          roleLine1: saved.roleLine1 && saved.roleLine1 !== 'UX/UI' && saved.roleLine1 !== 'PRODUCT' ? saved.roleLine1 : DEFAULT_PROFILE.roleLine1,
          roleLine2: saved.roleLine2 && saved.roleLine2 !== 'Designer' ? saved.roleLine2 : DEFAULT_PROFILE.roleLine2,
          name: saved.name && saved.name !== 'Surya' ? saved.name : DEFAULT_PROFILE.name,
          badge: saved.badge && !saved.badge.includes('Product Roles') ? saved.badge : DEFAULT_PROFILE.badge,
          specialization: (saved.specialization ? saved.specialization.replace(/E-Commerce/g, 'Ecommerce') : DEFAULT_PROFILE.specialization),
          coreToolkit: saved.coreToolkit || DEFAULT_PROFILE.coreToolkit,
          location: saved.location || DEFAULT_PROFILE.location,
          lead: saved.lead || DEFAULT_PROFILE.lead,
          highlightedPhrase: saved.highlightedPhrase || DEFAULT_PROFILE.highlightedPhrase,
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [steps, setSteps] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_steps');
      return saved || DEFAULT_STEPS;
    } catch {
      return DEFAULT_STEPS;
    }
  });

  const [principles, setPrinciples] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_principles');
      return saved || DEFAULT_PRINCIPLES;
    } catch {
      return DEFAULT_PRINCIPLES;
    }
  });

  const [about, setAbout] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_about');
      return saved || DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  // Contact form messages storage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = getStoredItemSync('surya_portfolio_messages');
      return saved || [];
    } catch {
      return [];
    }
  });

  // Cloud Data & IndexedDB Synchronization on Initial Load
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      // 1. Immediately hydrate from full-capacity IndexedDB (loads high-res images & covers without quota cap)
      try {
        const idbProjects = await getStoredItemAsync('surya_portfolio_projects');
        if (idbProjects && Array.isArray(idbProjects) && idbProjects.length > 0 && isMounted) {
          setProjects(idbProjects.map(normalizeProject));
        }

        const idbProfile = await getStoredItemAsync('surya_portfolio_profile');
        if (idbProfile && isMounted) {
          const merged = { ...idbProfile };
          if (merged.roleLine1 === 'PRODUCT') merged.roleLine1 = 'USER EXPERIENCE';
          if (merged.badge && merged.badge.includes('Product Roles')) {
            merged.badge = merged.badge.replace('Product Roles', 'User Experience Roles');
          }
          setProfile((prev) => ({ ...prev, ...merged }));
        }

        const idbSteps = await getStoredItemAsync('surya_portfolio_steps');
        if (idbSteps && isMounted) setSteps(idbSteps);

        const idbPrinciples = await getStoredItemAsync('surya_portfolio_principles');
        if (idbPrinciples && isMounted) setPrinciples(idbPrinciples);

        const idbAbout = await getStoredItemAsync('surya_portfolio_about');
        if (idbAbout && isMounted) setAbout(idbAbout);

        const idbMessages = await getStoredItemAsync('surya_portfolio_messages');
        if (idbMessages && isMounted) setMessages(idbMessages);
      } catch (e) {
        console.warn('Notice hydrating from local database:', e);
      }

      // 2. Hydrate from Cloud database if configured
      try {
        if (isSupabaseConfigured) {
          const cloudContent = await fetchCloudContent();
          if (!isMounted) return;

          if (cloudContent) {
            if (cloudContent.projects && Array.isArray(cloudContent.projects)) {
              const normProjects = cloudContent.projects.map(normalizeProject);
              setProjects(normProjects);
              await setStoredItem('surya_portfolio_projects', normProjects);
            }
            if (cloudContent.profile) {
              setProfile(cloudContent.profile);
              await setStoredItem('surya_portfolio_profile', cloudContent.profile);
            }
            if (cloudContent.steps) {
              setSteps(cloudContent.steps);
              await setStoredItem('surya_portfolio_steps', cloudContent.steps);
            }
            if (cloudContent.principles) {
              setPrinciples(cloudContent.principles);
              await setStoredItem('surya_portfolio_principles', cloudContent.principles);
            }
            if (cloudContent.about) {
              setAbout(cloudContent.about);
              await setStoredItem('surya_portfolio_about', cloudContent.about);
            }
          }

          // Fetch cloud messages
          const cloudMessages = await fetchCloudMessages();
          if (!isMounted) return;
          if (cloudMessages && Array.isArray(cloudMessages)) {
            setMessages(cloudMessages);
            await setStoredItem('surya_portfolio_messages', cloudMessages);
          }
        }

        setIsCloudLoaded(true);
      } catch (err) {
        console.warn('Initial cloud synchronization notice:', err);
      }
    };

    loadInitialData();

    // Instant cross-tab broadcast receiver
    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'PROJECTS_SYNC') setProjects(Array.isArray(payload) ? payload.map(normalizeProject) : []);
        if (type === 'PROFILE_SYNC') setProfile(payload);
        if (type === 'STEPS_SYNC') setSteps(payload);
        if (type === 'PRINCIPLES_SYNC') setPrinciples(payload);
        if (type === 'ABOUT_SYNC') setAbout(payload);
        if (type === 'MESSAGES_SYNC') setMessages(payload);
      };
    }

    // Auto-refresh when tab becomes visible or focused (switching between Admin & Public portfolio)
    const handleTabFocus = async () => {
      try {
        const fresh = await getStoredItemAsync('surya_portfolio_projects');
        if (fresh && Array.isArray(fresh) && fresh.length > 0 && isMounted) {
          setProjects(fresh.map(normalizeProject));
        }
      } catch {}
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleTabFocus();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', handleTabFocus);
    window.addEventListener('surya_storage_update', handleTabFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', handleTabFocus);
      window.removeEventListener('surya_storage_update', handleTabFocus);
    };
  }, []);

  // Resume modal state
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const openResume = () => setIsResumeOpen(true);
  const closeResume = () => setIsResumeOpen(false);

  // Admin Auth state via Supabase session
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Auth session listener & check
  useEffect(() => {
    // 1. Check local session storage first
    const activeSession = sessionStorage.getItem('surya_admin_auth_session');
    const expectedHash = localStorage.getItem('surya_admin_hash') || DEFAULT_PROTECTED_HASH;
    if (activeSession && activeSession === expectedHash) {
      setIsAdminAuth(true);
      setAuthLoading(false);
      return;
    }

    // 2. If Supabase is configured, check online session
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const userEmail = session?.user?.email?.toLowerCase();
        if (userEmail && userEmail === ALLOWED_ADMIN_EMAIL) {
          setIsAdminAuth(true);
          setAdminUser(session.user);
        } else {
          setIsAdminAuth(false);
          setAdminUser(null);
        }
        setAuthLoading(false);
      }).catch(() => {
        setIsAdminAuth(false);
        setAuthLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setCurrentRoute('admin-reset');
          window.location.hash = 'admin-reset';
        }
        const userEmail = session?.user?.email?.toLowerCase();
        if (userEmail && userEmail === ALLOWED_ADMIN_EMAIL) {
          setIsAdminAuth(true);
          setAdminUser(session.user);
        } else {
          setIsAdminAuth(false);
          setAdminUser(null);
        }
        setAuthLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      setIsAdminAuth(false);
      setAuthLoading(false);
    }
  }, []);

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('surya_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      if (hash === 'contact') {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      setCurrentRoute(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title dynamically matching original portfolio
  useEffect(() => {
    if (currentRoute === 'home') {
      document.title = "Surya Teja Portfolio";
    } else if (currentRoute === 'work') {
      document.title = "Work · Surya Teja";
    } else if (currentRoute === 'thinking') {
      document.title = "Design thinking · Surya Teja";
    } else if (currentRoute === 'about') {
      document.title = "About · Surya Teja";
    } else if (currentRoute === 'admin') {
      document.title = "Studio Admin · Surya Teja";
    } else if (currentRoute.startsWith('case-')) {
      const slug = currentRoute.replace('case-', '');
      const p = projects.find((x) => x.slug === slug);
      if (p) {
        document.title = `${p.title} · Surya Teja`;
      }
    }
  }, [currentRoute, projects]);

  // Multi-Tier Persistent Save Handlers (IndexedDB + Safe LocalStorage + Broadcast)
  const saveProjects = async (newProjects) => {
    const normalized = Array.isArray(newProjects) ? newProjects.map(normalizeProject) : [];
    
    // 1. Immediately update local React state for instantaneous UI response
    setProjects(normalized);

    // 2. Broadcast immediately to all other tabs (zero delay!)
    try {
      syncChannel?.postMessage({ type: 'PROJECTS_SYNC', payload: normalized });
    } catch (e) {
      console.warn('Cross-tab broadcast notice:', e);
    }

    // 3. Persist to IndexedDB (handles multi-megabyte high-res visuals) & safe LocalStorage
    await setStoredItem('surya_portfolio_projects', normalized);

    // 4. Save to Cloud database if configured
    let result = { success: true, isOffline: !isSupabaseConfigured };
    if (isSupabaseConfigured) {
      result = await saveCloudContent('projects', normalized);
      if (result.success) {
        showToast('success', 'Projects Saved & Synced Online ✓', 'Visible immediately across all devices.');
      } else {
        showToast('warning', 'Saved Locally', result.error);
      }
    } else {
      showToast('success', 'Changes Saved Locally in Browser ✓', 'To display on mobile/other devices, push repository to GitHub or configure Supabase in .env.');
    }
    return result;
  };

  const saveProfile = async (newProfile) => {
    setProfile(newProfile);
    try {
      syncChannel?.postMessage({ type: 'PROFILE_SYNC', payload: newProfile });
    } catch (e) {}
    await setStoredItem('surya_portfolio_profile', newProfile);

    let result = { success: true, isOffline: !isSupabaseConfigured };
    if (isSupabaseConfigured) {
      result = await saveCloudContent('profile', newProfile);
      if (result.success) {
        showToast('success', 'Profile Saved to Online Database ✓', 'Hero & Identity updates are now live online.');
      } else {
        showToast('warning', 'Profile Saved Locally', result.error);
      }
    } else {
      showToast('success', 'Profile Updated ✓');
    }
    return result;
  };

  const saveSteps = async (newSteps) => {
    setSteps(newSteps);
    try {
      syncChannel?.postMessage({ type: 'STEPS_SYNC', payload: newSteps });
    } catch (e) {}
    await setStoredItem('surya_portfolio_steps', newSteps);

    let result = { success: true, isOffline: !isSupabaseConfigured };
    if (isSupabaseConfigured) {
      result = await saveCloudContent('steps', newSteps);
      if (result.success) {
        showToast('success', 'Process Steps Saved to Online Database ✓', 'Updated on homepage and thinking page.');
      } else {
        showToast('warning', 'Steps Saved Locally', result.error);
      }
    } else {
      showToast('success', 'Steps Updated ✓');
    }
    return result;
  };

  const savePrinciples = async (newPrinciples) => {
    setPrinciples(newPrinciples);
    try {
      syncChannel?.postMessage({ type: 'PRINCIPLES_SYNC', payload: newPrinciples });
    } catch (e) {}
    await setStoredItem('surya_portfolio_principles', newPrinciples);

    let result = { success: true, isOffline: !isSupabaseConfigured };
    if (isSupabaseConfigured) {
      result = await saveCloudContent('principles', newPrinciples);
      if (result.success) {
        showToast('success', 'Principles Saved to Online Database ✓', 'Updated across public views.');
      } else {
        showToast('warning', 'Principles Saved Locally', result.error);
      }
    } else {
      showToast('success', 'Principles Updated ✓');
    }
    return result;
  };

  const saveAbout = async (newAbout) => {
    setAbout(newAbout);
    try {
      syncChannel?.postMessage({ type: 'ABOUT_SYNC', payload: newAbout });
    } catch (e) {}
    await setStoredItem('surya_portfolio_about', newAbout);

    let result = { success: true, isOffline: !isSupabaseConfigured };
    if (isSupabaseConfigured) {
      result = await saveCloudContent('about', newAbout);
      if (result.success) {
        showToast('success', 'About Page Saved to Online Database ✓', 'Updated bio and background online.');
      } else {
        showToast('warning', 'About Saved Locally', result.error);
      }
    } else {
      showToast('success', 'About Page Updated ✓');
    }
    return result;
  };

  // Sync All Portfolio Content to Online Database
  const syncAllToCloud = async () => {
    showToast('info', 'Syncing Content to Cloud...', 'Uploading all projects, case studies, profile, and design thinking.');
    const result = await seedCloudDatabase({
      projects,
      profile,
      steps,
      principles,
      about,
    });

    if (result.success) {
      showToast('success', 'All Content Synced to Online Database! ✓', 'Every project, case study, and bio text is now saved online for all visitors.');
    } else {
      showToast('error', 'Cloud Sync Failed', result.error);
    }
    return result;
  };

  // Visitor Message Submission & Storage
  const addMessage = async (msg) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleString(),
      read: false,
      name: msg.name,
      email: msg.email,
      topic: msg.topic || 'General Inquiry',
      message: msg.message,
      created_at: new Date().toISOString(),
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
    syncChannel?.postMessage({ type: 'MESSAGES_SYNC', payload: updated });

    // 1. Save message to online Supabase table
    const dbResult = await saveCloudMessage(newMsg);

    // 2. Deliver email to suryasanku800@gmail.com
    const emailResult = await sendContactEmail(msg);

    if (emailResult.success) {
      showToast('success', 'Inquiry Emailed & Saved ✓', 'Your message was delivered to suryasanku800@gmail.com and saved to the inbox.');
    } else if (emailResult.needsKey) {
      showToast('info', 'Inquiry Saved to Online Inbox ✓', 'Message recorded in the portfolio database. (Direct email requires VITE_WEB3FORMS_ACCESS_KEY).');
    } else {
      showToast('warning', 'Message Saved (Email Delivery Notice)', emailResult.error);
    }

    return {
      success: true,
      dbResult,
      emailResult,
      newMsg
    };
  };

  const deleteMessage = async (id) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
    syncChannel?.postMessage({ type: 'MESSAGES_SYNC', payload: updated });
    await deleteCloudMessage(id);
    showToast('info', 'Message Deleted', 'Removed from online database.');
  };

  const markMessageRead = async (id) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
    syncChannel?.postMessage({ type: 'MESSAGES_SYNC', payload: updated });
    await markCloudMessageRead(id);
  };

  const resetToDefaults = async () => {
    if (window.confirm("Are you sure you want to restore original default portfolio content?")) {
      setProjects(DEFAULT_PROJECTS);
      setProfile(DEFAULT_PROFILE);
      setSteps(DEFAULT_STEPS);
      setPrinciples(DEFAULT_PRINCIPLES);
      setAbout(DEFAULT_ABOUT);
      localStorage.removeItem('surya_portfolio_projects');
      localStorage.removeItem('surya_portfolio_profile');
      localStorage.removeItem('surya_portfolio_steps');
      localStorage.removeItem('surya_portfolio_principles');
      localStorage.removeItem('surya_portfolio_about');
      localStorage.removeItem('surya_portfolio_messages');
      setMessages([]);

      syncChannel?.postMessage({ type: 'PROJECTS_SYNC', payload: DEFAULT_PROJECTS });
      syncChannel?.postMessage({ type: 'PROFILE_SYNC', payload: DEFAULT_PROFILE });
      syncChannel?.postMessage({ type: 'STEPS_SYNC', payload: DEFAULT_STEPS });
      syncChannel?.postMessage({ type: 'PRINCIPLES_SYNC', payload: DEFAULT_PRINCIPLES });
      syncChannel?.postMessage({ type: 'ABOUT_SYNC', payload: DEFAULT_ABOUT });
      syncChannel?.postMessage({ type: 'MESSAGES_SYNC', payload: [] });

      if (isSupabaseConfigured) {
        await seedCloudDatabase({
          projects: DEFAULT_PROJECTS,
          profile: DEFAULT_PROFILE,
          steps: DEFAULT_STEPS,
          principles: DEFAULT_PRINCIPLES,
          about: DEFAULT_ABOUT
        });
      }

      showToast('success', 'Reset Completed', 'All content restored to original defaults.');
    }
  };

  const loginAdmin = async (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      return {
        success: false,
        error: 'Access restricted to the verified portfolio owner (suryasanku800@gmail.com).',
      };
    }

    // 1. If Supabase is configured, try Supabase cloud authentication first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (!error && data.user?.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL) {
          setIsAdminAuth(true);
          setAdminUser(data.user);
          setCurrentRoute('admin');
          window.location.hash = 'admin';
          return { success: true };
        }
      } catch (err) {
        // Fallback to protective hash check below
      }
    }

    // 2. Validate against protective salted cryptographic hash
    try {
      const enteredHash = await hashPassword(password);
      const expectedHash = localStorage.getItem('surya_admin_hash') || DEFAULT_PROTECTED_HASH;
      if (enteredHash === expectedHash) {
        setIsAdminAuth(true);
        sessionStorage.setItem('surya_admin_auth_session', expectedHash);
        setCurrentRoute('admin');
        window.location.hash = 'admin';
        return { success: true };
      }
    } catch (e) {
      // crypto error fallback
    }

    return {
      success: false,
      error: 'Incorrect password. Please enter your protective admin password.',
    };
  };

  const logoutAdmin = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } finally {
      setIsAdminAuth(false);
      setAdminUser(null);
      sessionStorage.removeItem('surya_admin_auth_session');
      setCurrentRoute('home');
      window.location.hash = 'home';
    }
  };

  const sendPasswordReset = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      return {
        success: false,
        error: 'Password reset links can only be dispatched to the verified owner email address.',
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const resetRedirectUrl = window.location.origin + window.location.pathname + '#admin-reset';
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: resetRedirectUrl,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: err.message || 'Failed to send reset email' };
      }
    }

    // If Supabase is not configured yet, route directly to the secure reset form
    setCurrentRoute('admin-reset');
    window.location.hash = 'admin-reset';
    return { success: true };
  };

  const updatePassword = async (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long.',
      };
    }

    try {
      const newHash = await hashPassword(newPassword);
      localStorage.setItem('surya_admin_hash', newHash);
      sessionStorage.setItem('surya_admin_auth_session', newHash);

      if (isSupabaseConfigured && supabase) {
        await supabase.auth.updateUser({
          password: newPassword,
        });
      }

      setIsAdminAuth(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update password' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRoute,
        setCurrentRoute,
        activeFilter,
        setActiveFilter,
        projects,
        saveProjects,
        profile,
        saveProfile,
        steps,
        saveSteps,
        principles,
        savePrinciples,
        about,
        saveAbout,
        syncAllToCloud,
        resetToDefaults,
        messages,
        addMessage,
        deleteMessage,
        markMessageRead,
        isResumeOpen,
        openResume,
        closeResume,
        isAdminAuth,
        authLoading,
        adminUser,
        isSupabaseConfigured,
        isCloudLoaded,
        loginAdmin,
        logoutAdmin,
        sendPasswordReset,
        updatePassword,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
