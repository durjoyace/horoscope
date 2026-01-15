/**
 * Gamification Types
 */

// XP reward values
export const XP_REWARDS = {
  daily_login: 10,
  mood_entry: 15,
  habit_complete: 20,
  all_habits_complete: 50,
  daily_streak_bonus: 5,
  add_friend: 25,
  send_first_message: 15,
  read_horoscope: 5,
  view_birth_chart: 10,
  unlock_achievement: 50,
  weekly_engagement: 100,
  monthly_engagement: 500,
} as const;

// Level tiers
export const LEVEL_TIERS = [
  { min: 1, max: 5, name: 'Seeker', color: '#9CA3AF', gradient: 'from-gray-400 to-gray-500' },
  { min: 6, max: 10, name: 'Explorer', color: '#60A5FA', gradient: 'from-blue-400 to-blue-500' },
  { min: 11, max: 15, name: 'Mystic', color: '#A78BFA', gradient: 'from-purple-400 to-purple-500' },
  { min: 16, max: 20, name: 'Sage', color: '#F59E0B', gradient: 'from-amber-400 to-amber-500' },
] as const;

export interface LevelTier {
  min: number;
  max: number;
  name: string;
  color: string;
  gradient: string;
}

export interface UserProgress {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  tier: LevelTier;
  dailyStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: number;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  isSecret: boolean;
  requirement: number;
}

export interface UserAchievementData {
  achievement: Achievement;
  unlockedAt: string | null;
  progress: number;
  isUnlocked: boolean;
}

export interface XpTransaction {
  id: number;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  zodiacSign: string | null;
  level: number;
  totalXp: number;
  dailyStreak: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  userRank: number | null;
  totalUsers: number;
}

export interface GamificationProfile {
  progress: UserProgress;
  todayXp: number;
  recentAchievements: UserAchievementData[];
}

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = [
  { key: 'streak', name: 'Streaks', icon: 'flame' },
  { key: 'habits', name: 'Habits', icon: 'check' },
  { key: 'mood', name: 'Mood', icon: 'heart' },
  { key: 'social', name: 'Social', icon: 'users' },
  { key: 'level', name: 'Level', icon: 'star' },
  { key: 'secret', name: 'Secret', icon: 'lock' },
] as const;

// Achievement icons mapping
export const ACHIEVEMENT_ICONS: Record<string, string> = {
  flame: '🔥',
  crown: '👑',
  check: '✓',
  'check-circle': '✅',
  trophy: '🏆',
  heart: '❤️',
  users: '👥',
  star: '⭐',
  award: '🏅',
  moon: '🌙',
  sun: '☀️',
  lock: '🔒',
};

// Leaderboard types
export type LeaderboardType = 'global' | 'zodiac' | 'friends' | 'weekly' | 'streaks';

export const LEADERBOARD_TABS: { type: LeaderboardType; label: string }[] = [
  { type: 'global', label: 'Global' },
  { type: 'weekly', label: 'This Week' },
  { type: 'zodiac', label: 'My Sign' },
  { type: 'friends', label: 'Friends' },
  { type: 'streaks', label: 'Streaks' },
];
