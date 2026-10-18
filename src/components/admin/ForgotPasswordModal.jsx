import React, { useState } from 'react';
import { usePortfolio, REGISTERED_ADMIN_EMAIL } from '../../context/PortfolioContext';

export const ForgotPasswordModal = () => {
  const { isForgotModalOpen, closeForgotModal, openAdminLogin, updateMasterPassword } = usePortfolio();
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isForgotModalOpen) return null;

  const handleReset = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    updateMasterPassword(newPassword);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      closeForgotModal();
      openAdminLogin();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-sheet text-ink border border-line rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          type="button"
          onClick={closeForgotModal}
          className="absolute top-4 right-4 text-ink-3 hover:text-ink text-xl font-bold p-1 cursor-pointer"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="mono text-signal block mb-1">Account Recovery</span>
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
            Reset Password
          </h2>
          <p className="text-sm text-ink-2 mt-1">
            Registered admin contact: <span className="font-mono text-ink font-semibold">{REGISTERED_ADMIN_EMAIL}</span>.
            The default system password is <span className="font-mono font-semibold text-signal">Surya@0206</span>.
          </p>
        </div>

        {resetSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-center text-sm font-medium">
            Password successfully updated! Returning to login...
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                New Master Password
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new master password"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-signal text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  closeForgotModal();
                  openAdminLogin();
                }}
                className="px-4 py-2 rounded-full border border-line text-ink-2 hover:text-ink text-xs font-medium cursor-pointer"
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-signal text-white hover:opacity-90 text-xs font-semibold cursor-pointer"
              >
                Save New Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
