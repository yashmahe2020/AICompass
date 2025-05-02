"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface RecaptchaCheckboxProps {
  onVerified: (verified: boolean) => void;
}

export function RecaptchaCheckbox({ onVerified }: RecaptchaCheckboxProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const onRecaptchaChange = (response: string) => {
    console.log('reCAPTCHA response:', response);
    if (response) {
      setIsVerified(true);
      onVerified(true);
    } else {
      setIsVerified(false);
      onVerified(false);
    }
  };

  // Add the callback to window object
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).onRecaptchaChange = onRecaptchaChange;
    }
  }, [onVerified]);

  return (
    <div className="my-4">
      <Script 
        src="https://www.google.com/recaptcha/api.js" 
        onLoad={() => setRecaptchaLoaded(true)}
      />
      
      {recaptchaLoaded ? (
        <div 
          className="g-recaptcha" 
          data-sitekey={siteKey}
          data-callback="onRecaptchaChange"
        ></div>
      ) : (
        <div className="h-10 bg-gray-100 rounded flex items-center justify-center">
          Loading reCAPTCHA...
        </div>
      )}
      
      {isVerified && (
        <div className="mt-2 text-sm text-green-600">
          ✓ reCAPTCHA verified
        </div>
      )}
    </div>
  );
} 