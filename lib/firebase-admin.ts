// Import Firebase Admin SDK
import * as admin from 'firebase-admin';

// Initialize Firebase Admin for server-side operations
const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      // For local development, use service account if available
      if (process.env.NODE_ENV === 'development') {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            return admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
          } catch (parseError) {
            console.error('Error parsing Firebase service account:', parseError);
          }
        }
        // If no service account, try to use application default credentials
        try {
          return admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } catch (defaultCredError) {
          console.error('Error using application default credentials:', defaultCredError);
          throw new Error('Firebase Admin initialization failed. Please set up proper credentials.');
        }
      } 
      // Production environment
      else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } catch (parseError) {
          console.error('Error parsing Firebase service account:', parseError);
          throw new Error('Invalid Firebase service account configuration');
        }
      } else {
        throw new Error('Firebase service account not found in production environment');
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return admin.apps[0];
};

// Initialize the admin app
const adminApp = initializeFirebaseAdmin();

// Get Firestore instance
const adminDb = admin.firestore();

export { adminApp, adminDb }; 