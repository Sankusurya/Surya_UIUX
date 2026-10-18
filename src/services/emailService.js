/**
 * Sends a visitor inquiry directly to Surya's email address (suryasanku800@gmail.com).
 * Uses Web3Forms (or Formspree) for instant serverless email delivery.
 */
export const sendContactEmail = async ({ name, email, topic, message }) => {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';
  const targetEmail = 'suryasanku800@gmail.com';

  // If a Web3Forms access key is configured in .env
  if (accessKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio Inquiry: ${topic} from ${name}`,
          from_name: `${name} (via Portfolio)`,
          replyto: email,
          name,
          email,
          topic,
          message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.message || 'Web3Forms service rejected the request.',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: `Email delivery network error: ${err.message}`,
      };
    }
  }

  // Fallback: If no access key is set yet, we notify the caller
  // The message is still stored in the online Supabase database so Surya never loses it.
  return {
    success: false,
    needsKey: true,
    error: `Email service key not configured. Add VITE_WEB3FORMS_ACCESS_KEY to your .env to receive direct emails. Your message was still saved to the Admin CMS inbox.`,
  };
};
