import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminAuthView } from './AdminAuthView';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminProfileTab } from './AdminProfileTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminInquiriesTab } from './AdminInquiriesTab';

export const AdminPanel = () => {
  const { isAdminAuth, logoutAdmin, resetToDefaults, messages, projects, profile, steps, principles, about, saveProjects, saveProfile } = usePortfolio();
  const [activeTab, setActiveTab] = useState('projects');

  if (!isAdminAuth) {
    return <AdminAuthView />;
  }

  const tabs = [
    { id: 'projects', label: `Projects & Case Studies (${projects.length})` },
    { id: 'hero', label: 'Hero & Identity CMS' },
    { id: 'inquiries', label: `Inquiries (${messages.length})` },
    { id: 'content', label: 'Process & Principles' },
  ];

  const handleExportData = () => {
    const backup = {
      projects,
      profile,
      steps,
      principles,
      about,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `surya_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.projects) saveProjects(parsed.projects);
        if (parsed.profile) saveProfile(parsed.profile);
        alert('Portfolio data successfully restored from backup file!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pt-6 pb-20 max-w-5xl mx-auto space-y-8 animate-in">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="mono text-signal block mb-1">Studio CMS · Owner Panel</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-wider text-ink">
            Portfolio Studio Editor
          </h1>
          <p className="text-sm text-ink-2 mt-1">
            Publish new case studies, reorder works, manage hero copy, or view visitor messages in real-time.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <a
            href="#home"
            className="px-4 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink hover:bg-paper transition-colors"
          >
            ← View Site
          </a>

          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink hover:bg-paper transition-colors cursor-pointer"
            title="Download JSON backup"
          >
            Export Backup ⇣
          </button>

          <label
            className="px-3.5 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink hover:bg-paper transition-colors cursor-pointer"
            title="Restore from JSON backup"
          >
            Import ⇡
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            type="button"
            onClick={resetToDefaults}
            className="px-4 py-2 rounded-full border border-line text-xs font-medium text-ink-3 hover:text-red-600 hover:bg-paper transition-colors cursor-pointer"
            title="Restore original default projects and content"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Log out from Admin Studio?')) {
                logoutAdmin();
              }
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 hover:bg-red-100 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-pill text-pill-ink shadow-sm'
                : 'bg-sheet text-ink-2 hover:text-ink border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panes */}
      <div>
        {activeTab === 'projects' && <AdminProjectsTab />}
        {activeTab === 'hero' && <AdminProfileTab />}
        {activeTab === 'inquiries' && <AdminInquiriesTab />}
        {activeTab === 'content' && <AdminContentTab />}
      </div>
    </div>
  );
};

export default AdminPanel;
