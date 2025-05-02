"use client";

import { useState } from 'react';
import Script from 'next/script';

export default function SimpleRecaptcha() {
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const checkRecaptcha = () => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      const response = window.grecaptcha.getResponse();
      if (response) {
        setIsVerified(true);
        console.log('reCAPTCHA response:', response);
      } else {
        setIsVerified(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Simple reCAPTCHA Test</h1>
      <p className="mb-4">This is a direct implementation of reCAPTCHA using the standard approach.</p>
      
      <div className="border border-gray-200 p-6 rounded-lg mb-4">
        <Script 
          src="https://www.google.com/recaptcha/api.js" 
          onLoad={() => setRecaptchaLoaded(true)}
        />
        
        {recaptchaLoaded ? (
          <div className="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
        ) : (
          <div className="h-10 bg-gray-100 rounded flex items-center justify-center">
            Loading reCAPTCHA...
          </div>
        )}
        
        <button 
          onClick={checkRecaptcha}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Verify reCAPTCHA
        </button>
      </div>
      
      <div className={`p-4 rounded ${isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <p className="font-medium">Status: {isVerified ? 'Verified' : 'Not verified'}</p>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">About this test</h2>
        <p>This page uses Google's test site key (6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI) which is always accepted.</p>
        <p className="mt-2">If this works but your implementation doesn't, the issue is likely with your site key or domain settings.</p>
      </div>
    </div>
  );
} 