"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface RecaptchaCheckboxProps {
  onVerified: (verified: boolean) => void;
}

// Helper to generate a unique callback name per instance
function getUniqueCallbackName() {
  return `onRecaptchaChange_${Math.random().toString(36).substring(2, 15)}`;
}

export function RecaptchaCheckbox({ onVerified }: RecaptchaCheckboxProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const callbackName = useRef(getUniqueCallbackName());

  // Register the callback on window
  useEffect(() => {
    window[callbackName.current] = (response: string) => {
      if (response) {
        setIsVerified(true);
        onVerified(true);
      } else {
        setIsVerified(false);
        onVerified(false);
      }
    };
    return () => {
      delete window[callbackName.current];
    };
  }, [onVerified]);

  // Poll for grecaptcha and render widget
  useEffect(() => {
    if (!recaptchaLoaded || !widgetRef.current) return;
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds if interval is 100ms
    function tryRender() {
      if (window.grecaptcha && window.grecaptcha.render) {
        if (widgetRef.current && widgetRef.current.childNodes.length === 0) {
          widgetId.current = window.grecaptcha.render(widgetRef.current, {
            sitekey: siteKey,
            callback: callbackName.current,
          });
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryRender, 100);
      } else {
        setLoadError(true);
      }
    }
    tryRender();
    // Reset on unmount
    return () => {
      if (widgetId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        window.grecaptcha.reset(widgetId.current);
      }
    };
  }, [recaptchaLoaded, siteKey]);

  return (
    <div className="my-4">
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        onLoad={() => setRecaptchaLoaded(true)}
        strategy="afterInteractive"
      />
      {loadError ? (
        <div className="h-10 bg-red-100 rounded flex items-center justify-center text-red-600">
          Failed to load reCAPTCHA. Please reload the page.
        </div>
      ) : (
        <div>
          <div ref={widgetRef}></div>
          {isVerified && (
            <div className="mt-2 text-sm text-green-600">
              ✓ reCAPTCHA verified
            </div>
          )}
          {!isVerified && !recaptchaLoaded && (
            <div className="h-10 bg-gray-100 rounded flex items-center justify-center">
              Loading reCAPTCHA...
            </div>
          )}
        </div>
      )}
    </div>
  );
} 