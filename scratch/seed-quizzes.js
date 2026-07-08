/**
 * HealthQuest — Quiz Engine Seeding Utility
 *
 * Automatically parses local .env, initializes Firebase SDK,
 * and seeds Firestore with interactive trivia quizzes linked to lessons.
 *
 * Run it in your external terminal:
 * node scratch/seed-quizzes.js
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

const MOCK_QUIZZES = [
  {
    id: 'quiz_1_nutrition',
    lessonId: 'lesson_1_nutrition',
    title: 'Intro to Fruits Quiz 🧠',
    energyCost: 10,
    rewardsXP: 25,
    rewardsCoins: 15,
    questions: [
      {
        id: 'q1_1',
        type: 'mcq',
        question: 'Which color fruit gives steady energy like a battery?',
        options: ['Red', 'Yellow', 'Blue', 'Black'],
        correctAnswer: 'Yellow',
        explanation: 'Yellow fruits like bananas are packed with healthy carbohydrates that give your body steady, long-lasting energy!'
      },
      {
        id: 'q1_2',
        type: 'tf',
        question: 'Red fruits like apples are great for protecting your lungs.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Red fruits like strawberries and apples are excellent for keeping your HEART strong and healthy!'
      },
      {
        id: 'q1_3',
        type: 'scenario',
        question: 'Max wants to help his brain remember facts for a school test tomorrow. Which fruit should he eat?',
        options: ['Apples', 'Grapes', 'Lemons', 'Bananas'],
        correctAnswer: 'Grapes',
        explanation: 'Purple fruits like grapes and blueberries are rich in antioxidants that boost memory and help brain functions!'
      }
    ]
  },
  {
    id: 'quiz_2_fitness',
    lessonId: 'lesson_2_fitness',
    title: 'Active Playing Quiz 🧠',
    energyCost: 10,
    rewardsXP: 30,
    rewardsCoins: 20,
    questions: [
      {
        id: 'q2_1',
        type: 'tf',
        question: 'Your heart is actually a muscle.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Yes! Your heart is a very important muscle that gets stronger and healthier every time you run, play, and stay active!'
      },
      {
        id: 'q2_2',
        type: 'mcq',
        question: 'How many minutes should kids play actively each day to stay healthy?',
        options: ['5 minutes', '10 minutes', '30 minutes', '180 minutes'],
        correctAnswer: '30 minutes',
        explanation: 'Playing actively for at least 30 minutes keeps your heart pumping and makes your muscles and bones strong!'
      }
    ]
  },
  {
    id: 'quiz_3_sleep',
    lessonId: 'lesson_3_sleep',
    title: 'Power of Sleep Quiz 🧠',
    energyCost: 10,
    rewardsXP: 25,
    rewardsCoins: 15,
    questions: [
      {
        id: 'q3_1',
        type: 'mcq',
        question: 'What should you do with tablet/phone screens 1 hour before bedtime?',
        options: ['Play a game', 'Turn them off', 'Watch a video', 'Keep them under the pillow'],
        correctAnswer: 'Turn them off',
        explanation: 'Turning off screens 1 hour before bed helps your brain relax and tells your body it is time for restful sleep!'
      },
      {
        id: 'q3_2',
        type: 'tf',
        question: 'Growing kids need about 9 to 11 hours of sleep every night.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Yes! Growing kids need 9 to 11 hours of sleep to fully recharge their body and store new memories!'
      }
    ]
  },
  {
    id: 'quiz_4_hygiene',
    lessonId: 'lesson_4_hygiene',
    title: 'Sparkling Teeth Quiz 🧠',
    energyCost: 10,
    rewardsXP: 25,
    rewardsCoins: 15,
    questions: [
      {
        id: 'q4_1',
        type: 'mcq',
        question: 'How many minutes should you brush your teeth for to clean them properly?',
        options: ['30 seconds', '1 minute', '2 minutes', '5 minutes'],
        correctAnswer: '2 minutes',
        explanation: 'Dentists recommend brushing for exactly 2 minutes to make sure you clean all parts of your teeth and get rid of cavity bugs!'
      }
    ]
  }
];

async function seed() {
  console.log('🚀 Seeding initial HealthQuest quizzes in Firestore...');
  const batch = writeBatch(db);

  for (const quiz of MOCK_QUIZZES) {
    const quizRef = doc(db, 'quizzes', quiz.id);
    batch.set(quizRef, {
      ...quiz,
      createdAt: serverTimestamp()
    });
    console.log(`➕ Queued Quiz: ${quiz.title} (${quiz.id})`);
  }

  try {
    await batch.commit();
    console.log('🎉 Successfully committed batch write! Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed quizzes:', error);
    process.exit(1);
  }
}

seed();
