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
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { ProfileDocument, AvatarConfig } from '@/shared/types/database';

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
  studentProfile: ProfileDocument | null;
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
  completeOnboarding: (
    nickname: string,
    avatar: AvatarConfig,
    grade: string,
    interests: string[],
    dailyGoalXP: number
  ) => Promise<void>;
  updateStudentProfile: (updates: Partial<ProfileDocument>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  studentProfile: null,
  isLoading: true,
  profileLoading: false,
  error: null,

  initialize: () => {
    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribeStudentProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous profile listeners if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (unsubscribeStudentProfile) {
        unsubscribeStudentProfile();
        unsubscribeStudentProfile = null;
      }

      if (user) {
        set({ user, isLoading: false, profileLoading: true });
        
        // Subscribe to Firestore user profile document
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as UserProfile;
              set({ profile: userData, profileLoading: false });

              // Subscribe to student profile statistics if user is a student
              if (userData.role === 'student' && !unsubscribeStudentProfile) {
                const studentDocRef = doc(db, 'profiles', user.uid);
                unsubscribeStudentProfile = onSnapshot(
                  studentDocRef,
                  (studentSnap) => {
                    if (studentSnap.exists()) {
                      set({ studentProfile: studentSnap.data() as ProfileDocument });
                    } else {
                      set({ studentProfile: null });
                    }
                  },
                  (error) => {
                    console.error('Error fetching student profile snapshot:', error);
                    set({ studentProfile: null });
                  }
                );
              }
            } else {
              set({ profile: null, profileLoading: false, studentProfile: null });
            }
          },
          (error) => {
            console.error('Error fetching user profile snapshot:', error);
            set({ profile: null, profileLoading: false, studentProfile: null });
          }
        );
      } else {
        set({ user: null, profile: null, studentProfile: null, isLoading: false, profileLoading: false });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
      if (unsubscribeStudentProfile) {
        unsubscribeStudentProfile();
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

  completeOnboarding: async (
    nickname: string,
    avatar: AvatarConfig,
    grade: string,
    interests: string[],
    dailyGoalXP: number
  ) => {
    const { user } = get();
    if (!user) throw new Error('No authenticated user found');

    try {
      set({ isLoading: true, error: null });
      const userRef = doc(db, 'users', user.uid);
      const profileRef = doc(db, 'profiles', user.uid);

      // Create student profile in profiles/{userId}
      await setDoc(profileRef, {
        nickname,
        avatar,
        grade,
        interests,
        dailyGoalXP,
        totalXP: 0,
        level: 1,
        coins: 0,
        energy: 100,
        streakCount: 0,
        lastStreakActiveDate: null,
        updatedAt: serverTimestamp(),
      });

      // Update user document to set isOnboarded = true
      await updateDoc(userRef, {
        isOnboarded: true,
      });

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error);
      const message = error.message || 'Failed to complete onboarding';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateStudentProfile: async (updates: Partial<ProfileDocument>) => {
    const { user } = get();
    if (!user) return;
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to update student profile:', error);
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
