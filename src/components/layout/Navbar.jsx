import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar = () => {
  const { currentRoute, theme, toggleTheme, openResume, projects, openAdminLogin } = usePortfolio();
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isWorkActive = currentRoute === 'work' || currentRoute.startsWith('case-');
  const isThinkingActive = currentRoute === 'thinking';
  const isAboutActive = currentRoute === 'about';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWorkDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'contact';
    }
  };

  const handleWorkToggle = (e) => {
    e.preventDefault();
    setIsWorkDropdownOpen((prev) => !prev);
  };

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setIsWorkDropdownOpen(false);
  };

  return (
    <nav className="nav-container" aria-label="Main Navigation">
      <div className="nav-pill-dock" ref={dropdownRef}>
        {/* Orange Circular Avatar with Italic 'S' */}
        <a
          href="#home"
          className="nav-avatar"
          aria-label="Surya Teja Homepage"
          title="Surya Teja"
        >
          S
        </a>

        {/* Work Pill Button with Dropdown Chevron */}
        <div className="relative">
          <button
            type="button"
            onClick={handleWorkToggle}
            className={`nav-work-pill ${
              isWorkActive ? 'nav-work-active' : ''
            }`}
            aria-expanded={isWorkDropdownOpen}
            aria-haspopup="true"
          >
            <span>Work</span>
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

          {/* Work Dropdown Menu - shows only Admin Panel */}
          {isWorkDropdownOpen && (
            <div className="nav-dropdown-menu min-w-[170px]">
              <a
                href="#admin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsWorkDropdownOpen(false);
                  openAdminLogin();
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
        >
          Thinking
        </a>

        {/* About Link */}
        <a
          href="#about"
          className={`nav-link ${isAboutActive ? 'nav-link-active' : ''}`}
        >
          About
        </a>

        {/* Resume Link */}
        <button
          type="button"
          onClick={openResume}
          className="nav-link cursor-pointer"
        >
          Resume
        </button>

        {/* Contact White Pill Button */}
        <a
          href="#contact"
          onClick={handleContactClick}
          className="nav-contact-btn"
        >
          Contact
        </a>

        {/* Dark Mode Moon Icon Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="nav-theme-btn"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            /* Crescent Moon Icon matching Image 2 */
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
            /* Sun Icon when in Light Mode */
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
      </div>
    </nav>
  );
};

export default Navbar;
