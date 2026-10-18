import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_PROJECTS,
  DEFAULT_PROFILE,
  DEFAULT_STEPS,
  DEFAULT_PRINCIPLES,
  DEFAULT_ABOUT
} from '../data/initialData';

const PortfolioContext = createContext(null);

const DEFAULT_MASTER_PASSWORD = "Surya@0206";
export const REGISTERED_ADMIN_EMAIL = "suryasanku800@gmail.com";

export const PortfolioProvider = ({ children }) => {
  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('surya_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Routing
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash.slice(1) || 'home';
  });

  // Selected filter on work page
  const [activeFilter, setActiveFilter] = useState('All');

  // Stored Data with LocalStorage Persistence
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.slug === 'portfolio' && (!p.caseStudy || !p.caseStudy.blocks?.length)) {
            return {
              ...p,
              caseStudy: DEFAULT_PROJECTS[0].caseStudy
            };
          }
          return p;
        });
      }
      return DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          email: (parsed.email && parsed.email !== 'sankusurya@gmail.com') ? parsed.email : DEFAULT_PROFILE.email,
          roleLine1: parsed.roleLine1 && parsed.roleLine1 !== 'UX/UI' ? parsed.roleLine1 : DEFAULT_PROFILE.roleLine1,
          roleLine2: parsed.roleLine2 && parsed.roleLine2 !== 'Designer' ? parsed.roleLine2 : DEFAULT_PROFILE.roleLine2,
          name: parsed.name && parsed.name !== 'Surya' ? parsed.name : DEFAULT_PROFILE.name,
          badge: parsed.badge || DEFAULT_PROFILE.badge,
          specialization: parsed.specialization || DEFAULT_PROFILE.specialization,
          coreToolkit: parsed.coreToolkit || DEFAULT_PROFILE.coreToolkit,
          location: parsed.location || DEFAULT_PROFILE.location,
          lead: parsed.lead || DEFAULT_PROFILE.lead,
          highlightedPhrase: parsed.highlightedPhrase || DEFAULT_PROFILE.highlightedPhrase,
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Contact form messages storage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addMessage = (msg) => {
    const newMsg = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      read: false,
      ...msg,
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
    return newMsg;
  };

  const deleteMessage = (id) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
  };

  const markMessageRead = (id) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem('surya_portfolio_messages', JSON.stringify(updated));
  };

  // Resume modal state
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const openResume = () => setIsResumeOpen(true);
  const closeResume = () => setIsResumeOpen(false);

  const [steps, setSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_steps');
      return saved ? JSON.parse(saved) : DEFAULT_STEPS;
    } catch {
      return DEFAULT_STEPS;
    }
  });

  const [principles, setPrinciples] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_principles');
      return saved ? JSON.parse(saved) : DEFAULT_PRINCIPLES;
    } catch {
      return DEFAULT_PRINCIPLES;
    }
  });

  const [about, setAbout] = useState(() => {
    try {
      const saved = localStorage.getItem('surya_portfolio_about');
      return saved ? JSON.parse(saved) : DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  // Admin Master Password state
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('surya_admin_pwd') || DEFAULT_MASTER_PASSWORD;
  });

  // Admin Auth state - checks both session & localStorage for cross-tab persistence
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return (
      sessionStorage.getItem('surya_admin_logged_in') === 'true' ||
      localStorage.getItem('surya_admin_logged_in') === 'true'
    );
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(() => {
    const isAuth =
      sessionStorage.getItem('surya_admin_logged_in') === 'true' ||
      localStorage.getItem('surya_admin_logged_in') === 'true';
    const hash = window.location.hash.slice(1);
    return hash === 'admin' && !isAuth;
  });
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

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
      if (hash === 'admin' && !isAdminAuth) {
        setIsLoginModalOpen(true);
      } else {
        setCurrentRoute(hash);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuth]);

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

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('surya_portfolio_projects', JSON.stringify(newProjects));
  };

  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('surya_portfolio_profile', JSON.stringify(newProfile));
  };

  const saveSteps = (newSteps) => {
    setSteps(newSteps);
    localStorage.setItem('surya_portfolio_steps', JSON.stringify(newSteps));
  };

  const savePrinciples = (newPrinciples) => {
    setPrinciples(newPrinciples);
    localStorage.setItem('surya_portfolio_principles', JSON.stringify(newPrinciples));
  };

  const saveAbout = (newAbout) => {
    setAbout(newAbout);
    localStorage.setItem('surya_portfolio_about', JSON.stringify(newAbout));
  };

  const resetToDefaults = () => {
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
      alert("All content reset to original defaults!");
    }
  };

  const loginAdmin = (password) => {
    if (password === adminPassword) {
      setIsAdminAuth(true);
      sessionStorage.setItem('surya_admin_logged_in', 'true');
      localStorage.setItem('surya_admin_logged_in', 'true');
      setIsLoginModalOpen(false);
      setCurrentRoute('admin');
      window.location.hash = 'admin';
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('surya_admin_logged_in');
    localStorage.removeItem('surya_admin_logged_in');
    setCurrentRoute('home');
    window.location.hash = 'home';
  };

  const openAdminLogin = () => {
    const adminUrl = window.location.origin + window.location.pathname + '#admin';
    window.open(adminUrl, '_blank', 'noopener,noreferrer');
  };

  const updateMasterPassword = (newPassword) => {
    setAdminPassword(newPassword);
    localStorage.setItem('surya_admin_pwd', newPassword);
  };

  const closeAdminLogin = () => {
    setIsLoginModalOpen(false);
    if (!isAdminAuth && (currentRoute === 'admin' || window.location.hash.slice(1) === 'admin')) {
      setCurrentRoute('home');
      window.location.hash = 'home';
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
        resetToDefaults,
        messages,
        addMessage,
        deleteMessage,
        markMessageRead,
        isResumeOpen,
        openResume,
        closeResume,
        isAdminAuth,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        openAdminLogin,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeAdminLogin,
        isForgotModalOpen,
        openForgotModal: () => setIsForgotModalOpen(true),
        closeForgotModal: () => setIsForgotModalOpen(false),
        adminPassword,
        updateMasterPassword,
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
