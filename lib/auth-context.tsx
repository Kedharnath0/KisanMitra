'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from './auth';
import { getUserProfile } from './firestore';
import { User } from '@/types';

// ─── Context Type ──────────────────────────────────────────────────────

interface AuthContextValue {
  /** Raw Firebase Auth user (uid, email, etc.). Null if not signed in. */
  firebaseUser: FirebaseUser | null;

  /** Firestore user profile (name, role, location, etc.). Null if not loaded or not signed in. */
  userProfile: User | null;

  /** True while the initial auth state is resolving. Show a loader during this phase. */
  loading: boolean;
}

// ─── Context ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userProfile: null,
  loading: true,
});

// ─── Provider ──────────────────────────────────────────────────────────

/**
 * AuthProvider wraps the app and provides auth state to all children.
 *
 * Usage (in the root layout):
 * ```tsx
 * <AuthProvider>
 *   {children}
 * </AuthProvider>
 * ```
 *
 * Listens to Firebase Auth state changes and fetches the corresponding
 * Firestore user profile. Exposes both via `useAuth()`.
 *
 * Sign-in / sign-up / sign-out functions are NOT on the context.
 * Import them directly from `lib/auth.ts` to keep the context lean.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────

/**
 * Access the current auth state.
 *
 * Must be used within an `<AuthProvider>`.
 *
 * @example
 * ```tsx
 * const { userProfile, loading } = useAuth();
 * if (loading) return <LoadingState />;
 * if (!userProfile) return <LoginPage />;
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
