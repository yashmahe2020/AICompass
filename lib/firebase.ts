import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getReCaptchaProvider, getDebugToken } from './recaptcha';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize App Check only in browser environment
let appCheck;
if (typeof window !== 'undefined') {
  try {
    const provider = getReCaptchaProvider();
    const debugToken = getDebugToken();
    
    appCheck = initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
      ...(debugToken && { debugToken }),
    });
    
    // Log success for debugging
    console.log('App Check initialized successfully');
  } catch (error) {
    // Log error but don't crash the app
    console.error('Error initializing App Check:', error);
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { app, db, appCheck }; 