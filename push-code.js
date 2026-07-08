/**
 * HealthQuest — Automated Git Commit & Push Utility
 *
 * This script initializes git (if needed), adds all workspace changes
 * (respecting .gitignore), commits them, sets the remote url to
 * https://github.com/Vignesh-Murugeshkumar/hq.git, and pushes the main branch.
 *
 * Run it in your external terminal:
 * node push-code.js
 */
const { execSync } = require('child_process');

const REMOTE_URL = 'https://github.com/Vignesh-Murugeshkumar/hq.git';

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
  } catch (err) {
    console.error(`⚠️ Command failed: ${cmd}`);
    return null;
  }
}

function main() {
  console.log('🚀 Initializing Git repository & commit workflow...');

  // 1. Initialize git if not already done
  try {
    execSync('git status', { stdio: 'ignore' });
    console.log('✅ Git repository already initialized.');
  } catch (e) {
    console.log('➕ Initializing git...');
    runCmd('git init');
  }

  // 2. Set default branch to main
  runCmd('git branch -M main');

  // 3. Stage changes
  console.log('📦 Staging changes...');
  runCmd('git add .');

  // 4. Commit changes
  console.log('✍️ Creating commit...');
  runCmd('git commit -m "Initialize project and implement Phase 1-3: Navigation, Cartoon Theme, Firebase Setup, and Authentication Flow"');

  // 5. Setup Remote
  console.log('🔗 Configuring Git remote...');
  try {
    // Check if remote origin already exists
    const remotes = execSync('git remote', { encoding: 'utf8' }).trim();
    if (remotes.includes('origin')) {
      console.log('🔄 Updating existing remote origin url...');
      runCmd(`git remote set-url origin ${REMOTE_URL}`);
    } else {
      console.log('➕ Adding remote origin...');
      runCmd(`git remote add origin ${REMOTE_URL}`);
    }
  } catch (e) {
    runCmd(`git remote add origin ${REMOTE_URL}`);
  }

  // 6. Push to Remote
  console.log(`📤 Pushing changes to ${REMOTE_URL} on branch main...`);
  console.log('ℹ️ Note: If this is your first push or if authentication is required, git will open a login popup.');
  const pushSuccess = runCmd('git push -u origin main');
  
  if (pushSuccess !== null) {
    console.log('🎉 Successfully committed and pushed code to GitHub!');
  } else {
    console.log('⚠️ Git push completed with some errors. If it failed due to permissions, please authenticate in your terminal and run:');
    console.log('   git push -u origin main');
  }
}

main();
