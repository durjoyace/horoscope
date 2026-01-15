/**
 * Tracking Feature Types
 */

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: number;
  userId: number;
  date: string;
  moodScore: number;
  energyLevel: number | null;
  emotions: string[];
  activities: string[];
  notes: string | null;
  lunarPhase: string | null;
  lunarIllumination: number | null;
  sleepHours: number | null;
  sleepQuality: number | null;
  createdAt: string;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  targetDays: number[];
  reminderTime: string | null;
  icon: string | null;
  color: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  isActive: boolean;
  createdAt: string;
}

export interface HabitWithStatus extends Habit {
  completedToday: boolean;
  todayLog: HabitLog | null;
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  notes: string | null;
  createdAt: string;
}

export interface MoodAnalytics {
  averageMood: number;
  averageEnergy: number;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  moodByLunarPhase: Record<string, { avgMood: number; count: number }>;
  moodTrend: { date: string; mood: number; lunar: string }[];
  topEmotions: { emotion: string; count: number }[];
  topActivities: { activity: string; avgMood: number; count: number }[];
}

export interface LunarData {
  phase: string;
  phaseName: string;
  illumination: number;
  emoji: string;
  daysUntilFull: number;
  daysUntilNew: number;
}

export interface DashboardData {
  mood: {
    hasEntry: boolean;
    entry: MoodEntry | null;
    weeklyAverage: number;
    streak: number;
  };
  habits: {
    total: number;
    completed: number;
    progress: number;
    items: HabitWithStatus[];
  };
  lunar: LunarData;
  date: string;
}

// Mood levels configuration
export const MOOD_LEVELS = [
  { value: 1, label: 'Very Bad', emoji: '😢', color: '#ef4444' },
  { value: 2, label: 'Bad', emoji: '😔', color: '#f97316' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#eab308' },
  { value: 4, label: 'Good', emoji: '😊', color: '#22c55e' },
  { value: 5, label: 'Great', emoji: '😄', color: '#10b981' },
] as const;

// Energy levels configuration
export const ENERGY_LEVELS = [
  { value: 1, label: 'Exhausted', emoji: '🪫', color: '#ef4444' },
  { value: 2, label: 'Tired', emoji: '😴', color: '#f97316' },
  { value: 3, label: 'Moderate', emoji: '⚡', color: '#eab308' },
  { value: 4, label: 'Energized', emoji: '💪', color: '#22c55e' },
  { value: 5, label: 'Highly Energized', emoji: '🔥', color: '#10b981' },
] as const;

// Habit categories
export const HABIT_CATEGORIES = [
  { value: 'health', label: 'Health', icon: '❤️', color: '#ef4444' },
  { value: 'fitness', label: 'Fitness', icon: '💪', color: '#f97316' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#8b5cf6' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', color: '#22c55e' },
  { value: 'sleep', label: 'Sleep', icon: '😴', color: '#3b82f6' },
  { value: 'social', label: 'Social', icon: '👥', color: '#ec4899' },
  { value: 'other', label: 'Other', icon: '✨', color: '#6b7280' },
] as const;

// Lunar phase emojis
export const LUNAR_EMOJIS: Record<string, string> = {
  new_moon: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full_moon: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

export function getMoodConfig(level: number) {
  return MOOD_LEVELS.find((m) => m.value === level) || MOOD_LEVELS[2];
}

export function getEnergyConfig(level: number) {
  return ENERGY_LEVELS.find((e) => e.value === level) || ENERGY_LEVELS[2];
}

export function getCategoryConfig(category: string) {
  return HABIT_CATEGORIES.find((c) => c.value === category) || HABIT_CATEGORIES[6];
}
