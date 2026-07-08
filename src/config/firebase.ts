/**
 * HealthQuest — Firebase Configuration
 *
 * Uses the Firebase JS SDK (v11) for Expo managed workflow compatibility.
 * This provides Auth, Firestore, and Storage without native modules,
 * allowing development with Expo Go during early phases.
 *
 * For production, we'll add @react-native-firebase for Crashlytics,
 * Analytics, and FCM which require native modules.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project called "HealthQuest"
 * 3. Enable Authentication (Email/Password)
 * 4. Create a Firestore database (start in test mode, we'll add rules later)
 * 5. Enable Storage
 * 6. Add an Android app with package name: com.healthquest.app
 * 7. Download google-services.json to the project root
 * 8. Copy the web app config values to .env file
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

// Initialize Firebase (singleton pattern — safe for hot reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native persistence (sessions survive app restarts)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
