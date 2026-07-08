/**
 * HealthQuest — Zod Validation Schemas
 *
 * Defines Zod schemas matching our Firestore database interfaces.
 * Used for data entry validation, form bindings, and API testing.
 */
import { z } from 'zod';

// Helper for Firestore Timestamps (can be any object/Timestamp or Date)
const FirestoreTimestampSchema = z.any();

export const UserRoleSchema = z.enum(['student', 'teacher', 'parent', 'admin']);

export const UserSettingsSchema = z.object({
  notificationsEnabled: z.boolean().default(true),
  voiceEnabled: z.boolean().default(true),
  soundEnabled: z.boolean().default(true),
  hapticEnabled: z.boolean().default(true),
});

export const UserDocumentSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  role: UserRoleSchema.default('student'),
  createdAt: FirestoreTimestampSchema,
  isOnboarded: z.boolean().default(false),
  settings: UserSettingsSchema,
});

export const AvatarConfigSchema = z.object({
  skinColor: z.string().min(1, 'Skin color is required'),
  hairStyle: z.string().min(1, 'Hair style is required'),
  hairColor: z.string().min(1, 'Hair color is required'),
  expression: z.string().min(1, 'Expression is required'),
  clothing: z.string().min(1, 'Clothing is required'),
  accessory: z.string().default('none'),
});

export const ProfileDocumentSchema = z.object({
  id: z.string().optional(),
  nickname: z
    .string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(15, 'Nickname must be 15 characters or less')
    .regex(/^[a-zA-Z0-9_\s]+$/, 'Nickname can only contain letters, numbers, and spaces'),
  avatar: AvatarConfigSchema,
  grade: z.string().min(1, 'Grade selection is required'),
  interests: z.array(z.string()).default([]),
  dailyGoalXP: z.number().nonnegative().default(20),
  totalXP: z.number().nonnegative().default(0),
  level: z.number().int().positive().default(1),
  coins: z.number().int().nonnegative().default(0),
  energy: z.number().int().min(0).max(100).default(100),
  streakCount: z.number().int().nonnegative().default(0),
  lastStreakActiveDate: z.string().nullable().default(null),
  updatedAt: FirestoreTimestampSchema,
});

export const LessonSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['video', 'text', 'interactive']),
  title: z.string().min(1, 'Section title is required'),
  content: z.string().optional(),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  duration: z.number().int().nonnegative().optional(),
});

export const LessonCategorySchema = z.enum(['nutrition', 'fitness', 'hygiene', 'sleep']);

export const LessonDocumentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Lesson title is required'),
  description: z.string().min(1, 'Lesson description is required'),
  category: LessonCategorySchema,
  grade: z.string().min(1, 'Grade is required'),
  xpReward: z.number().int().nonnegative().default(10),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  duration: z.number().int().nonnegative().default(0),
  sections: z.array(LessonSectionSchema).min(1, 'Lessons must contain at least one section'),
  createdAt: FirestoreTimestampSchema,
});

export const LessonProgressDocumentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  lessonId: z.string(),
  completed: z.boolean().default(false),
  durationWatched: z.number().int().nonnegative().default(0),
  lastAccessedAt: FirestoreTimestampSchema,
  completedAt: FirestoreTimestampSchema.optional(),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq', 'tf', 'scenario']),
  question: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().min(1, 'Explanation is required'),
});

export const QuizDocumentSchema = z.object({
  id: z.string().optional(),
  lessonId: z.string(),
  title: z.string().min(1, 'Quiz title is required'),
  energyCost: z.number().int().nonnegative().default(10),
  rewardsXP: z.number().int().nonnegative().default(15),
  rewardsCoins: z.number().int().nonnegative().default(5),
  questions: z.array(QuizQuestionSchema).min(1, 'Quizzes must contain at least one question'),
  createdAt: FirestoreTimestampSchema,
});

export const QuizAttemptDocumentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  xpEarned: z.number().int().nonnegative(),
  coinsEarned: z.number().int().nonnegative(),
  timestamp: FirestoreTimestampSchema,
});

export const DailyChallengeTypeSchema = z.enum(['hydration', 'steps', 'lessons', 'exercise']);

export const DailyChallengeDocumentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Challenge title is required'),
  description: z.string().min(1, 'Challenge description is required'),
  type: DailyChallengeTypeSchema,
  targetValue: z.number().positive(),
  rewardXP: z.number().int().nonnegative(),
  rewardCoins: z.number().int().nonnegative(),
  activeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
});

export const ChallengeProgressDocumentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  challengeId: z.string(),
  currentValue: z.number().nonnegative().default(0),
  completed: z.boolean().default(false),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  updatedAt: FirestoreTimestampSchema,
});

export const BadgeDocumentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Badge title is required'),
  description: z.string().min(1, 'Badge description is required'),
  iconUrl: z.string().min(1, 'Badge icon is required'),
  criteriaType: z.enum(['xp', 'streak', 'quizzes', 'lessons', 'hydration']),
  criteriaValue: z.number().positive(),
});

export const UserBadgeDocumentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  badgeId: z.string(),
  unlockedAt: FirestoreTimestampSchema,
});

export const SchoolDocumentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'School name is required'),
  address: z.string().optional(),
});

export const ClassDocumentSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().nullable(),
  teacherId: z.string(),
  name: z.string().min(1, 'Class name is required'),
  grade: z.string().min(1, 'Grade is required'),
  accessCode: z.string().min(4, 'Access code must be at least 4 characters'),
  studentIds: z.array(z.string()).default([]),
  createdAt: FirestoreTimestampSchema,
});

export const TeacherDocumentSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  schoolId: z.string().nullable(),
  classIds: z.array(z.string()).default([]),
});

export const ParentDocumentSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  childrenIds: z.array(z.string()).default([]),
});

export const NotificationTypeSchema = z.enum(['streak', 'assignment', 'portal']);

export const NotificationDocumentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, 'Notification title is required'),
  message: z.string().min(1, 'Notification message is required'),
  type: NotificationTypeSchema,
  read: z.boolean().default(false),
  createdAt: FirestoreTimestampSchema,
});
