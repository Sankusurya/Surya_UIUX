import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar = () => {
  const { currentRoute, theme, toggleTheme, openResume, isResumeOpen } = usePortfolio();
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dockRef = useRef(null);

  const isHomeActive = currentRoute === 'home' || !currentRoute;
  const isWorkActive = currentRoute === 'work' || currentRoute.startsWith('case-');
  const isThinkingActive = currentRoute === 'thinking';
  const isAboutActive = currentRoute === 'about';
  const isResumeActive = Boolean(isResumeOpen);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dockRef.current && !dockRef.current.contains(event.target)) {
        setIsWorkDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsWorkDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsWorkDropdownOpen(false);
  }, [currentRoute]);

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'contact';
    }
  };

  const handleWorkClick = () => {
    setIsWorkDropdownOpen(false);
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWorkDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="nav-container" aria-label="Main Navigation">
      <div className="nav-pill-dock" ref={dockRef}>
        {/* Orange Circular Avatar with Italic 'S' */}
        <a
          href="#home"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`nav-avatar ${isHomeActive ? 'nav-avatar-active' : ''}`}
          aria-label="Surya Teja Homepage"
          title="Surya Teja Homepage"
          aria-current={isHomeActive ? 'page' : undefined}
        >
          S
        </a>

        {/* Desktop Navigation Links (Hidden on mobile) */}
        <div className="nav-desktop-links">
          {/* Work Pill Button with Dropdown Chevron */}
          <div className="relative inline-flex items-center">
            <div
              className={`nav-work-pill ${
                isWorkActive ? 'nav-work-active' : ''
              } ${isWorkDropdownOpen ? 'nav-work-open' : ''}`}
            >
              <a
                href="#work"
                onClick={handleWorkClick}
                className="nav-work-link"
                aria-label="Work page"
                aria-current={isWorkActive ? 'page' : undefined}
              >
                Work
              </a>
              <button
                type="button"
                onClick={handleDropdownToggle}
                className="nav-work-arrow-btn"
                aria-expanded={isWorkDropdownOpen}
                aria-haspopup="true"
                aria-label="Toggle Admin Menu"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${
                    isWorkDropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {/* Work Dropdown Menu - shows only Admin Panel */}
            {isWorkDropdownOpen && (
              <div className="nav-dropdown-menu min-w-[170px]">
                <a
                  href="#admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setIsWorkDropdownOpen(false);
                  }}
                  className="nav-dropdown-item font-semibold flex items-center justify-between py-2.5 px-3 hover:text-signal transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-signal text-sm">⚙</span>
                    <span>Admin Panel</span>
                  </span>
                  <span className="text-xs opacity-60">↗</span>
                </a>
              </div>
            )}
          </div>

          {/* Thinking Link */}
          <a
            href="#thinking"
            className={`nav-link ${isThinkingActive ? 'nav-link-active' : ''}`}
            aria-current={isThinkingActive ? 'page' : undefined}
          >
            Thinking
          </a>

          {/* About Link */}
          <a
            href="#about"
            className={`nav-link ${isAboutActive ? 'nav-link-active' : ''}`}
            aria-current={isAboutActive ? 'page' : undefined}
          >
            About
          </a>

          {/* Resume Link */}
          <button
            type="button"
            onClick={openResume}
            className={`nav-link cursor-pointer ${isResumeActive ? 'nav-link-active' : ''}`}
            aria-current={isResumeActive ? 'true' : undefined}
          >
            Resume
          </button>
        </div>

        {/* Right Action Items: Contact Button + Theme Toggle / Mobile Menu Toggle */}
        <div className="nav-actions">
          {/* Contact Button */}
          <a
            href="#contact"
            onClick={handleContactClick}
            className="nav-contact-btn"
          >
            Contact
          </a>

          {/* Desktop Theme Toggle (Hidden on Mobile) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="nav-theme-btn nav-theme-desktop"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Mobile Hamburger / Close Button (Visible ONLY on Mobile) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`nav-mobile-toggle-btn ${isMobileMenuOpen ? 'is-open' : ''}`}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              /* Close '✕' Icon */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              /* Hamburger '☰' Icon */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="17" x2="20" y2="17"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu Card (Matching Image 2 Mockup) */}
        {isMobileMenuOpen && (
          <div className="nav-mobile-menu" role="menu">
            {/* Work */}
            <a
              href="#work"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-mobile-item ${isWorkActive ? 'nav-mobile-item-active' : ''}`}
              role="menuitem"
            >
              Work
            </a>

            {/* Thinking */}
            <a
              href="#thinking"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-mobile-item ${isThinkingActive ? 'nav-mobile-item-active' : ''}`}
              role="menuitem"
            >
              Thinking
            </a>

            {/* About */}
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-mobile-item ${isAboutActive ? 'nav-mobile-item-active' : ''}`}
              role="menuitem"
            >
              About
            </a>

            {/* Resume */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openResume();
              }}
              className={`nav-mobile-item ${isResumeActive ? 'nav-mobile-item-active' : ''}`}
              role="menuitem"
            >
              Resume
            </button>

            {/* Divider */}
            <div className="nav-mobile-divider" />

            {/* Theme Toggle Row */}
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-mobile-item nav-mobile-theme-row"
              role="menuitem"
            >
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              <span className="nav-mobile-theme-icon">
                {theme === 'dark' ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="nav-mobile-divider" />

            {/* Admin Panel Item */}
            <a
              href="#admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="nav-mobile-admin-item"
              role="menuitem"
            >
              <div className="nav-mobile-admin-header">
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-sm">⚙</span>
                  <span>Admin panel</span>
                </span>
                <span className="text-sm opacity-60">↗</span>
              </div>
              <p className="nav-mobile-admin-sub">
                How I publish new projects without touching code
              </p>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
