import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminLoginModal = () => {
  const { isLoginModalOpen, closeAdminLogin, loginAdmin, openForgotModal } = usePortfolio();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 800);
    } else {
      setPassword('');
      setError(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-sheet text-ink border border-line rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative ${
          error ? 'animate-shake' : ''
        }`}
      >
        <button
          type="button"
          onClick={closeAdminLogin}
          className="absolute top-4 right-4 text-ink-3 hover:text-ink text-xl font-bold p-1 cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="mono text-signal block mb-1">Portfolio CMS</span>
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
            Owner Authentication
          </h2>
          <p className="text-sm text-ink-2 mt-1">
            Enter your admin master password to manage projects and live portfolio content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (default: Surya@0206)"
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-signal text-sm"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 font-mono">
                Incorrect password. Default is Surya@0206
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                closeAdminLogin();
                openForgotModal();
              }}
              className="text-xs text-ink-3 hover:text-signal underline cursor-pointer"
            >
              Forgot password?
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeAdminLogin}
                className="px-4 py-2 rounded-full border border-line text-ink-2 hover:text-ink text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-signal text-white hover:opacity-90 text-xs font-semibold cursor-pointer"
              >
                Sign In →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
