import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const ContactSection = () => {
  const { profile, addMessage, openResume } = usePortfolio();
  const [copyText, setCopyText] = useState('Copy email');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Full-time Junior UX/UI Role');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email || 'suryasanku800@gmail.com');
      setCopyText('Copied ✓');
    } catch {
      setCopyText('Selected, press Ctrl+C');
    }
    setTimeout(() => {
      setCopyText('Copy email');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    addMessage({
      name,
      email,
      topic,
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="wrap">
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading, Pitch, Quick Mail */}
          <div className="lg:col-span-6 space-y-6">
            <h2 id="contact-h" className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-wider text-ink leading-tight">
              Feel like <span className="text-signal">building</span>
              <br />
              something together?
            </h2>
            <p className="text-base text-ink-2 max-w-lg leading-relaxed">
              Open to Junior UX/UI and Product Design roles, contract assignments, and collaborative projects. I respond within 24 hours.
            </p>

            {/* Email pill */}
            <div className="mailrow inline-flex items-center gap-2 p-1.5 rounded-full border border-line bg-paper shadow-xs max-w-md">
              <span className="mail font-mono text-xs sm:text-sm px-3 text-ink select-all" id="mail">
                {profile.email || 'suryasanku800@gmail.com'}
              </span>
              <button
                type="button"
                id="copy"
                onClick={handleCopyEmail}
                className="px-4 py-1.5 rounded-full bg-pill text-pill-ink font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                {copyText}
              </button>
            </div>

            {/* Social Links */}
            <div className="socials flex items-center flex-wrap gap-4 pt-2 text-sm text-ink-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-signal transition-colors underline font-medium"
              >
                LinkedIn ↗
              </a>
              <span className="text-ink-3">·</span>
              <a
                href="https://github.com/Sankusurya"
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
                View Resume 📄
              </button>
            </div>
          </div>

          {/* Right Column: Direct Interactive Inquiry Form */}
          <div className="lg:col-span-6 bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-bold font-display uppercase text-ink mt-0.5">
                Send a Message
              </h3>
              <p className="text-xs text-ink-3">
                Drop your details below and I'll receive it instantly.
              </p>
            </div>

            {submitted ? (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 text-center animate-in">
                <span className="text-2xl block">✓</span>
                <p className="font-semibold text-sm">Message Sent Successfully!</p>
                <p className="text-xs opacity-90">
                  Thank you for reaching out. Surya will review your note and respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-sheet text-ink text-sm focus:outline-none focus:border-signal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-sheet text-ink text-sm focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                    Discussion Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-sheet text-ink text-sm focus:outline-none focus:border-signal"
                  >
                    <option value="Full-time Junior UX/UI Role">Full-time Junior UX/UI & Product Role</option>
                    <option value="Contract / Freelance Project">Contract / Freelance Project</option>
                    <option value="Design System Consulting">Design System Consulting</option>
                    <option value="Quick Coffee Chat / Portfolio Review">Quick Coffee Chat / Portfolio Review</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-3 mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your team, problem, or role..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-sheet text-ink text-sm focus:outline-none focus:border-signal"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                  style={{ backgroundColor: 'var(--signal)', color: 'var(--signal-ink, #ffffff)' }}
                >
                  Send Inquiry Message →
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
