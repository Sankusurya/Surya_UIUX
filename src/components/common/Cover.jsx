import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Cover = ({ type, title = '', coverImg = null }) => {
  const { openAdminLogin, profile } = usePortfolio();

  if (coverImg) {
    return (
      <div className="cover overflow-hidden bg-stone-900" aria-hidden="true">
        <img
          src={coverImg}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  switch (type) {
    case 'portfolio':
      return (
        <div className="cover cv-portfolio" aria-hidden="true">
          <div className="p"></div>
          <div className="t">
            <span>{profile?.name || 'Surya'}</span>
            {profile?.roleLine1 || 'PRODUCT'}
            <br />
            {profile?.roleLine2 || 'DESIGNER'}
          </div>
        </div>
      );

    case 'movies':
      return (
        <div className="cover cv-movies" aria-hidden="true">
          <div className="strip">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span className="tag5">&lt;HTML5/&gt;</span>
        </div>
      );

    case 'store':
      return (
        <div className="cover cv-store" aria-hidden="true">
          <span className="f">F</span>
          <span className="s">GENTLEMAN BOUTIQUE</span>
        </div>
      );

    case 'admin':
      return (
        <div className="cover cv-admin" aria-hidden="true">
          <div className="side"></div>
          <div className="main">
            <div className="bar"></div>
            <div className="grid">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <button
            type="button"
            className="lock"
            title="Open Studio Admin Panel"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openAdminLogin();
            }}
          >
            Owner only
          </button>
        </div>
      );

    default:
      return (
        <div className="cover bg-neutral-900 text-neutral-100 flex items-center justify-center p-6 text-center" aria-hidden="true">
          <span className="font-display text-2xl uppercase tracking-wider">
            {title || 'Project'}
          </span>
        </div>
      );
  }
};

export default Cover;
