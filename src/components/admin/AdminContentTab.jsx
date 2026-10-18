import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminContentTab = () => {
  const { steps, saveSteps, principles, savePrinciples, about, saveAbout } = usePortfolio();

  const [stepsData, setStepsData] = useState([...steps]);
  const [principlesData, setPrinciplesData] = useState([...principles]);
  const [aboutData, setAboutData] = useState({ ...about });
  const [newTool, setNewTool] = useState('');

  const handleStepChange = (idx, field, val) => {
    const next = [...stepsData];
    next[idx] = { ...next[idx], [field]: val };
    setStepsData(next);
  };

  const handlePrincipleChange = (idx, field, val) => {
    const next = [...principlesData];
    next[idx] = { ...next[idx], [field]: val };
    setPrinciplesData(next);
  };

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    if (!aboutData.tools.includes(newTool.trim())) {
      setAboutData((prev) => ({ ...prev, tools: [...prev.tools, newTool.trim()] }));
    }
    setNewTool('');
  };

  const handleRemoveTool = (tool) => {
    setAboutData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t !== tool),
    }));
  };

  const handleExperienceChange = (idx, field, val) => {
    const nextExp = [...aboutData.experience];
    nextExp[idx] = { ...nextExp[idx], [field]: val };
    setAboutData((prev) => ({ ...prev, experience: nextExp }));
  };

  const handleAddExperience = () => {
    setAboutData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: '[Role] · [Company]', period: '[Year – Year]', desc: '[Description of impact]' },
      ],
    }));
  };

  const handleRemoveExperience = (idx) => {
    setAboutData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    saveSteps(stepsData);
    savePrinciples(principlesData);
    saveAbout(aboutData);
    alert('Design thinking, principles, and about information saved successfully!');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* 5-Step Process */}
      <div className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-line">
          <span className="mono text-signal">How I Work</span>
          <h3 className="text-xl font-bold font-display uppercase tracking-wider">
            5-Step Design Process
          </h3>
          <p className="text-xs text-ink-3">
            Displayed on the homepage and thinking page.
          </p>
        </div>

        <div className="space-y-4">
          {stepsData.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-line bg-paper grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <div className="flex items-center gap-2">
                <span className="mono text-signal font-bold text-sm">#{idx + 1}</span>
                <input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  placeholder="Step title"
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs font-semibold text-ink"
                />
              </div>
              <div className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={step.desc || ''}
                  onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                  placeholder="Step description"
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs text-ink"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Principles */}
      <div className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-line">
          <span className="mono text-signal">Principles</span>
          <h3 className="text-xl font-bold font-display uppercase tracking-wider">
            Design Principles & In-Practice Proof
          </h3>
          <p className="text-xs text-ink-3">
            Featured on the /thinking page.
          </p>
        </div>

        <div className="space-y-4">
          {principlesData.map((pr, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-line bg-paper space-y-2">
              <span className="mono text-[11px] text-ink-3">Principle #{idx + 1}</span>
              <input
                type="text"
                value={pr.title || ''}
                onChange={(e) => handlePrincipleChange(idx, 'title', e.target.value)}
                placeholder="Principle Title"
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs font-bold text-ink"
              />
              <textarea
                rows={2}
                value={pr.statement || ''}
                onChange={(e) => handlePrincipleChange(idx, 'statement', e.target.value)}
                placeholder="Principle statement"
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs text-ink"
              />
              <div>
                <span className="mono text-[10px] text-signal block mb-1">In Practice Example:</span>
                <textarea
                  rows={2}
                  value={pr.practice || ''}
                  onChange={(e) => handlePrincipleChange(idx, 'practice', e.target.value)}
                  placeholder="In practice..."
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs text-ink"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Page Content */}
      <div className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-line">
          <span className="mono text-signal">About Page Details</span>
          <h3 className="text-xl font-bold font-display uppercase tracking-wider">
            Bio, Experience & Tools
          </h3>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Short Bio
          </label>
          <textarea
            rows={3}
            value={aboutData.bio || ''}
            onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Design Philosophy
          </label>
          <textarea
            rows={3}
            value={aboutData.philosophy || ''}
            onChange={(e) => setAboutData({ ...aboutData, philosophy: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm"
          />
        </div>

        {/* Experience Timeline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
              Experience Timeline
            </label>
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-xs text-signal font-medium hover:underline cursor-pointer"
            >
              + Add Experience Item
            </button>
          </div>

          <div className="space-y-3">
            {(aboutData.experience || []).map((exp, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-line bg-paper relative space-y-2">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute top-2 right-2 text-ink-3 hover:text-red-500 text-xs font-bold"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exp.role || ''}
                    onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                    placeholder="Role · Company"
                    className="px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={exp.period || ''}
                    onChange={(e) => handleExperienceChange(idx, 'period', e.target.value)}
                    placeholder="2024 – 2025"
                    className="px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={exp.desc || ''}
                  onChange={(e) => handleExperienceChange(idx, 'desc', e.target.value)}
                  placeholder="One line on what you owned and a result"
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-sheet text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Tools & Skills Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(aboutData.tools || []).map((tool) => (
              <span
                key={tool}
                onClick={() => handleRemoveTool(tool)}
                className="tag flex items-center gap-1 cursor-pointer hover:border-red-400"
                title="Click to remove"
              >
                {tool} ✕
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTool();
                }
              }}
              placeholder="Add tool tag (e.g. Figma, React, Framer)"
              className="flex-1 px-3 py-1.5 rounded-xl border border-line bg-paper text-ink text-xs"
            />
            <button
              type="button"
              onClick={handleAddTool}
              className="px-3 py-1.5 rounded-xl border border-line text-xs font-medium bg-paper hover:bg-sheet cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
            Things I Love (Personal)
          </label>
          <textarea
            rows={2}
            value={aboutData.interests || ''}
            onChange={(e) => setAboutData({ ...aboutData, interests: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-90 shadow-sm cursor-pointer"
        >
          Save All Content
        </button>
      </div>
    </form>
  );
};

export default AdminContentTab;
