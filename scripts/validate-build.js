const fs = require('fs');

function logSection(title) {
  console.log(`\n=========================================`);
  console.log(`🔍 ${title}`);
  console.log(`=========================================`);
}

// 1. Read app.json config package name
let appJsonPackage;
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  appJsonPackage = appJson.expo && appJson.expo.android && appJson.expo.android.package;
} catch (err) {
  console.error('::error::Failed to read or parse app.json: ' + err.message);
  process.exit(1);
}

if (!appJsonPackage) {
  console.error('::error::expo.android.package is not defined in app.json');
  process.exit(1);
}

// 2. Read google-services.json and extract all client package names
const gsPath = 'android/app/google-services.json';
if (!fs.existsSync(gsPath)) {
  console.error(`::error::Firebase config file not found at: ${gsPath}`);
  process.exit(1);
}

const stats = fs.statSync(gsPath);
if (stats.size === 0) {
  console.error(`::error::Firebase config file is empty: ${gsPath}`);
  process.exit(1);
}

let googleServices;
try {
  googleServices = JSON.parse(fs.readFileSync(gsPath, 'utf8'));
} catch (err) {
  console.error('::error::Failed to parse android/app/google-services.json: ' + err.message);
  process.exit(1);
}

if (!googleServices.client || !Array.isArray(googleServices.client)) {
  console.error('::error::google-services.json is missing the client array');
  process.exit(1);
}

const firebasePackages = [];
for (const client of googleServices.client) {
  if (client.client_info && client.client_info.android_client_info && client.client_info.android_client_info.package_name) {
    firebasePackages.push(client.client_info.android_client_info.package_name);
  }
}

if (firebasePackages.length === 0) {
  console.error('::error::No Android app packages found in google-services.json');
  process.exit(1);
}

// 3. Read generated Android package name and applicationIdSuffix from build.gradle / build.gradle.kts
let gradlePackage = null;
let gradleNamespace = null;
let appIdSuffix = '';

const gradlePath = fs.existsSync('android/app/build.gradle') ? 'android/app/build.gradle' : (fs.existsSync('android/app/build.gradle.kts') ? 'android/app/build.gradle.kts' : null);
if (!gradlePath) {
  console.error('::error::android/app/build.gradle (.kts) not found');
  process.exit(1);
}

try {
  const gradleContent = fs.readFileSync(gradlePath, 'utf8');
  
  // Extract applicationId (supporting '=' and optional spaces)
  const appIdMatch = gradleContent.match(/applicationId\s*=?\s*['\"]([^'\"]+)['\"]/);
  gradlePackage = appIdMatch ? appIdMatch[1] : null;
  
  // Extract namespace (supporting '=' and optional spaces)
  const namespaceMatch = gradleContent.match(/namespace\s*=?\s*['\"]([^'\"]+)['\"]/);
  gradleNamespace = namespaceMatch ? namespaceMatch[1] : null;
  
  // Extract applicationIdSuffix from buildTypes { debug { ... } } specifically
  // Handle both Groovy and Kotlin DSL block formats
  const debugBlockMatch = gradleContent.match(/(debug\s*\{|getByName\s*\(\s*['\"]debug['\"]\s*\)\s*\{)([\s\S]*?)\}/);
  if (debugBlockMatch) {
    const debugBlockContent = debugBlockMatch[2];
    const suffixMatch = debugBlockContent.match(/applicationIdSuffix\s*=?\s*['\"]([^'\"]+)['\"]/);
    if (suffixMatch) {
      appIdSuffix = suffixMatch[1];
    }
  } else {
    // Fallback search in the whole file
    const suffixMatch = gradleContent.match(/applicationIdSuffix\s*=?\s*['\"]([^'\"]+)['\"]/);
    if (suffixMatch) {
      appIdSuffix = suffixMatch[1];
    }
  }
} catch (err) {
  console.error(`::error::Failed to read ${gradlePath}: ` + err.message);
  process.exit(1);
}

const basePackage = gradlePackage || gradleNamespace;
if (!basePackage) {
  console.error(`::error::Could not extract applicationId or namespace from ${gradlePath}`);
  process.exit(1);
}

// Calculate final resolved debug package
const resolvedDebugPackage = basePackage + appIdSuffix;

logSection('Configuration Details');
console.log('Expo Package (app.json):   ' + appJsonPackage);
console.log('Gradle Package:            ' + basePackage);
console.log('Namespace:                 ' + (gradleNamespace || 'None'));
console.log('applicationId:             ' + (gradlePackage || 'None'));
console.log('applicationIdSuffix:       ' + (appIdSuffix || 'None'));
console.log('Resolved Debug Package:    ' + resolvedDebugPackage);
console.log('\nFirebase Packages (google-services.json):');
firebasePackages.forEach(p => console.log(' - ' + p));

logSection('Consistency Assertions');

// 1. Assert Expo package matches Gradle base package (without suffix)
if (appJsonPackage !== basePackage) {
  console.error(`::error::Base Package Mismatch: Expo app.json package "${appJsonPackage}" does not match Android Gradle package "${basePackage}".`);
  process.exit(1);
}
console.log('✓ Base packages match successfully.');

// 2. Assert resolved debug package is present in Firebase client app configuration list
const matchFound = firebasePackages.includes(resolvedDebugPackage);
if (!matchFound) {
  console.error(`::error::Variant Package Mismatch: Resolved debug package name "${resolvedDebugPackage}" is not registered in Firebase.`);
  console.error(`Expected (Calculated resolved package name for Gradle debug build):`);
  console.error(`  ${resolvedDebugPackage}`);
  console.error(`Actual packages found in google-services.json:`);
  firebasePackages.forEach(p => console.error(`  - ${p}`));
  
  if (appIdSuffix) {
    console.error(`\n💡 Hint: Your build config specifies an applicationIdSuffix ("${appIdSuffix}"). You must either:`);
    console.error(`  1. Open Firebase Console, add an Android app with the package name "${resolvedDebugPackage}", download the new google-services.json, and update your GOOGLE_SERVICES_JSON secret.`);
    console.error(`  2. Remove the applicationIdSuffix from your android/app/build.gradle (.kts) or app config.`);
  } else {
    console.error(`\n💡 Hint: Please register "${resolvedDebugPackage}" in your Firebase Console and update your GOOGLE_SERVICES_JSON secret.`);
  }
  process.exit(1);
}

console.log('✓ Resolved Debug package exists in Firebase google-services.json configuration list.');
console.log('\n🎉 Validation successfully passed!');
