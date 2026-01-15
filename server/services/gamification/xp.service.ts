/**
 * XP (Experience Points) Service
 * Handles XP awards, level calculations, and progress tracking
 */

import { db } from '../../db';
import { userProgress, xpTransactions } from '../../../shared/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { logger } from '../../logger';

// XP amounts for various actions
export const XP_REWARDS = {
  // Daily actions
  daily_login: 10,
  mood_entry: 15,
  habit_complete: 20,
  all_habits_complete: 50,
  daily_streak_bonus: 5, // per day of streak

  // Social actions
  add_friend: 25,
  send_first_message: 15,

  // Learning
  read_horoscope: 5,
  view_birth_chart: 10,

  // Achievements
  unlock_achievement: 50,

  // Special
  weekly_engagement: 100,
  monthly_engagement: 500,
} as const;

// Level thresholds - XP required for each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5500,   // Level 8
  8000,   // Level 9
  12000,  // Level 10
  17000,  // Level 11
  23000,  // Level 12
  30000,  // Level 13
  40000,  // Level 14
  55000,  // Level 15
  75000,  // Level 16
  100000, // Level 17
  150000, // Level 18
  225000, // Level 19
  350000, // Level 20
];

// Level tier names
export const LEVEL_TIERS = [
  { min: 1, max: 5, name: 'Seeker', color: '#9CA3AF' },
  { min: 6, max: 10, name: 'Explorer', color: '#60A5FA' },
  { min: 11, max: 15, name: 'Mystic', color: '#A78BFA' },
  { min: 16, max: 20, name: 'Sage', color: '#F59E0B' },
];

export interface UserProgressData {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  tier: typeof LEVEL_TIERS[number];
  dailyStreak: number;
  longestStreak: number;
}

export interface XpTransaction {
  id: number;
  amount: number;
  reason: string;
  createdAt: Date;
}

/**
 * Get or create user progress record
 */
export async function getUserProgress(userId: number): Promise<UserProgressData> {
  try {
    let [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!progress) {
      // Create new progress record
      [progress] = await db
        .insert(userProgress)
        .values({
          userId,
          totalXp: 0,
          currentLevel: 1,
          xpToNextLevel: 100,
          dailyStreak: 0,
          longestDailyStreak: 0,
        })
        .returning();
    }

    return calculateProgressData(progress);
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get user progress');
    throw error;
  }
}

/**
 * Award XP to a user
 */
export async function awardXp(
  userId: number,
  amount: number,
  reason: keyof typeof XP_REWARDS | string,
  sourceType?: string,
  sourceId?: number
): Promise<{ leveledUp: boolean; newLevel?: number; totalXp: number }> {
  try {
    // Get current progress
    const [current] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const currentXp = current?.totalXp || 0;
    const currentLevel = current?.currentLevel || 1;
    const newTotalXp = currentXp + amount;
    const newLevel = calculateLevel(newTotalXp);
    const leveledUp = newLevel > currentLevel;
    const xpToNext = getXpToNextLevel(newLevel, newTotalXp);

    // Update or create progress
    if (current) {
      await db
        .update(userProgress)
        .set({
          totalXp: newTotalXp,
          currentLevel: newLevel,
          xpToNextLevel: xpToNext,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.userId, userId));
    } else {
      await db
        .insert(userProgress)
        .values({
          userId,
          totalXp: newTotalXp,
          currentLevel: newLevel,
          xpToNextLevel: xpToNext,
          dailyStreak: 0,
          longestDailyStreak: 0,
        });
    }

    // Record transaction
    await db.insert(xpTransactions).values({
      userId,
      amount,
      reason: String(reason),
      sourceType: sourceType || null,
      sourceId: sourceId || null,
      balanceAfter: newTotalXp,
    });

    logger.info(
      { userId, amount, reason, newTotalXp, leveledUp },
      'XP awarded'
    );

    return { leveledUp, newLevel: leveledUp ? newLevel : undefined, totalXp: newTotalXp };
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to award XP');
    throw error;
  }
}

/**
 * Update daily streak
 */
export async function updateStreak(userId: number, increment: boolean): Promise<number> {
  try {
    const [current] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!current) {
      // Create new record
      await db.insert(userProgress).values({
        userId,
        totalXp: 0,
        currentLevel: 1,
        xpToNextLevel: 100,
        dailyStreak: increment ? 1 : 0,
        longestDailyStreak: increment ? 1 : 0,
      });
      return increment ? 1 : 0;
    }

    const newStreak = increment ? (current.dailyStreak || 0) + 1 : 0;
    const newLongest = Math.max(current.longestDailyStreak || 0, newStreak);

    await db
      .update(userProgress)
      .set({
        dailyStreak: newStreak,
        longestDailyStreak: newLongest,
        lastActivityDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .where(eq(userProgress.userId, userId));

    return newStreak;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to update streak');
    throw error;
  }
}

/**
 * Get XP transaction history
 */
export async function getXpHistory(userId: number, limit: number = 20): Promise<XpTransaction[]> {
  try {
    const transactions = await db
      .select()
      .from(xpTransactions)
      .where(eq(xpTransactions.userId, userId))
      .orderBy(desc(xpTransactions.createdAt))
      .limit(limit);

    return transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      reason: t.reason,
      createdAt: t.createdAt!,
    }));
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get XP history');
    throw error;
  }
}

/**
 * Get XP earned today
 */
export async function getTodayXp(userId: number): Promise<number> {
  const today = new Date().toISOString().split('T')[0];

  const result = await db
    .select({ total: sql<number>`SUM(${xpTransactions.amount})` })
    .from(xpTransactions)
    .where(and(
      eq(xpTransactions.userId, userId),
      sql`DATE(${xpTransactions.createdAt}) = ${today}`
    ));

  return result[0]?.total || 0;
}

/**
 * Calculate level from total XP
 */
function calculateLevel(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate XP needed to reach next level
 */
function getXpToNextLevel(level: number, currentXp: number): number {
  const nextLevelXp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return Math.max(0, nextLevelXp - currentXp);
}

/**
 * Calculate progress data from raw database record
 */
function calculateProgressData(progress: typeof userProgress.$inferSelect): UserProgressData {
  const totalXp = progress.totalXp || 0;
  const level = progress.currentLevel || calculateLevel(totalXp);

  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpIntoLevel = totalXp - currentLevelXp;
  const xpForLevel = nextLevelXp - currentLevelXp;
  const progressPercent = Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));

  const tier = LEVEL_TIERS.find((t) => level >= t.min && level <= t.max) || LEVEL_TIERS[0];

  return {
    level,
    totalXp,
    currentLevelXp: xpIntoLevel,
    nextLevelXp: xpForLevel,
    progressPercent,
    tier,
    dailyStreak: progress.dailyStreak || 0,
    longestStreak: progress.longestDailyStreak || 0,
  };
}
