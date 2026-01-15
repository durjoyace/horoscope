/**
 * Leaderboard Service
 * Handles rankings and competitive features
 */

import { db } from '../../db';
import { userProgress, users } from '../../../shared/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { logger } from '../../logger';

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

/**
 * Get global leaderboard
 */
export async function getGlobalLeaderboard(
  userId: number,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardData> {
  try {
    // Get total user count
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userProgress);
    const totalUsers = countResult?.count || 0;

    // Get top users
    const entries = await db
      .select({
        userId: userProgress.userId,
        level: userProgress.currentLevel,
        totalXp: userProgress.totalXp,
        dailyStreak: userProgress.dailyStreak,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .orderBy(desc(userProgress.totalXp))
      .limit(limit)
      .offset(offset);

    const leaderboardEntries: LeaderboardEntry[] = entries.map((entry, index) => ({
      rank: offset + index + 1,
      userId: entry.userId,
      email: entry.email,
      firstName: entry.firstName,
      lastName: entry.lastName,
      zodiacSign: entry.zodiacSign,
      level: entry.level || 1,
      totalXp: entry.totalXp || 0,
      dailyStreak: entry.dailyStreak || 0,
    }));

    // Get current user's rank
    const userRank = await getUserRank(userId);

    return {
      entries: leaderboardEntries,
      userRank,
      totalUsers,
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to get global leaderboard');
    throw error;
  }
}

/**
 * Get leaderboard filtered by zodiac sign
 */
export async function getZodiacLeaderboard(
  userId: number,
  zodiacSign: string,
  limit: number = 50
): Promise<LeaderboardData> {
  try {
    // Get total users with this sign
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .where(eq(users.zodiacSign, zodiacSign));
    const totalUsers = countResult?.count || 0;

    // Get top users of this sign
    const entries = await db
      .select({
        userId: userProgress.userId,
        level: userProgress.currentLevel,
        totalXp: userProgress.totalXp,
        dailyStreak: userProgress.dailyStreak,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .where(eq(users.zodiacSign, zodiacSign))
      .orderBy(desc(userProgress.totalXp))
      .limit(limit);

    const leaderboardEntries: LeaderboardEntry[] = entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      email: entry.email,
      firstName: entry.firstName,
      lastName: entry.lastName,
      zodiacSign: entry.zodiacSign,
      level: entry.level || 1,
      totalXp: entry.totalXp || 0,
      dailyStreak: entry.dailyStreak || 0,
    }));

    // Get current user's rank within zodiac
    const userRank = await getUserZodiacRank(userId, zodiacSign);

    return {
      entries: leaderboardEntries,
      userRank,
      totalUsers,
    };
  } catch (error) {
    logger.error({ err: error, zodiacSign }, 'Failed to get zodiac leaderboard');
    throw error;
  }
}

/**
 * Get friends leaderboard
 */
export async function getFriendsLeaderboard(
  userId: number,
  friendIds: number[]
): Promise<LeaderboardData> {
  try {
    // Include the user in the friends list
    const allUserIds = Array.from(new Set([userId, ...friendIds]));

    if (allUserIds.length === 0) {
      return { entries: [], userRank: null, totalUsers: 0 };
    }

    const entries = await db
      .select({
        userId: userProgress.userId,
        level: userProgress.currentLevel,
        totalXp: userProgress.totalXp,
        dailyStreak: userProgress.dailyStreak,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .where(sql`${userProgress.userId} IN (${sql.join(allUserIds, sql`,`)})`)
      .orderBy(desc(userProgress.totalXp));

    const leaderboardEntries: LeaderboardEntry[] = entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      email: entry.email,
      firstName: entry.firstName,
      lastName: entry.lastName,
      zodiacSign: entry.zodiacSign,
      level: entry.level || 1,
      totalXp: entry.totalXp || 0,
      dailyStreak: entry.dailyStreak || 0,
    }));

    // Find user's rank in friends leaderboard
    const userRank = leaderboardEntries.findIndex((e) => e.userId === userId) + 1 || null;

    return {
      entries: leaderboardEntries,
      userRank,
      totalUsers: leaderboardEntries.length,
    };
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get friends leaderboard');
    throw error;
  }
}

/**
 * Get weekly leaderboard (XP earned this week)
 */
export async function getWeeklyLeaderboard(
  userId: number,
  limit: number = 50
): Promise<LeaderboardData> {
  try {
    // Calculate start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // Get weekly XP from xp_transactions
    const weeklyXp = await db.execute(sql`
      SELECT
        up.user_id,
        up.current_level,
        up.daily_streak,
        u.email,
        u.first_name,
        u.last_name,
        u.zodiac_sign,
        COALESCE(SUM(xt.amount), 0) as weekly_xp
      FROM user_progress up
      INNER JOIN users u ON u.id = up.user_id
      LEFT JOIN xp_transactions xt ON xt.user_id = up.user_id
        AND xt.created_at >= ${weekStart.toISOString()}
      GROUP BY up.user_id, up.current_level, up.daily_streak, u.email, u.first_name, u.last_name, u.zodiac_sign
      ORDER BY weekly_xp DESC
      LIMIT ${limit}
    `);

    const entries = (weeklyXp.rows as any[]).map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      zodiacSign: row.zodiac_sign,
      level: row.current_level || 1,
      totalXp: parseInt(row.weekly_xp) || 0,
      dailyStreak: row.daily_streak || 0,
    }));

    // Get total users count
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userProgress);

    // Find user's rank
    const userRankIndex = entries.findIndex((e) => e.userId === userId);
    const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;

    return {
      entries,
      userRank,
      totalUsers: countResult?.count || 0,
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to get weekly leaderboard');
    throw error;
  }
}

/**
 * Get streak leaderboard
 */
export async function getStreakLeaderboard(
  userId: number,
  limit: number = 50
): Promise<LeaderboardData> {
  try {
    const entries = await db
      .select({
        userId: userProgress.userId,
        level: userProgress.currentLevel,
        totalXp: userProgress.totalXp,
        dailyStreak: userProgress.dailyStreak,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
      })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .where(gte(userProgress.dailyStreak, 1))
      .orderBy(desc(userProgress.dailyStreak))
      .limit(limit);

    const leaderboardEntries: LeaderboardEntry[] = entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      email: entry.email,
      firstName: entry.firstName,
      lastName: entry.lastName,
      zodiacSign: entry.zodiacSign,
      level: entry.level || 1,
      totalXp: entry.totalXp || 0,
      dailyStreak: entry.dailyStreak || 0,
    }));

    // Get user's streak rank
    const [userProgressData] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    let userRank: number | null = null;
    if (userProgressData?.dailyStreak && userProgressData.dailyStreak > 0) {
      const [rankResult] = await db
        .select({ rank: sql<number>`COUNT(*) + 1` })
        .from(userProgress)
        .where(sql`${userProgress.dailyStreak} > ${userProgressData.dailyStreak}`);
      userRank = rankResult?.rank || null;
    }

    // Get total users with streaks
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userProgress)
      .where(gte(userProgress.dailyStreak, 1));

    return {
      entries: leaderboardEntries,
      userRank,
      totalUsers: countResult?.count || 0,
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to get streak leaderboard');
    throw error;
  }
}

/**
 * Get user's global rank
 */
async function getUserRank(userId: number): Promise<number | null> {
  try {
    const [userProgressData] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!userProgressData) return null;

    const [result] = await db
      .select({ rank: sql<number>`COUNT(*) + 1` })
      .from(userProgress)
      .where(sql`${userProgress.totalXp} > ${userProgressData.totalXp || 0}`);

    return result?.rank || 1;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get user rank');
    return null;
  }
}

/**
 * Get user's rank within their zodiac sign
 */
async function getUserZodiacRank(userId: number, zodiacSign: string): Promise<number | null> {
  try {
    const [userProgressData] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!userProgressData) return null;

    const [result] = await db
      .select({ rank: sql<number>`COUNT(*) + 1` })
      .from(userProgress)
      .innerJoin(users, eq(users.id, userProgress.userId))
      .where(and(
        eq(users.zodiacSign, zodiacSign),
        sql`${userProgress.totalXp} > ${userProgressData.totalXp || 0}`
      ));

    return result?.rank || 1;
  } catch (error) {
    logger.error({ err: error, userId, zodiacSign }, 'Failed to get user zodiac rank');
    return null;
  }
}
