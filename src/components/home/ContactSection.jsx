import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
// Helper for exact illustration and sticker URLs
const ill = (name) => `${import.meta.env.BASE_URL}assets/illustrations/${encodeURIComponent(name)}`;

export const ContactSection = () => {
  const { profile, addMessage, openResume } = usePortfolio();
  const [copyText, setCopyText] = useState('Copy email');
  const [isCopied, setIsCopied] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Job Opportunity');
  const [message, setMessage] = useState('');

  // Submission & validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCopyEmail = async () => {
    const targetEmail = profile.email || 'suryasanku800@gmail.com';
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetEmail);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = targetEmail;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyText('Copied ✓');
      setIsCopied(true);
    } catch {
      setCopyText('Copied ✓');
      setIsCopied(true);
    }

    setTimeout(() => {
      setCopyText('Copy email');
      setIsCopied(false);
    }, 2500);
  };

  const getMailtoUrl = (customData) => {
    const d = customData || lastSubmitted || { name, email, topic, message };
    const targetEmail = profile.email || 'suryasanku800@gmail.com';
    const subject = encodeURIComponent(`Portfolio Inquiry: [${d.topic || 'General'}] from ${d.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hi Surya,\n\nI am contacting you through your portfolio.\n\nName: ${d.name || ''}\nEmail: ${d.email || ''}\nTopic: ${d.topic || ''}\n\nMessage:\n${d.message || ''}\n`
    );
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. you@company.com).';
    }
    if (!message.trim()) {
      newErrors.message = 'Please enter your message.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setNeedsActivation(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const submissionData = {
      name: name.trim(),
      email: email.trim(),
      topic: topic || 'Job Opportunity',
      message: message.trim(),
    };
    setLastSubmitted(submissionData);

    try {
      const result = await addMessage(submissionData);

      if (result.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setTopic('Job Opportunity');
        setMessage('');
        setErrors({});
      } else if (result.needsActivation) {
        setNeedsActivation(true);
      } else {
        setErrorMessage(
          result.emailResult?.error ||
          'Automated email delivery could not be completed. Please send directly using the mail button below.'
        );
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Unable to send message right now. Please try again or email directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setNeedsActivation(false);
    setErrorMessage('');
    setErrors({});
  };

  const rawLinkedIn = profile.socials?.find((s) => s.label?.toLowerCase() === 'linkedin')?.href;
  const linkedInUrl =
    rawLinkedIn &&
    rawLinkedIn !== 'https://linkedin.com' &&
    rawLinkedIn !== 'https://www.linkedin.com' &&
    rawLinkedIn !== 'https://linkedin.com/' &&
    rawLinkedIn !== 'https://www.linkedin.com/' &&
    !rawLinkedIn.includes('/sankusurya')
      ? rawLinkedIn
      : 'https://www.linkedin.com/in/surya-teja-sanku-9b0a7b187';
  const gitHubUrl =
    profile.socials?.find((s) => s.label?.toLowerCase() === 'github')?.href ||
    'https://github.com/Sankusurya';
  const displayEmail = profile.email || 'suryasanku800@gmail.com';

  return (
    <div className="wrap">
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading, Supporting Description, Email, Socials */}
          <div className="lg:col-span-6 space-y-6 relative">
            {/* Orange Paper Plane Flight Path beside heading, angled toward contact form */}
            <img
              src={ill("Orange Paper Plane Flight Path.png")}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="170"
              height="170"
              className="contact-paper-plane"
              style={{
                position: 'absolute',
                top: '-32px',
                right: '12px',
                width: '170px',
                height: 'auto',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 5,
              }}
            />

            <h2
              id="contact-h"
              className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-wider text-ink leading-tight pr-6"
            >
              LET'S BUILD SOMETHING <span className="text-signal italic">MEANINGFUL.</span>
            </h2>

            <p className="text-base text-ink-2 max-w-lg leading-relaxed">
              I'm open to UI/UX Designer, Product Designer, and collaborative design opportunities.
              Have a role or project in mind? Let's connect.
            </p>

            {/* Email pill component */}
            <div className="mailrow inline-flex items-center gap-2 p-1.5 rounded-full border border-line bg-paper shadow-xs max-w-full">
              <a
                href={`mailto:${displayEmail}`}
                className="mail font-mono text-xs sm:text-sm px-3 text-ink hover:text-signal transition-colors select-all truncate"
                title="Send email directly"
              >
                {displayEmail}
              </a>
              <button
                type="button"
                id="copy"
                onClick={handleCopyEmail}
                className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer shrink-0 ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-pill text-pill-ink hover:opacity-90'
                }`}
                aria-label="Copy email address"
              >
                {copyText}
              </button>
            </div>

            {/* Social Links */}
            <div className="socials flex items-center flex-wrap gap-4 pt-2 text-sm text-ink-2">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-signal transition-colors underline font-medium"
              >
                LinkedIn ↗
              </a>
              <span className="text-ink-3">·</span>
              <a
                href={gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-signal transition-colors underline font-medium"
              >
                GitHub ↗
              </a>
              <span className="text-ink-3">·</span>
              <button
                type="button"
                onClick={openResume}
                className="hover:text-signal transition-colors underline font-medium cursor-pointer bg-transparent border-0 p-0 text-inherit text-sm font-sans"
              >
                View Resume ↗
              </button>
            </div>

            {/* Decorative availability card — fills left-column whitespace */}
            <div
              style={{
                marginTop: '28px',
                padding: '20px 24px',
                background: 'var(--sheet)',
                border: '1px solid var(--line)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                maxWidth: '420px',
              }}
            >
              {/* Sticker illustration */}
              <div style={{ flexShrink: 0, paddingTop: '2px' }} aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" fill="var(--signal)" opacity="0.08" stroke="var(--signal)" strokeWidth="1.5"/>
                  {/* Person at desk */}
                  <circle cx="30" cy="18" r="7" fill="var(--signal)" opacity="0.7"/>
                  <path d="M16 42 Q16 30 30 30 Q44 30 44 42" fill="var(--signal)" opacity="0.45"/>
                  {/* Laptop screen */}
                  <rect x="19" y="43" width="22" height="12" rx="2" fill="var(--sheet)" stroke="var(--signal)" strokeWidth="1.4" opacity="0.8"/>
                  <rect x="22" y="46" width="8" height="1.5" rx="0.75" fill="var(--signal)" opacity="0.5"/>
                  <rect x="22" y="49" width="12" height="1.5" rx="0.75" fill="var(--signal)" opacity="0.4"/>
                  <rect x="22" y="52" width="6" height="1.5" rx="0.75" fill="var(--signal)" opacity="0.3"/>
                  {/* Cursor blink */}
                  <path d="M34 46L34 52L37 49L34 46Z" fill="var(--signal)" opacity="0.6"/>
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--f-mono, monospace)',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--signal)',
                    fontWeight: '700',
                    marginBottom: '4px',
                  }}
                >
                  Currently available
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: 'var(--ink-2)',
                    margin: 0,
                  }}
                >
                  Open to full-time UI/UX and Product Designer roles. I respond within 24 hours.
                </p>
              </div>
            </div>

            {/* Second decorative card — design process accent */}
            <div
              style={{
                marginTop: '16px',
                padding: '16px 20px',
                border: '1px dashed var(--line)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                maxWidth: '420px',
                opacity: 0.7,
              }}
            >
              {/* Mini wireframe sticker */}
              <div style={{ flexShrink: 0 }} aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 44 60" fill="none">
                  <rect x="3" y="3" width="38" height="54" rx="7" stroke="var(--signal)" strokeWidth="1.8"/>
                  <rect x="10" y="12" width="24" height="4" rx="2" fill="var(--signal)" opacity="0.5"/>
                  <rect x="10" y="20" width="24" height="8" rx="2" stroke="var(--signal)" strokeWidth="1.2" opacity="0.6"/>
                  <rect x="10" y="32" width="10" height="3" rx="1.5" fill="var(--signal)" opacity="0.4"/>
                  <rect x="10" y="37" width="24" height="3" rx="1.5" fill="var(--signal)" opacity="0.3"/>
                  <circle cx="22" cy="7" r="2" fill="var(--signal)" opacity="0.4"/>
                </svg>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--ink-3)',
                  margin: 0,
                  fontFamily: 'var(--f-mono, monospace)',
                }}
              >
                Figma · Research · Handoff → shipped
              </p>
            </div>
          </div>

          {/* Right Column: Refined Contact Form */}
          <div className="lg:col-span-6 bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-5">
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                GET IN TOUCH
              </span>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wide text-ink mt-1">
                Let's Connect
              </h3>
              <p className="text-xs sm:text-sm text-ink-3 mt-1">
                Have an opportunity or a project in mind? I'd love to hear about it.
              </p>
            </div>

            {isSuccess ? (
              <div
                className="p-6 sm:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-3 animate-fade-in"
                role="status"
                aria-live="polite"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-base sm:text-lg text-ink">
                  Message Sent to Surya's Inbox
                </h4>
                <p className="font-medium text-xs sm:text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
                  Delivered to <strong className="text-ink">{displayEmail}</strong>. Thanks for reaching out! I'll get back to you as soon as possible.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-5 py-2 rounded-full border border-line bg-sheet text-ink hover:border-signal hover:text-signal font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : needsActivation ? (
              <div
                className="p-6 sm:p-8 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center space-y-3 animate-fade-in"
                role="status"
                aria-live="polite"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
                  ✉
                </div>
                <h4 className="font-bold text-base sm:text-lg text-ink">
                  Inquiry Recorded & Activation Pending
                </h4>
                <p className="text-xs sm:text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
                  Your message was saved! A one-time activation email has been sent to <strong className="text-ink">{displayEmail}</strong>. Once activated, submissions flow directly into Surya's inbox automatically.
                </p>
                <p className="text-xs text-ink-3">
                  Want to ensure instant delivery right now? You can also send directly from your email app:
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={getMailtoUrl()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
                  >
                    <span>Open in Mail App (Direct Email) ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-5 py-2 rounded-full border border-line bg-sheet text-ink hover:border-signal hover:text-signal font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Back to form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {errorMessage && (
                  <div
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm space-y-2"
                    role="alert"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{errorMessage}</span>
                      <button
                        type="button"
                        onClick={() => setErrorMessage('')}
                        className="font-bold hover:opacity-80 px-1"
                        aria-label="Dismiss error"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <a
                        href={getMailtoUrl()}
                        className="inline-flex items-center gap-1 font-semibold underline text-signal hover:opacity-90"
                      >
                        Click here to send directly via your email app (mailto) ↗
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Your Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5"
                    >
                      Your Name <span className="text-signal">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Your full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-sheet text-ink text-sm transition-colors focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 disabled:opacity-60 ${
                        errors.name ? 'border-red-500/60 focus:border-red-500' : 'border-line'
                      }`}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5"
                    >
                      Email Address <span className="text-signal">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="you@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-sheet text-ink text-sm transition-colors focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 disabled:opacity-60 ${
                        errors.email ? 'border-red-500/60 focus:border-red-500' : 'border-line'
                      }`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* I'm reaching out about (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-mono uppercase tracking-wider text-ink-3"
                    >
                      I'm reaching out about
                    </label>
                    <span className="text-[11px] font-mono text-ink-3 opacity-70">Optional</span>
                  </div>
                  <select
                    id="contact-topic"
                    value={topic}
                    disabled={isSubmitting}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-sheet text-ink text-sm transition-colors focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 disabled:opacity-60 cursor-pointer"
                  >
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Design Project">Design Project</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Something Else">Something Else</option>
                  </select>
                </div>

                {/* Your Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1.5"
                  >
                    Your Message <span className="text-signal">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder="Tell me a little about the opportunity..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-sheet text-ink text-sm transition-colors focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 disabled:opacity-60 resize-y ${
                      errors.message ? 'border-red-500/60 focus:border-red-500' : 'border-line'
                    }`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-red-500 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <span>Send Message →</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
