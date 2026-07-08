/**
 * HealthQuest — Expo SDK 54 Upgrade Utility
 *
 * This script automates the upgrade of the project to Expo SDK 54:
 * 1. Installs expo v54, react v19, react-dom v19, and react-native v0.81.0.
 * 2. Runs "npx expo install --fix" to automatically update all expo-related packages.
 * 3. Installs react-native-worklets-core (required for NativeWind v4).
 *
 * Run it in your external terminal:
 * node upgrade-project.js
 */
const { execSync } = require('child_process');

function runCmd(cmd) {
  try {
    console.log(`\n🏃 Running: ${cmd}`);
    execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`❌ Failed: ${cmd}`);
    return false;
  }
}

function main() {
  console.log('⚡ Starting Expo SDK 54 Upgrade...');

  // 1. Upgrade core dependencies
  const step1 = runCmd('npm install expo@^54.0.0 react@19.0.0 react-dom@19.0.0 react-native@0.81.0 --legacy-peer-deps');
  if (!step1) {
    console.error('❌ Failed to install core SDK 54 dependencies.');
    process.exit(1);
  }

  // 2. Fix other expo-managed packages to match SDK 54
  console.log('🔧 Upgrading expo-managed dependencies...');
  const step2 = runCmd('npx expo install --fix -- --legacy-peer-deps');
  if (!step2) {
    console.warn('⚠️ Expo install --fix reported some warnings or conflicts, continuing...');
  }

  // 3. Install react-native-worklets-core (required for NativeWind v4)
  console.log('📦 Installing react-native-worklets-core for NativeWind compatibility...');
  const step3 = runCmd('npx expo install react-native-worklets-core -- --legacy-peer-deps');
  if (!step3) {
    console.error('❌ Failed to install react-native-worklets-core.');
    process.exit(1);
  }

  console.log('🎉 Upgrade to Expo SDK 54 completed successfully!');
  console.log('Run the server now using: npx expo start');
}

main();
