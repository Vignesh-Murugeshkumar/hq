/**
 * HealthQuest — Achievements Seeding Utility
 *
 * Automatically parses local .env, initializes Firebase SDK,
 * and seeds Firestore with predefined gamified achievement templates.
 *
 * Run it in your external terminal:
 * node scratch/seed-achievements.js
 */
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch, serverTimestamp } = require('firebase/firestore');

const envPath = path.join(__dirname, '..', '.env');

function loadEnv() {
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Make sure setup-firebase.js has run successfully.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, ''); // strip quotes
      env[key] = val;
    }
  });

  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach_first_lesson',
    title: 'Early Bird',
    description: 'Complete your first educational lesson.',
    icon: '🍎',
    coinsReward: 15,
    xpReward: 10,
  },
  {
    id: 'ach_water_goal',
    title: 'Super Hydrated',
    description: 'Drink 8 glasses of water in a single day.',
    icon: '💧',
    coinsReward: 20,
    xpReward: 15,
  },
  {
    id: 'ach_first_quiz',
    title: 'Energy Builder',
    description: 'Pass your first educational lesson quiz.',
    icon: '⚡',
    coinsReward: 15,
    xpReward: 10,
  },
  {
    id: 'ach_perfect_quizzes',
    title: 'Brainiac',
    description: 'Get a perfect 100% score on a quiz.',
    icon: '🎓',
    coinsReward: 30,
    xpReward: 25,
  }
];

async function seed() {
  console.log('🚀 Seeding initial HealthQuest achievements in Firestore...');
  const batch = writeBatch(db);

  for (const ach of MOCK_ACHIEVEMENTS) {
    const achRef = doc(db, 'achievements', ach.id);
    batch.set(achRef, {
      ...ach,
      createdAt: serverTimestamp()
    });
    console.log(`➕ Queued Achievement: ${ach.title} (${ach.id})`);
  }

  try {
    await batch.commit();
    console.log('🎉 Successfully committed batch write! Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed achievements:', error);
    process.exit(1);
  }
}

seed();
