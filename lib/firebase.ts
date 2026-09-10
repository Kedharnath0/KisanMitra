import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase client configuration.
 *
 * Values are read from environment variables (set in .env.local).
 * See .env.example for the required keys.
 *
 * These are client-side keys — safe to expose in the browser.
 * Security is enforced by Firestore rules and Firebase Auth.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'kisanmitra-ce6cb.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'kisanmitra-ce6cb',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kisanmitra-ce6cb.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

/**
 * Initialize Firebase App.
 * Uses getApps() guard to prevent re-initialization during Next.js HMR.
 * No Firebase Admin SDK — client-side only.
 */
const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/** Firebase Authentication instance. */
export const auth: Auth = getAuth(app);

/** Cloud Firestore instance. */
export const db: Firestore = getFirestore(app);

export default app;
