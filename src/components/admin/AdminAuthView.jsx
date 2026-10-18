import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminAuthView = () => {
  const {
    loginAdmin,
    sendPasswordReset,
    updatePassword,
    currentRoute,
    setCurrentRoute,
    authLoading,
  } = usePortfolio();

  const isResetMode = currentRoute === 'admin-reset' || window.location.hash.includes('admin-reset');
  const [viewMode, setViewMode] = useState(isResetMode ? 'set-new' : 'login'); // 'login' | 'forgot' | 'set-new'

  // Login form state
  const [email, setEmail] = useState('suryasanku800@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setResetError(result.error || 'Failed to initiate password reset.');
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

    if (newPassword.length < 6) {
      setSetNewError('Password must be at least 6 characters long.');
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
      }, 1500);
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
            Protected Area · Cloud & Cryptographic Guard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-ink">
            Studio CMS Authentication
          </h2>
          <p className="text-xs sm:text-sm text-ink-2">
            Secure owner login for <span className="font-mono text-ink font-semibold">suryasanku800@gmail.com</span>
          </p>
        </div>

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
                {/* Password Label with Interactive Eye Icon */}
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-2 hover:text-signal transition-colors cursor-pointer bg-paper border border-line px-2 py-0.5 rounded-md"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

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

              {/* Password Input with Embedded Eye Icon Button */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your protective password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors cursor-pointer p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-signal text-white font-semibold text-xs sm:text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Protective Authentication...</span>
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
              <h3 className="font-bold text-ink text-base">Request Password Reset</h3>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Enter your verified email address to proceed with resetting your protective password.
              </p>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-2">
                <p className="font-semibold text-sm">✓ Reset Verified</p>
                <p className="leading-relaxed">
                  Proceeding to choose a new protective password for{' '}
                  <span className="font-mono font-bold">{resetEmail}</span>.
                </p>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setViewMode('set-new');
                    }}
                    className="px-4 py-1.5 rounded-full bg-signal text-white font-semibold text-xs cursor-pointer hover:opacity-90"
                  >
                    Set New Password Now →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setViewMode('login');
                    }}
                    className="underline text-ink-2 hover:text-ink text-xs cursor-pointer"
                  >
                    Back to Login
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
                    Password recovery is restricted to the verified portfolio owner address.
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
                    disabled={isSendingReset}
                    className="px-5 py-2.5 rounded-full bg-signal text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSendingReset ? 'Verifying...' : 'Reset Password →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View: Set New Password */}
        {viewMode === 'set-new' && (
          <form onSubmit={handleSetNewSubmit} className="space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base">Set New Protective Password</h3>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Choose a new password for your admin account. It will be encrypted with salted hashing.
              </p>
            </div>

            {setNewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-1 text-center">
                <p className="font-semibold text-sm">✓ Protective Password Updated!</p>
                <p>Opening Studio CMS...</p>
              </div>
            ) : (
              <>
                {setNewError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono">
                    {setNewError}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-2 hover:text-signal transition-colors cursor-pointer bg-paper border border-line px-2 py-0.5 rounded-md"
                    >
                      <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 characters)"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-3">
                      Confirm New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-2 hover:text-signal transition-colors cursor-pointer bg-paper border border-line px-2 py-0.5 rounded-md"
                    >
                      <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-line bg-paper text-ink text-sm focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="px-4 py-2 rounded-full border border-line text-xs font-medium text-ink-2 hover:text-ink cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPassword ? 'Saving Password...' : 'Save & Enter Studio →'}
                  </button>
                </div>
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
