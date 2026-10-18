import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Toast = () => {
  const { toast, dismissToast } = usePortfolio();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
    error: 'bg-red-950/90 border-red-500/40 text-red-100',
    info: 'bg-blue-950/90 border-blue-500/40 text-blue-100',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
  }[toast.type || 'info'];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠️',
  }[toast.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in" role="alert">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${bgStyles}`}
      >
        <span className="text-base font-bold flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 text-xs space-y-1">
          <p className="font-semibold text-sm leading-snug">{toast.message}</p>
          {toast.detail && (
            <p className="opacity-80 text-[11px] leading-relaxed break-words">{toast.detail}</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismissToast}
          className="text-xs font-bold opacity-60 hover:opacity-100 p-1 cursor-pointer"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
