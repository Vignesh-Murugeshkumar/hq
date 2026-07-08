/**
 * HealthQuest — Schemas Verification Script
 *
 * Validates Zod schemas against typical correct and incorrect data structures.
 * Run using: node scratch/test-schemas.js
 */
const { 
  UserRoleSchema,
  UserDocumentSchema,
  ProfileDocumentSchema,
  LessonDocumentSchema,
  QuizDocumentSchema,
  DailyChallengeDocumentSchema
} = require('../src/shared/types/validation');

console.log('🧪 Starting Firestore Zod Schema validation test...');

let passedTestsCount = 0;
let failedTestsCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTestsCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failedTestsCount++;
  }
}

// Test 1: UserRole validation
function testUserRoles() {
  console.log('\n--- Testing User Roles ---');
  
  // Valid roles
  assert(UserRoleSchema.safeParse('student').success, 'student is a valid role');
  assert(UserRoleSchema.safeParse('teacher').success, 'teacher is a valid role');
  assert(UserRoleSchema.safeParse('parent').success, 'parent is a valid role');
  assert(UserRoleSchema.safeParse('admin').success, 'admin is a valid role');
  
  // Invalid roles
  assert(!UserRoleSchema.safeParse('guest').success, 'guest is an invalid role');
  assert(!UserRoleSchema.safeParse(null).success, 'null is an invalid role');
  assert(!UserRoleSchema.safeParse('').success, 'empty string is an invalid role');
}

// Test 2: UserDocument validation
function testUserDocument() {
  console.log('\n--- Testing User Document ---');
  
  const validUser = {
    email: 'test@healthquest.com',
    role: 'student',
    createdAt: new Date(),
    isOnboarded: false,
    settings: {
      notificationsEnabled: true,
      voiceEnabled: true,
      soundEnabled: true,
      hapticEnabled: true
    }
  };
  
  assert(UserDocumentSchema.safeParse(validUser).success, 'valid UserDocument parses successfully');
  
  const invalidUserEmail = {
    ...validUser,
    email: 'not-an-email'
  };
  assert(!UserDocumentSchema.safeParse(invalidUserEmail).success, 'invalid email format fails validation');
  
  const invalidUserRole = {
    ...validUser,
    role: 'superadmin'
  };
  assert(!UserDocumentSchema.safeParse(invalidUserRole).success, 'invalid role fails validation');
}

// Test 3: ProfileDocument validation
function testProfileDocument() {
  console.log('\n--- Testing Profile Document ---');
  
  const validProfile = {
    nickname: 'HealthyHero',
    avatar: {
      skinColor: 'peach',
      hairStyle: 'spiky',
      hairColor: 'brown',
      expression: 'smile',
      clothing: 'hoodie',
      accessory: 'none'
    },
    grade: 'Grade 3',
    interests: ['nutrition', 'fitness'],
    dailyGoalXP: 20,
    totalXP: 100,
    level: 2,
    coins: 50,
    energy: 100,
    streakCount: 3,
    lastStreakActiveDate: '2026-07-08',
    updatedAt: new Date()
  };
  
  assert(ProfileDocumentSchema.safeParse(validProfile).success, 'valid ProfileDocument parses successfully');
  
  // Nickname validations
  const invalidProfileNameShort = { ...validProfile, nickname: 'Hi' };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileNameShort).success, 'nickname under 3 chars fails validation');
  
  const invalidProfileNameLong = { ...validProfile, nickname: 'SuperHeroKidMaximusTheThird' };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileNameLong).success, 'nickname over 15 chars fails validation');
  
  const invalidProfileNameSpecial = { ...validProfile, nickname: 'Hero@123' };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileNameSpecial).success, 'nickname with special characters fails validation');
  
  // Negative bounds validation
  const invalidProfileXP = { ...validProfile, totalXP: -5 };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileXP).success, 'negative totalXP fails validation');
  
  const invalidProfileLevel = { ...validProfile, level: 0 };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileLevel).success, 'level <= 0 fails validation');
  
  // Energy bounds validation
  const invalidProfileEnergyOver = { ...validProfile, energy: 101 };
  assert(!ProfileDocumentSchema.safeParse(invalidProfileEnergyOver).success, 'energy > 100 fails validation');
}

// Test 4: LessonDocument validation
function testLessonDocument() {
  console.log('\n--- Testing Lesson Document ---');
  
  const validLesson = {
    title: 'Hydration Station',
    description: 'Learn why water is the body\'s best friend.',
    category: 'nutrition',
    grade: 'Grade 1',
    xpReward: 10,
    videoUrl: 'https://youtube.com/watch?v=123',
    thumbnailUrl: 'https://youtube.com/thumb/123.jpg',
    duration: 180,
    sections: [
      {
        id: 'sec_1',
        type: 'video',
        title: 'Watch the Water Cycle',
        videoUrl: 'https://youtube.com/watch?v=123',
        duration: 180
      }
    ],
    createdAt: new Date()
  };
  
  assert(LessonDocumentSchema.safeParse(validLesson).success, 'valid LessonDocument parses successfully');
  
  const invalidLessonCategory = { ...validLesson, category: 'gaming' };
  assert(!LessonDocumentSchema.safeParse(invalidLessonCategory).success, 'invalid category fails validation');
  
  const invalidLessonNoSections = { ...validLesson, sections: [] };
  assert(!LessonDocumentSchema.safeParse(invalidLessonNoSections).success, 'lesson with empty sections fails validation');
}

// Run test suites
testUserRoles();
testUserDocument();
testProfileDocument();
testLessonDocument();

console.log(`\n📊 Schema Verification Summary:`);
console.log(`   - Passed: ${passedTestsCount}`);
console.log(`   - Failed: ${failedTestsCount}`);

if (failedTestsCount === 0) {
  console.log('\n🌟 Schema validation tests passed successfully!');
} else {
  console.error('\n⚠️ Some schema validation tests failed.');
  process.exit(1);
}
