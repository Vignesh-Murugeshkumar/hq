/**
 * HealthQuest — Auth Store (Zustand)
 *
 * Manages authentication state globally.
 * Uses Firebase Auth onAuthStateChanged listener for reactive auth state.
 * This is the single source of truth for "is the user logged in?"
 */
import { create } from 'zustand';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface UserProfile {
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  isOnboarded: boolean;
  settings: {
    notificationsEnabled: boolean;
    voiceEnabled: boolean;
    soundEnabled: boolean;
    hapticEnabled: boolean;
  };
  createdAt: any;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  profileLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  profileLoading: false,
  error: null,

  initialize: () => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        set({ user, isLoading: false, profileLoading: true });
        
        // Subscribe to Firestore user profile document
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              set({ profile: docSnap.data() as UserProfile, profileLoading: false });
            } else {
              set({ profile: null, profileLoading: false });
            }
          },
          (error) => {
            console.error('Error fetching user profile snapshot:', error);
            set({ profile: null, profileLoading: false });
          }
        );
      } else {
        set({ user: null, profile: null, isLoading: false, profileLoading: false });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(credential.user);
      return credential.user;
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await firebaseSignOut(auth);
    } catch (error: any) {
      set({ error: 'Failed to sign out', isLoading: false });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  sendVerification: async () => {
    const { user } = get();
    if (!user) throw new Error('No user signed in');
    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      set({ error: 'Failed to send verification email' });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

/** Maps Firebase Auth error codes to child-friendly messages */
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in!';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Try again!';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'No internet connection. Check your network and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
