/**
 * Sends a visitor inquiry directly to Surya's email inbox (suryasanku800@gmail.com).
 * Uses a multi-tiered serverless email delivery architecture:
 * 1. Web3Forms API (if VITE_WEB3FORMS_ACCESS_KEY is set in environment)
 * 2. FormSubmit AJAX API (free, zero-config serverless direct delivery to suryasanku800@gmail.com)
 */

export const sendContactEmail = async ({ name, email, topic, message }) => {
  const targetEmail = 'suryasanku800@gmail.com';
  const web3AccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

  // Tier 1: If Web3Forms access key is configured, attempt Web3Forms
  if (web3AccessKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3AccessKey,
          subject: `Portfolio Inquiry: [${topic || 'General'}] from ${name}`,
          from_name: `${name} (via Portfolio)`,
          replyto: email,
          name,
          email,
          topic: topic || 'Job Opportunity',
          message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return { success: true, service: 'web3forms' };
      }
      console.warn('Web3Forms returned unsuccessful status:', result.message);
    } catch (err) {
      console.warn('Web3Forms delivery failed, trying FormSubmit fallback:', err);
    }
  }

  // Tier 2: FormSubmit.co serverless endpoint for suryasanku800@gmail.com
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        topic: topic || 'Job Opportunity',
        message,
        _subject: `New Portfolio Message: [${topic || 'Inquiry'}] from ${name}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const result = await response.json();

    // FormSubmit returns boolean or string success
    if (result.success === true || result.success === 'true') {
      return { success: true, service: 'formsubmit' };
    }

    // Check if FormSubmit requires initial one-time activation
    const msg = String(result.message || '');
    if (msg.toLowerCase().includes('activation') || msg.toLowerCase().includes('activate')) {
      return {
        success: false,
        needsActivation: true,
        message: result.message || 'One-time FormSubmit activation email sent to suryasanku800@gmail.com.',
        targetEmail,
      };
    }

    return {
      success: false,
      error: result.message || 'Email delivery could not be completed via FormSubmit.',
      targetEmail,
    };
  } catch (err) {
    return {
      success: false,
      error: `Network error delivering email: ${err.message}`,
      targetEmail,
    };
  }
};
