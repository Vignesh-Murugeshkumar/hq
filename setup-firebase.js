/**
 * HealthQuest — Firebase Automated Setup Utility
 *
 * This script automates the Firebase Web App registration and configuration.
 * It will:
 * 1. Log in to Firebase CLI if necessary.
 * 2. Set the active project to 550307867405.
 * 3. Find or register a Web App named "healthquest-web".
 * 4. Fetch the SDK configuration parameters.
 * 5. Automatically write them to your local .env file.
 *
 * Run it in your external terminal:
 * node setup-firebase.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = '550307867405';
const APP_NICKNAME = 'healthquest-web';
const ENV_PATH = path.join(__dirname, '.env');

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    const detail = err.stderr ? err.stderr.trim() : err.message;
    throw new Error(`Command: "${cmd}" failed.\nReason: ${detail}`);
  }
}

async function main() {
  console.log('🔥 Initializing Firebase Setup...');

  // 1. Check Login Status
  try {
    const loginList = runCmd('npx -y firebase-tools@latest login:list');
    if (loginList.includes('No users logged in')) {
      console.log('🔑 Please log in to Firebase in the browser window that opens...');
      runCmd('npx -y firebase-tools@latest login');
    } else {
      console.log('✅ Firebase user logged in.');
    }
  } catch (err) {
    console.log('🔑 Log in to Firebase in the browser window...');
    runCmd('npx -y firebase-tools@latest login');
  }

  // 2. Resolve Project ID from Project Number
  let resolvedProjectId = PROJECT_ID;
  console.log(`🔎 Resolving project ID for project number: ${PROJECT_ID}...`);
  try {
    const rawProjectsOutput = runCmd('npx -y firebase-tools@latest projects:list');
    const cleanProjectsOutput = rawProjectsOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    const lines = cleanProjectsOutput.split('\n');
    for (const line of lines) {
      if (line.includes(PROJECT_ID)) {
        // Line format usually: │ Display Name │ Project ID │ Project Number │
        const parts = line.split('│').map(p => p.trim());
        if (parts.length > 2) {
          resolvedProjectId = parts[2]; // Usually the second column is Project ID
          console.log(`✅ Resolved Project ID: "${resolvedProjectId}" from Project Number: ${PROJECT_ID}`);
          break;
        }
      }
    }
  } catch (err) {
    console.warn(`⚠️ Could not list projects to resolve Project ID. Using project number ${PROJECT_ID} directly.`, err.message);
  }

  // 3. Set active project
  console.log(`📂 Setting active Firebase project to ${resolvedProjectId}...`);
  try {
    runCmd(`npx -y firebase-tools@latest use ${resolvedProjectId}`);
  } catch (err) {
    console.warn(`⚠️ Could not switch active project using 'use'. We will specify --project in subsequent commands.`);
  }

  // 4. List apps to find existing web app
  console.log('🔎 Checking for existing web apps...');
  let appId = null;
  try {
    const rawAppsOutput = runCmd(`npx -y firebase-tools@latest apps:list --project ${resolvedProjectId}`);
    // Strip ANSI escape codes
    const appsOutput = rawAppsOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    const lines = appsOutput.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('web') && line.includes(APP_NICKNAME)) {
        // Line format usually: │ nickname │ appId │ type │ ...
        const parts = line.split('│').map(p => p.trim());
        if (parts.length > 2) {
          appId = parts[2]; // Usually the second column
          console.log(`✅ Found existing Web App "${APP_NICKNAME}" with ID: "${appId}"`);
          break;
        }
      }
    }
  } catch (err) {
    console.error('Error listing apps:', err.message);
  }

  // 4. Create Web App if it doesn't exist
  if (!appId) {
    console.log(`➕ Registering new Web App "${APP_NICKNAME}" in Firebase project...`);
    try {
      const createOutput = runCmd(`npx -y firebase-tools@latest apps:create web ${APP_NICKNAME} --project ${resolvedProjectId}`);
      // Find App ID in output
      const match = createOutput.match(/App ID:\s*([^\s│]+)/i) || createOutput.match(/ID:\s*([^\s│]+)/i);
      if (match) {
        appId = match[1];
        console.log(`✅ Web App registered successfully! App ID: ${appId}`);
      } else {
        // Fallback: list apps again to find the new one
        console.log('Listing apps again to fetch ID...');
        const rawAppsOutput = runCmd(`npx -y firebase-tools@latest apps:list --project ${resolvedProjectId}`);
        const appsOutput = rawAppsOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        const lines = appsOutput.split('\n');
        for (const line of lines) {
          if (line.toLowerCase().includes('web') && line.includes(APP_NICKNAME)) {
            const parts = line.split('│').map(p => p.trim());
            if (parts.length > 2) appId = parts[2];
          }
        }
      }
    } catch (err) {
      console.error('❌ Failed to register Web App:', err.message);
      process.exit(1);
    }
  }

  if (!appId) {
    console.error('❌ Could not retrieve App ID. Please make sure the app was registered.');
    process.exit(1);
  }

  // 5. Fetch SDK Config
  console.log(`📥 Fetching SDK configuration for app ${appId}...`);
  try {
    const configOutput = runCmd(`npx -y firebase-tools@latest apps:sdkconfig web ${appId} --project ${resolvedProjectId}`);
    
    // Parse values from code output as JSON
    let config;
    try {
      config = JSON.parse(configOutput);
    } catch (e) {
      const jsonStart = configOutput.indexOf('{');
      const jsonEnd = configOutput.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        config = JSON.parse(configOutput.slice(jsonStart, jsonEnd));
      } else {
        throw new Error('Could not parse JSON configuration from CLI output.');
      }
    }

    const {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId: appIdVal,
      measurementId = '',
    } = config;

    if (!apiKey || !projectId) {
      console.error('❌ Failed to parse configuration fields.');
      console.log('Parsed config was:\n', config);
      process.exit(1);
    }

    // 6. Write to .env
    const envContent = `EXPO_PUBLIC_FIREBASE_API_KEY=${apiKey}
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
EXPO_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
EXPO_PUBLIC_FIREBASE_APP_ID=${appIdVal}
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=${measurementId}
`;

    fs.writeFileSync(ENV_PATH, envContent, 'utf8');
    console.log('🎉 Successfully created and configured `.env` file with Firebase credentials!');
    console.log('\nConfigured settings:');
    console.log(`- Project ID: ${projectId}`);
    console.log(`- App ID: ${appIdVal}`);
  } catch (err) {
    console.error('❌ Failed to fetch config or write to .env:', err.message);
    process.exit(1);
  }
}

main();
