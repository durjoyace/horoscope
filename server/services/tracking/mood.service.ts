/**
 * Mood Tracking Service
 * Handles mood entries and analytics
 */

import { db } from '../../db';
import { moodEntries } from '../../../shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getLunarData } from '../astrology/lunar.service';
import { logger } from '../../logger';

// Mood types
export type MoodLevel = 1 | 2 | 3 | 4 | 5; // 1=Very Bad, 5=Very Good
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntryInput {
  userId: number;
  moodScore: number;
  energyLevel?: number;
  emotions?: string[];
  activities?: string[];
  notes?: string;
  sleepHours?: number;
}

// Tags structure for storing emotions and activities in JSON
interface TagsData {
  emotions?: string[];
  activities?: string[];
}

// Astro context structure for storing lunar data in JSON
interface AstroContextData {
  lunarPhase?: string;
  lunarIllumination?: number;
  moonSign?: string;
}

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
  createdAt: Date;
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

/**
 * Create a mood entry for today
 */
export async function createMoodEntry(input: MoodEntryInput): Promise<MoodEntry> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Prepare tags JSON (emotions and activities)
    const tagsData: TagsData = {
      emotions: input.emotions || [],
      activities: input.activities || [],
    };

    // Get lunar data for today
    const lunarData = getLunarData(new Date());
    const astroContextData: AstroContextData = {
      lunarPhase: lunarData.phase,
      lunarIllumination: lunarData.illumination,
    };

    // Check if entry already exists for today
    const existing = await db
      .select()
      .from(moodEntries)
      .where(and(
        eq(moodEntries.userId, input.userId),
        eq(moodEntries.date, today)
      ));

    if (existing.length > 0) {
      // Update existing entry
      const [updated] = await db
        .update(moodEntries)
        .set({
          moodScore: input.moodScore,
          energyLevel: input.energyLevel || null,
          tags: tagsData,
          notes: input.notes || null,
          sleepHours: input.sleepHours ? Math.round(input.sleepHours * 10) : null, // Store as tenths
          astroContext: astroContextData,
          updatedAt: new Date(),
        })
        .where(eq(moodEntries.id, existing[0].id))
        .returning();

      return mapToMoodEntry(updated);
    }

    // Create new entry
    const [entry] = await db
      .insert(moodEntries)
      .values({
        userId: input.userId,
        date: today,
        moodScore: input.moodScore,
        energyLevel: input.energyLevel || null,
        tags: tagsData,
        notes: input.notes || null,
        sleepHours: input.sleepHours ? Math.round(input.sleepHours * 10) : null, // Store as tenths
        astroContext: astroContextData,
      })
      .returning();

    logger.info({ userId: input.userId, date: today }, 'Created mood entry');
    return mapToMoodEntry(entry);
  } catch (error) {
    logger.error({ err: error }, 'Failed to create mood entry');
    throw error;
  }
}

/**
 * Get mood entries for a user within a date range
 */
export async function getMoodEntries(
  userId: number,
  _startDate?: string,
  _endDate?: string,
  limit: number = 30
): Promise<MoodEntry[]> {
  try {
    const entries = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date))
      .limit(limit);

    return entries.map(mapToMoodEntry);
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get mood entries');
    throw error;
  }
}

/**
 * Get today's mood entry for a user
 */
export async function getTodaysMoodEntry(userId: number): Promise<MoodEntry | null> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [entry] = await db
      .select()
      .from(moodEntries)
      .where(and(
        eq(moodEntries.userId, userId),
        eq(moodEntries.date, today)
      ));

    return entry ? mapToMoodEntry(entry) : null;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get today mood entry');
    throw error;
  }
}

/**
 * Get mood analytics for a user
 */
export async function getMoodAnalytics(userId: number, days: number = 30): Promise<MoodAnalytics> {
  try {
    const entries = await getMoodEntries(userId, undefined, undefined, days);

    if (entries.length === 0) {
      return {
        averageMood: 0,
        averageEnergy: 0,
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        moodByLunarPhase: {},
        moodTrend: [],
        topEmotions: [],
        topActivities: [],
      };
    }

    // Calculate averages
    const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;
    const energyEntries = entries.filter((e) => e.energyLevel !== null);
    const avgEnergy = energyEntries.length > 0
      ? energyEntries.reduce((sum, e) => sum + (e.energyLevel || 0), 0) / energyEntries.length
      : 0;

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(entries);

    // Mood by lunar phase
    const moodByPhase: Record<string, { totalMood: number; count: number }> = {};
    entries.forEach((e) => {
      if (e.lunarPhase) {
        if (!moodByPhase[e.lunarPhase]) {
          moodByPhase[e.lunarPhase] = { totalMood: 0, count: 0 };
        }
        moodByPhase[e.lunarPhase].totalMood += e.moodScore;
        moodByPhase[e.lunarPhase].count += 1;
      }
    });

    const moodByLunarPhase = Object.fromEntries(
      Object.entries(moodByPhase).map(([phase, data]) => [
        phase,
        { avgMood: data.totalMood / data.count, count: data.count },
      ])
    );

    // Mood trend (last 14 days)
    const moodTrend = entries.slice(0, 14).reverse().map((e) => ({
      date: e.date,
      mood: e.moodScore,
      lunar: e.lunarPhase || 'unknown',
    }));

    // Top emotions
    const emotionCounts: Record<string, number> = {};
    entries.forEach((e) => {
      (e.emotions || []).forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));

    // Top activities with average mood
    const activityData: Record<string, { totalMood: number; count: number }> = {};
    entries.forEach((e) => {
      (e.activities || []).forEach((activity) => {
        if (!activityData[activity]) {
          activityData[activity] = { totalMood: 0, count: 0 };
        }
        activityData[activity].totalMood += e.moodScore;
        activityData[activity].count += 1;
      });
    });
    const topActivities = Object.entries(activityData)
      .map(([activity, data]) => ({
        activity,
        avgMood: data.totalMood / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.avgMood - a.avgMood)
      .slice(0, 5);

    return {
      averageMood: Math.round(avgMood * 10) / 10,
      averageEnergy: Math.round(avgEnergy * 10) / 10,
      totalEntries: entries.length,
      currentStreak,
      longestStreak,
      moodByLunarPhase,
      moodTrend,
      topEmotions,
      topActivities,
    };
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get mood analytics');
    throw error;
  }
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(entries: MoodEntry[]): { currentStreak: number; longestStreak: number } {
  if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Sort by date descending
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  let expectedDate = today;

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    const daysDiff = Math.floor((expectedDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0 || daysDiff === 1) {
      tempStreak++;
      if (currentStreak === 0 || tempStreak > currentStreak) {
        currentStreak = tempStreak;
      }
      expectedDate = entryDate;
    } else {
      // Streak broken
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
      expectedDate = entryDate;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Check if current streak is still active (entry today or yesterday)
  const firstEntryDate = new Date(sorted[0].date);
  const daysSinceFirst = Math.floor((today.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceFirst > 1) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
}

/**
 * Map database entry to MoodEntry type
 */
function mapToMoodEntry(entry: typeof moodEntries.$inferSelect): MoodEntry {
  // Extract tags JSON data
  const tagsData = (entry.tags as TagsData) || {};

  // Extract astro context JSON data
  const astroData = (entry.astroContext as AstroContextData) || {};

  return {
    id: entry.id,
    userId: entry.userId,
    date: entry.date,
    moodScore: entry.moodScore,
    energyLevel: entry.energyLevel,
    emotions: tagsData.emotions || [],
    activities: tagsData.activities || [],
    notes: entry.notes,
    lunarPhase: astroData.lunarPhase || null,
    lunarIllumination: astroData.lunarIllumination || null,
    sleepHours: entry.sleepHours ? entry.sleepHours / 10 : null, // Convert from tenths back to hours
    createdAt: entry.createdAt!,
  };
}

// Common emotions for UI
export const COMMON_EMOTIONS = [
  'happy', 'calm', 'energetic', 'grateful', 'hopeful',
  'anxious', 'stressed', 'tired', 'sad', 'frustrated',
  'peaceful', 'motivated', 'creative', 'focused', 'relaxed',
];

// Common activities for UI
export const COMMON_ACTIVITIES = [
  'exercise', 'meditation', 'yoga', 'walking', 'reading',
  'socializing', 'work', 'cooking', 'music', 'nature',
  'journaling', 'sleep', 'relaxation', 'hobby', 'learning',
];
