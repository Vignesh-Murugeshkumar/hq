/**
 * HealthQuest — Learning Module Seeding Utility
 *
 * Automatically parses local .env, initializes Firebase SDK,
 * and seeds Firestore with initial child-friendly educational courses.
 *
 * Run it in your external terminal:
 * node scratch/seed-lessons.js
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

const MOCK_LESSONS = [
  {
    id: 'lesson_1_nutrition',
    title: 'Intro to Fruits 🍎',
    description: 'Discover why eating different colored fruits is like giving your body special superpowers!',
    category: 'nutrition',
    grade: 'Grade 3',
    xpReward: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=400&auto=format&fit=crop',
    duration: 15, // short duration for easy testing
    sections: [
      {
        id: 'sec_1',
        type: 'video',
        title: 'Watch & Learn',
        content: 'Fruits are packed with vitamins that help you think fast and run super quick!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 15
      },
      {
        id: 'sec_2',
        type: 'text',
        title: 'Color Power!',
        content: 'Red fruits like apples protect your heart. Yellow fruits like bananas give you steady energy. Purple fruits like grapes help your brain remember things! Try to eat a rainbow of fruits every single day.'
      }
    ]
  },
  {
    id: 'lesson_2_fitness',
    title: 'Active Playing 🏃',
    description: 'Learn why jumping, running, and playing games outside keeps your heart happy and muscles growing!',
    category: 'fitness',
    grade: 'Grade 3',
    xpReward: 20,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
    duration: 20,
    sections: [
      {
        id: 'sec_1',
        type: 'video',
        title: 'Move Your Body',
        content: 'Your heart is a muscle that gets stronger every time you run, jump, or dance!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 20
      },
      {
        id: 'sec_2',
        type: 'text',
        title: '30-Minute Challenge',
        content: 'Try to play actively for at least 30 minutes today. Go for a bike ride, play tag with friends, or show off your best dance moves in the living room!'
      }
    ]
  },
  {
    id: 'lesson_3_sleep',
    title: 'Power of Sleep 💤',
    description: 'Sleeping is when your body recharges like a phone, repairs muscles, and creates memories.',
    category: 'sleep',
    grade: 'Grade 3',
    xpReward: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?q=80&w=400&auto=format&fit=crop',
    duration: 15,
    sections: [
      {
        id: 'sec_1',
        type: 'video',
        title: 'Why We Sleep',
        content: 'Sleeping helps your brain store what you learned today and recharges your batteries for tomorrow.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 15
      },
      {
        id: 'sec_2',
        type: 'text',
        title: 'Sleep Rules',
        content: 'Kids need 9 to 11 hours of sleep every night. Turn off all screens (tablets, phones, TVs) at least 1 hour before bedtime to help your brain get ready for deep, relaxing rest.'
      }
    ]
  },
  {
    id: 'lesson_4_hygiene',
    title: 'Sparkling Teeth 🧼',
    description: 'Learn the proper way to brush your teeth and keep germs away from your beautiful smile!',
    category: 'hygiene',
    grade: 'Grade 3',
    xpReward: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop',
    duration: 15,
    sections: [
      {
        id: 'sec_1',
        type: 'video',
        title: 'Brush Like a Pro',
        content: 'Brushing twice a day keeps cavity bugs away!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 15
      },
      {
        id: 'sec_2',
        type: 'text',
        title: 'The 2-Minute Rule',
        content: 'Brushing should take exactly 2 minutes! Make sure to brush the fronts, backs, and chewing surfaces of all your teeth. Don\'t forget to brush your tongue gently too!'
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Seeding initial HealthQuest lessons in Firestore...');
  const batch = writeBatch(db);

  for (const lesson of MOCK_LESSONS) {
    const lessonRef = doc(db, 'lessons', lesson.id);
    batch.set(lessonRef, {
      ...lesson,
      createdAt: serverTimestamp()
    });
    console.log(`➕ Queued: ${lesson.title} (${lesson.id})`);
  }

  try {
    await batch.commit();
    console.log('🎉 Successfully committed batch write! Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed lessons:', error);
    process.exit(1);
  }
}

seed();
