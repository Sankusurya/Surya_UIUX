import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminInquiriesTab = () => {
  const { messages, deleteMessage, markMessageRead, addMessage } = usePortfolio();

  const handleCreateSampleInquiry = () => {
    addMessage({
      name: 'Sarah Jenkins',
      email: 's.jenkins@designcorp.io',
      topic: 'Full-time Junior UX/UI & User Experience Role',
      message: 'Hi Surya, I came across your portfolio and love your focus on battle-tested interfaces and UX research. We have an opening for a Junior User Experience Designer on our mobile team. Would love to schedule a quick 15-minute chat this week!'
    });
  };

  return (
    <div className="bg-sheet border border-line rounded-2xl p-6 sm:p-8 space-y-6 animate-in">
      <div className="pb-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="mono text-signal">Visitor Inquiries</span>
          <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-ink">
            Received Contact Messages
          </h3>
          <p className="text-xs text-ink-3">
            Inquiries and project requests submitted directly through the portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-paper border border-line font-mono text-xs text-ink">
            {messages.length} message{messages.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={handleCreateSampleInquiry}
            className="px-3 py-1 rounded-full border border-line hover:bg-paper text-xs text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            + Add Sample
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper border border-line mx-auto flex items-center justify-center text-xl text-ink-3">
            ✉
          </div>
          <h4 className="font-semibold text-ink text-sm">No Messages Yet</h4>
          <p className="text-xs text-ink-3 max-w-sm mx-auto">
            When visitors send inquiries through the contact section at the bottom of your portfolio, they will be saved and displayed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-xl border border-line bg-paper/60 hover:bg-paper transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-ink">{msg.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sheet border border-line text-signal font-semibold">
                      {msg.topic}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-ink-2 hover:text-signal underline font-mono"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-ink-3">
                  <span>{msg.date}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete message from ${msg.name}?`)) {
                        deleteMessage(msg.id);
                      }
                    }}
                    className="hover:text-red-500 p-1 text-sm font-bold cursor-pointer transition-colors"
                    title="Delete message"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="text-sm text-ink-2 bg-sheet p-3.5 rounded-lg border border-line leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>

              <div className="flex justify-end gap-2 pt-1">
                <a
                  href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.topic)}&body=Hi%20${encodeURIComponent(msg.name)},%0A%0AThank%20you%20for%20reaching%20out!`}
                  className="px-3.5 py-1.5 rounded-full bg-pill text-pill-ink text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Reply via Email ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesTab;
