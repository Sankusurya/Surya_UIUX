import React from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { WorkView } from './components/work/WorkView';
import { ThinkingView } from './components/thinking/ThinkingView';
import { AboutView } from './components/about/AboutView';
import { CaseStudyView } from './components/casestudy/CaseStudyView';
import { ContactSection } from './components/home/ContactSection';
import { AdminPanel } from './components/admin/AdminPanel';
import { ResumeModal } from './components/common/ResumeModal';
import { Toast } from './components/common/Toast';

export const App = () => {
  const { currentRoute } = usePortfolio();

  const renderView = () => {
    if (currentRoute === 'admin' || currentRoute === 'admin-reset') {
      return <AdminPanel />;
    }
    if (currentRoute === 'work') {
      return <WorkView />;
    }
    if (currentRoute === 'thinking') {
      return <ThinkingView />;
    }
    if (currentRoute === 'about') {
      return <AboutView />;
    }
    if (currentRoute.startsWith('case-')) {
      return <CaseStudyView />;
    }
    return <HomeView />;
  };

  const isAdmin = currentRoute === 'admin' || currentRoute === 'admin-reset';

  return (
    <>
      <Navbar />

      <main className="wrap" id="app">
        <div key={currentRoute} className="view">
          {renderView()}
        </div>
      </main>

      {!isAdmin && (
        <>
          <ContactSection />
          <Footer />
        </>
      )}

      {/* Global Modals & Notifications */}
      <ResumeModal />
      <Toast />
    </>
  );
};

export default App;
