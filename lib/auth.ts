import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './firestore';
import { UserRole } from '@/types';

/**
 * Sign in an existing user with email and password.
 *
 * @throws FirebaseError if credentials are invalid.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  profile: {
    name: string;
    phone: string;
    role: UserRole;
    location: string;
    district?: string;
  }
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserProfile(credential.user.uid, {
    name: profile.name,
    phone: profile.phone,
    role: profile.role,
    location: profile.location,
    district: profile.district,
    verified: false,
  });

  return credential;
}

/**
 * Register a new user with email/password and create their Firestore profile.
 *
 * The Firestore `users/{uid}` document is created immediately after
 * Firebase Auth registration. If profile creation fails, the auth user
 * still exists but has no Firestore profile — acceptable for prototype.
 *
 * @throws FirebaseError if registration fails (e.g. email already in use).
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

/**
 * Get the currently authenticated Firebase user, or null if not signed in.
 * This is a synchronous snapshot — use `onAuthChange` for reactive updates.
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Subscribe to Firebase Auth state changes.
 *
 * The callback fires immediately with the current auth state,
 * then again whenever the user signs in or out.
 *
 * @returns An unsubscribe function. Call it to stop listening.
 */
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
