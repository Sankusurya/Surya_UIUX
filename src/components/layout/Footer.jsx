import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer = () => {
  const { openAdminLogin } = usePortfolio();

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="wrap flex justify-between items-center flex-wrap gap-3 py-5 pb-10 text-[13px] text-ink-3">
      <span className="flex items-center gap-2">
        © 2026 Surya Teja. Designed and built by me.
        <a
          href="#admin"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            openAdminLogin();
          }}
          className="opacity-40 hover:opacity-100 transition-opacity ml-2 text-[11px] font-mono underline cursor-pointer"
          title="Open CMS Studio Admin in new tab"
        >
          [Studio ↗]
        </a>
      </span>
      <a href="#home" onClick={handleBackToTop}>
        Back to top ↑
      </a>
    </footer>
  );
};

export default Footer;
