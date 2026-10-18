import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminAuthView = () => {
  const {
    loginAdmin,
    sendPasswordReset,
    updatePassword,
    isSupabaseConfigured,
    currentRoute,
    setCurrentRoute,
    authLoading,
  } = usePortfolio();

  const isResetMode = currentRoute === 'admin-reset' || window.location.hash.includes('admin-reset');
  const [viewMode, setViewMode] = useState(isResetMode ? 'set-new' : 'login'); // 'login' | 'forgot' | 'set-new'

  // Login form state
  const [email, setEmail] = useState('suryasanku800@gmail.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('suryasanku800@gmail.com');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Set new password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setNewError, setSetNewError] = useState('');
  const [setNewSuccess, setSetNewSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const result = await loginAdmin(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials.');
    } else {
      setPassword('');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setIsSendingReset(true);

    const result = await sendPasswordReset(resetEmail);
    setIsSendingReset(false);

    if (!result.success) {
      setResetError(result.error || 'Failed to send password reset email.');
    } else {
      setResetSent(true);
    }
  };

  const handleSetNewSubmit = async (e) => {
    e.preventDefault();
    setSetNewError('');

    if (newPassword !== confirmPassword) {
      setSetNewError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setSetNewError('Password must be at least 8 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    const result = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (!result.success) {
      setSetNewError(result.error || 'Failed to update password.');
    } else {
      setSetNewSuccess(true);
      setTimeout(() => {
        setViewMode('login');
        setCurrentRoute('admin');
        window.location.hash = 'admin';
      }, 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-24 pb-32 max-w-md mx-auto text-center space-y-4 animate-in">
        <div className="w-12 h-12 rounded-full border-2 border-signal border-t-transparent animate-spin mx-auto"></div>
        <p className="text-sm text-ink-2 font-mono">Verifying secure authentication session...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-28 max-w-lg mx-auto px-4">
      <div className="bg-sheet border border-line rounded-3xl p-7 sm:p-10 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-signal/10 border border-signal/20 text-signal flex items-center justify-center text-2xl mx-auto shadow-xs">
            🔒
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold block">
            Protected Area
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-ink">
            Studio CMS Authentication
          </h2>
          <p className="text-xs sm:text-sm text-ink-2">
            Online cloud-authenticated access for the verified portfolio owner.
          </p>
        </div>

        {/* Setup Guard if Supabase Credentials are missing */}
        {!isSupabaseConfigured && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-ink space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold font-mono uppercase tracking-wider">
              <span>⚠️</span>
              <span>Online Authentication Setup Required</span>
            </div>
            <p className="text-ink-2">
              For security, passwords and keys are never hardcoded in this public repository. To connect your cloud authentication service:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-ink font-mono text-[11px] bg-paper p-3 rounded-xl border border-line">
              <li>Create a free project at <span className="text-signal underline">supabase.com</span></li>
              <li>Add your admin user email (<code className="text-signal">suryasanku800@gmail.com</code>) under Authentication → Users</li>
              <li>Copy your Project URL & Anon Key into your local <code className="text-signal">.env</code> file</li>
              <li>Restart the dev server (<code className="text-signal">npm run dev</code>)</li>
            </ol>
            <p className="text-[11px] text-ink-3">
              See <code className="text-ink">.env.example</code> for details. This file is ignored by Git and will never be pushed publicly.
            </p>
          </div>
        )}

        {/* View: Login Mode */}
        {viewMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suryasanku800@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLoginError('');
                    setViewMode('forgot');
                  }}
                  className="text-xs text-ink-3 hover:text-signal underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your secret password"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isSupabaseConfigured}
              className="w-full py-3 rounded-full bg-signal text-white font-semibold text-xs sm:text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying with Server...</span>
                </>
              ) : (
                <span>Sign In to Studio →</span>
              )}
            </button>
          </form>
        )}

        {/* View: Forgot Password (Email Link Request) */}
        {viewMode === 'forgot' && (
          <div className="space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base">Request Password Reset Link</h3>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                A secure, single-use reset link will be sent to your verified email address. No passwords are displayed on screen.
              </p>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-2">
                <p className="font-semibold text-sm">✓ Reset Email Sent!</p>
                <p className="leading-relaxed">
                  Please check your inbox at <span className="font-mono font-bold">{resetEmail}</span>.
                  Click the link in that email to securely choose a new password.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setViewMode('login');
                    }}
                    className="underline font-semibold hover:text-emerald-700 cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {resetError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono">
                    {resetError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5">
                    Your Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="suryasanku800@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                  />
                  <p className="text-[11px] text-ink-3 mt-1">
                    Reset emails can only be sent to the verified portfolio owner address.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetError('');
                      setViewMode('login');
                    }}
                    className="px-4 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset || !isSupabaseConfigured}
                    className="px-5 py-2.5 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSendingReset ? 'Sending Email Link...' : 'Send Reset Link →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View: Set New Password (Triggered via Email Link) */}
        {viewMode === 'set-new' && (
          <form onSubmit={handleSetNewSubmit} className="space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base">Set New Password</h3>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                You have authenticated via your secure email reset link. Choose a new strong password below.
              </p>
            </div>

            {setNewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-1 text-center">
                <p className="font-semibold text-sm">✓ Password Updated Successfully!</p>
                <p>Redirecting to Studio CMS...</p>
              </div>
            ) : (
              <>
                {setNewError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono">
                    {setNewError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full py-2.5 rounded-full bg-signal text-white font-semibold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Saving New Password...' : 'Save New Password & Enter Studio →'}
                </button>
              </>
            )}
          </form>
        )}

        {/* Back to Home Link */}
        <div className="pt-4 border-t border-line text-center">
          <a
            href="#home"
            className="text-xs text-ink-3 hover:text-ink font-mono transition-colors"
          >
            ← Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthView;
