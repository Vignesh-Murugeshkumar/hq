const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : '';
};

const firebaseConfig = {
  apiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID')
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'scattofot@gmail.com';
const password = 'teach@2104';

async function run() {
  console.log(`⏳ Registering teacher account: ${email}...`);
  let uid;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    uid = userCredential.user.uid;
    console.log(`✅ Auth user created successfully with UID: ${uid}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Auth user already exists. Attempting to sign in to retrieve UID...');
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        console.log(`✅ Signed in successfully. UID: ${uid}`);
      } catch (signInErr) {
        console.error('❌ Failed to sign in. The user exists but the password might be different:', signInErr.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Failed to create user in Firebase Auth:', err.message);
      process.exit(1);
    }
  }

  // Set role in firestore
  console.log(`⏳ Writing teacher role to Firestore at users/${uid}...`);
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      email: email,
      role: 'teacher',
      isOnboarded: true,
      settings: {
        notificationsEnabled: true,
        voiceEnabled: true,
        soundEnabled: true,
        hapticEnabled: true
      },
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`\n🎉 Success! Account is now fully configured as a 'teacher'.`);
    console.log(`You can now log in to the Teacher Web Portal using:`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
  } catch (err) {
    console.error('❌ Failed to set teacher role in Firestore:', err.message);
    console.error('Make sure your Firestore Security Rules allow writes!');
  }
}

run();
