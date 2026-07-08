/**
 * HealthQuest — Application Constants
 *
 * Central source of truth for all game mechanics, thresholds, and limits.
 */

// ============================================================
// GAMIFICATION
// ============================================================

/** XP required for each level: xpForLevel(n) = 50 * n * (n + 1) */
export const calculateXpForLevel = (level: number): number => 50 * level * (level + 1);

/** Pre-calculated XP thresholds for levels 1–20 */
export const XP_THRESHOLDS = Array.from({ length: 20 }, (_, i) => ({
  level: i + 1,
  xpRequired: calculateXpForLevel(i + 1),
}));

/** Level titles — earned as the player progresses */
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Health Rookie',
  2: 'Body Explorer',
  3: 'Wellness Scout',
  4: 'Health Warrior',
  5: 'Vitality Knight',
  6: 'Nutrition Ninja',
  7: 'Fitness Sage',
  8: 'Wellness Wizard',
  9: 'Health Champion',
  10: 'Legendary Healer',
  11: 'Grand Vitalist',
  12: 'Supreme Sage',
  13: 'Mythic Guardian',
  14: 'Cosmic Healer',
  15: 'Eternal Champion',
  16: 'Divine Protector',
  17: 'Stellar Master',
  18: 'Galaxy Guardian',
  19: 'Universal Sage',
  20: 'HealthQuest Legend',
};

/** XP rewards per activity */
export const XP_REWARDS = {
  COMPLETE_LESSON_MIN: 50,
  COMPLETE_LESSON_MAX: 100,
  PASS_QUIZ_MIN: 30,
  PASS_QUIZ_MAX: 80,
  PERFECT_QUIZ_BONUS: 50,
  DAILY_CHALLENGE: 20,
  ALL_DAILY_CHALLENGES_BONUS: 100,
  DAILY_LOGIN: 10,
  STREAK_7_DAY_BONUS: 50,
  STREAK_30_DAY_BONUS: 200,
  WATCH_VIDEO: 15,
} as const;

/** Coin rewards per activity */
export const COIN_REWARDS = {
  COMPLETE_LESSON: 10,
  PASS_QUIZ: 5,
  PERFECT_QUIZ_BONUS: 15,
  DAILY_CHALLENGE: 5,
  ALL_DAILY_CHALLENGES_BONUS: 25,
  DAILY_LOGIN: 2,
  WATCH_VIDEO: 3,
} as const;

// ============================================================
// ENERGY SYSTEM
// ============================================================

export const ENERGY = {
  MAX_LIVES: 5,
  REGEN_INTERVAL_MS: 30 * 60 * 1000, // 30 minutes
  COST_PER_WRONG_ANSWER: 1,
} as const;

// ============================================================
// QUIZ
// ============================================================

export const QUIZ = {
  PASSING_SCORE_PERCENT: 70,
  TIME_LIMIT_EASY: 30, // seconds per question
  TIME_LIMIT_MEDIUM: 20,
  TIME_LIMIT_HARD: 15,
} as const;

// ============================================================
// LEARNING CATEGORIES
// ============================================================

export const LEARNING_CATEGORIES = [
  { id: 'nutrition', name: 'Nutrition', icon: 'apple', color: '#4CAF50', emoji: '🥗' },
  { id: 'exercise', name: 'Exercise', icon: 'dumbbell', color: '#FF6B6B', emoji: '🏃' },
  { id: 'hydration', name: 'Hydration', icon: 'droplets', color: '#26C6DA', emoji: '💧' },
  { id: 'sleep', name: 'Sleep', icon: 'moon', color: '#7C4DFF', emoji: '😴' },
  { id: 'mental-health', name: 'Mental Health', icon: 'brain', color: '#F06292', emoji: '🧠' },
  { id: 'hygiene', name: 'Hygiene', icon: 'sparkles', color: '#FF9800', emoji: '🧼' },
] as const;

// ============================================================
// DAILY CHALLENGES
// ============================================================

export const CHALLENGE_TYPES = [
  { id: 'drink_water', title: 'Drink Water', icon: 'glass-water', target: 8 },
  { id: 'walk', title: 'Take a Walk', icon: 'footprints', target: 1 },
  { id: 'exercise', title: 'Exercise', icon: 'dumbbell', target: 1 },
  { id: 'sleep_early', title: 'Sleep Early', icon: 'moon', target: 1 },
  { id: 'eat_fruits', title: 'Eat Fruits', icon: 'apple', target: 3 },
  { id: 'meditate', title: 'Meditate', icon: 'flower-2', target: 1 },
  { id: 'stretch', title: 'Stretch', icon: 'move', target: 1 },
  { id: 'brush_teeth', title: 'Brush Teeth', icon: 'sparkles', target: 2 },
] as const;

// ============================================================
// GRADES & ONBOARDING
// ============================================================

export const SUPPORTED_GRADES = [3, 4, 5, 6] as const;

export const DAILY_GOAL_OPTIONS = [
  { minutes: 5, label: '5 min', description: 'Quick Learner' },
  { minutes: 10, label: '10 min', description: 'Steady Explorer' },
  { minutes: 15, label: '15 min', description: 'Health Champion' },
  { minutes: 20, label: '20 min', description: 'Super Scholar' },
] as const;

// ============================================================
// BADGE RARITIES
// ============================================================

export const BADGE_RARITIES = {
  common: { name: 'Common', color: '#81C784', textColor: '#2D3436' },
  rare: { name: 'Rare', color: '#42A5F5', textColor: '#FFFFFF' },
  epic: { name: 'Epic', color: '#7C4DFF', textColor: '#FFFFFF' },
  legendary: { name: 'Legendary', color: '#FFD93D', textColor: '#2D3436' },
} as const;

// ============================================================
// VIDEO UPLOAD
// ============================================================

export const VIDEO_UPLOAD = {
  MAX_SIZE_BYTES: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],
  ALLOWED_EXTENSIONS: ['.mp4', '.mov', '.webm'],
  STORAGE_PATH: 'videos',
} as const;

// ============================================================
// LEADERBOARD
// ============================================================

export const LEADERBOARD = {
  MAX_ENTRIES: 100,
  PERIODS: ['daily', 'weekly', 'monthly', 'allTime'] as const,
} as const;

// ============================================================
// APP
// ============================================================

export const APP = {
  NAME: 'HealthQuest',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@healthquest.app',
  MIN_AGE: 7,
  MAX_AGE: 12,
} as const;
