import { ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// Initialize reCAPTCHA Enterprise provider
export const getReCaptchaProvider = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined');
    // Return a dummy provider for development to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using dummy reCAPTCHA provider for development');
      return new ReCaptchaEnterpriseProvider('dummy-site-key');
    }
    throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined');
  }

  return new ReCaptchaEnterpriseProvider(siteKey);
};

// Debug token for development
export const getDebugToken = () => {
  if (process.env.NODE_ENV === 'development') {
    const debugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
    if (!debugToken) {
      console.warn('No debug token found. App Check may not work properly in development.');
    }
    return debugToken;
  }
  return null;
}; 