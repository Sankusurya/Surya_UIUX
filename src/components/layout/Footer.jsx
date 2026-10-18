import React from 'react';

export const Footer = () => {
  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="wrap flex justify-between items-center flex-wrap gap-3 py-5 pb-10 text-[13px] text-ink-3">
      <span className="flex items-center gap-2">
        © 2026 Surya Teja. Designed and built by me.
      </span>
      <a href="#home" onClick={handleBackToTop}>
        Back to top ↑
      </a>
    </footer>
  );
};

export default Footer;
