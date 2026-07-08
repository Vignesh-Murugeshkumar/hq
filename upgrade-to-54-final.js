/**
 * HealthQuest — Expo SDK 54 Absolute Upgrade Script
 *
 * Programmatically upgrades the core libraries to SDK 54,
 * removes secondary native packages to avoid installation errors,
 * and uses Expo's dependency resolver to install them in their correct versions,
 * including react-native-worklets (required by Reanimated v4).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, 'package.json');

const coreSdk54Dependencies = {
  "expo": "~54.0.0",
  "expo-router": "~6.0.0",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "react-native": "0.81.0"
};

const coreSdk54DevDependencies = {
  "jest-expo": "~54.0.0",
  "@types/react": "~19.0.0"
};

// Native packages to clean up and reinstall via Expo CLI
const otherPackages = [
  "expo-status-bar",
  "expo-constants",
  "expo-linking",
  "expo-splash-screen",
  "expo-font",
  "expo-image",
  "expo-linear-gradient",
  "expo-haptics",
  "expo-secure-store",
  "expo-notifications",
  "expo-speech",
  "expo-av",
  "expo-image-picker",
  "expo-document-picker",
  "expo-file-system",
  "expo-dev-client",
  "expo-video",
  "react-native-worklets", // Required by Reanimated v4 in SDK 54
  "react-native-worklets-core", // Required by NativeWind v4
  "react-native-reanimated",
  "react-native-gesture-handler",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-svg",
  "@react-native-async-storage/async-storage"
];

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
  console.log('📝 Reading package.json...');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  console.log('🧹 Cleaning old native packages from dependencies to avoid conflicts...');
  for (const pkgName of otherPackages) {
    delete pkg.dependencies[pkgName];
  }

  console.log('🔄 Injecting SDK 54 core dependencies...');
  pkg.dependencies = {
    ...pkg.dependencies,
    ...coreSdk54Dependencies
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    ...coreSdk54DevDependencies
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log('✅ package.json updated and cleaned.');

  console.log('📦 Running npm install to lock in core packages...');
  const step1 = runCmd('npm install --legacy-peer-deps');
  if (!step1) {
    console.error('❌ Core install failed.');
    process.exit(1);
  }

  console.log('🔧 Resolving and installing all secondary native modules compatible with SDK 54...');
  const installCmd = `npx expo install ${otherPackages.join(' ')} -- --legacy-peer-deps`;
  const step2 = runCmd(installCmd);
  
  if (step2) {
    console.log('\n🎉 SDK 54 upgrade completed successfully!');
    console.log('Run the app using: npx expo start --clear');
  } else {
    console.error('\n❌ Failed to resolve and install native modules.');
    process.exit(1);
  }
}

main();
