"use client";

import { useState, useEffect } from 'react';
import { RecaptchaCheckbox } from '@/components/recaptcha-checkbox';

export default function TestRecaptcha() {
  const [isVerified, setIsVerified] = useState(false);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if the site key is available
    const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    setSiteKey(key || null);
    
    // Log the key for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('reCAPTCHA Site Key:', key ? 'Present' : 'Missing');
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test reCAPTCHA</h1>
      <p className="mb-4">This page is to test if reCAPTCHA is working properly.</p>
      
      {!siteKey ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <p className="font-bold">Error: reCAPTCHA site key is missing!</p>
          <p className="mt-2">Please add your reCAPTCHA site key to your .env.local file:</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded">NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key</pre>
        </div>
      ) : (
        <div className="mb-4">
          <RecaptchaCheckbox onVerified={setIsVerified} />
        </div>
      )}
      
      <div className="mt-4">
        <p>Status: {isVerified ? 'Verified' : 'Not verified'}</p>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure you have a valid reCAPTCHA v2 site key</li>
          <li>Check that your domain (localhost) is allowed in the reCAPTCHA admin console</li>
          <li>Try opening the browser console to see if there are any errors</li>
          <li>Try a different browser if it's still not working</li>
        </ul>
      </div>
    </div>
  );
} 