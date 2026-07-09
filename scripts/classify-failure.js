const fs = require('fs');

const logFile = 'gradle-build.log';
if (!fs.existsSync(logFile)) {
  console.log('ℹ️ No build log file found to classify failure.');
  process.exit(0);
}

const content = fs.readFileSync(logFile, 'utf8');

console.log('\n=========================================');
console.log('❌ Analyzing Gradle Build Failure...');
console.log('=========================================');

let category = 'Unknown Gradle Failure';
let explanation = 'Could not classify build failure based on known error patterns. Inspect stack trace logs below.';
let fileAndLine = '';

// Find file and line if present in stacktrace
const lineMatch = content.match(/Build file\s+['\"]([^'\"]+)['\"]\s+line:\s+(\d+)/i);
if (lineMatch) {
  fileAndLine = `Failed at: ${lineMatch[1]} (line ${lineMatch[2]})`;
}

// 1. Firebase package mismatch (specific pattern)
// Check for "No matching client found for package name" or "File google-services.json is missing"
const noMatchingClientMatch = content.match(/No matching client found for package name\s+['\"]([^'\"]+)['\"]/i);
if (noMatchingClientMatch) {
  const resolvedPkg = noMatchingClientMatch[1];
  category = 'Firebase Package Mismatch';
  explanation = `Firebase package mismatch: no client entry for "${resolvedPkg}" found in google-services.json.\n\n` +
                `👉 Action: You must register a new Android app in your Firebase Console with package name "${resolvedPkg}", ` +
                `download the updated google-services.json, and set it as your GOOGLE_SERVICES_JSON secret.`;
}
else if (content.includes('File google-services.json is missing') || content.includes('google-services.json')) {
  category = 'Firebase / Google Services Configuration Failure';
  explanation = 'The Google Services plugin failed to compile. The file google-services.json is missing or not located at the correct path android/app/google-services.json.';
}
// 2. Kotlin Version/KSP errors
else if (content.includes('kotlinVersion') || content.includes('org.jetbrains.kotlin') || content.includes('Can\'t find KSP version')) {
  category = 'Kotlin / KSP Version Configuration Failure';
  explanation = 'Kotlin version specified in build properties is incompatible with the Gradle/KSP plugins, or variable is undefined in the buildscript.';
}
// 3. Android Gradle Plugin errors
else if (content.includes('com.android.application') || content.includes('com.android.tools.build:gradle') || content.includes('AGP')) {
  category = 'Android Gradle Plugin Configuration Failure';
  explanation = 'Android Gradle Plugin (AGP) version is incompatible with the active Gradle daemon, or plugin could not be resolved from repository repositories.';
}
// 4. Missing Property lookup errors
else if (content.includes('Could not get unknown property') || content.includes('MissingPropertyException')) {
  category = 'Gradle Property Lookup Failure';
  explanation = 'The gradle script referenced a property (variable) that was not defined in the buildscript.ext context or gradle.properties.';
}

console.log(`Category:    ${category}`);
console.log(`Explanation: ${explanation}`);
if (fileAndLine) {
  console.log(fileAndLine);
}
console.log('=========================================\n');
process.exit(1); // Keep build exit status failing
