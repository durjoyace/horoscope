/**
 * Achievement Service
 * Handles achievement definitions, progress, and unlocks
 */

import { db } from '../../db';
import { achievements, userAchievements, userProgress } from '../../../shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { logger } from '../../logger';
import { awardXp, XP_REWARDS } from './xp.service';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  isSecret: boolean;
  criteriaTarget: number;
}

export interface UserAchievementData {
  achievement: Achievement;
  unlockedAt: Date | null;
  progress: number;
  isUnlocked: boolean;
}

// Default achievements to seed (matching the schema structure)
export const DEFAULT_ACHIEVEMENTS = [
  // Streak achievements
  { name: 'Getting Started', description: 'Maintain a 3-day streak', icon: 'flame', category: 'streak', xpReward: 50, isSecret: false, criteriaType: 'streak', criteriaTarget: 3 },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', category: 'streak', xpReward: 100, isSecret: false, criteriaType: 'streak', criteriaTarget: 7 },
  { name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: 'flame', category: 'streak', xpReward: 500, isSecret: false, criteriaType: 'streak', criteriaTarget: 30 },
  { name: 'Centurion', description: 'Maintain a 100-day streak', icon: 'crown', category: 'streak', xpReward: 2000, isSecret: false, criteriaType: 'streak', criteriaTarget: 100 },

  // Habit achievements
  { name: 'Habit Builder', description: 'Complete 10 habits', icon: 'check', category: 'habit', xpReward: 50, isSecret: false, criteriaType: 'count', criteriaTarget: 10 },
  { name: 'Habit Master', description: 'Complete 50 habits', icon: 'check-circle', category: 'habit', xpReward: 200, isSecret: false, criteriaType: 'count', criteriaTarget: 50 },
  { name: 'Habit Legend', description: 'Complete 100 habits', icon: 'trophy', category: 'habit', xpReward: 500, isSecret: false, criteriaType: 'count', criteriaTarget: 100 },

  // Mood tracking achievements
  { name: 'Self-Aware', description: 'Log your mood for 7 days', icon: 'heart', category: 'wellness', xpReward: 75, isSecret: false, criteriaType: 'count', criteriaTarget: 7 },
  { name: 'Emotional Explorer', description: 'Log your mood for 30 days', icon: 'heart', category: 'wellness', xpReward: 250, isSecret: false, criteriaType: 'count', criteriaTarget: 30 },

  // Social achievements
  { name: 'First Friend', description: 'Add your first friend', icon: 'users', category: 'social', xpReward: 25, isSecret: false, criteriaType: 'count', criteriaTarget: 1 },
  { name: 'Social Butterfly', description: 'Add 5 friends', icon: 'users', category: 'social', xpReward: 100, isSecret: false, criteriaType: 'count', criteriaTarget: 5 },

  // Level achievements
  { name: 'Rising Star', description: 'Reach level 5', icon: 'star', category: 'milestone', xpReward: 100, isSecret: false, criteriaType: 'count', criteriaTarget: 5 },
  { name: 'Established', description: 'Reach level 10', icon: 'award', category: 'milestone', xpReward: 300, isSecret: false, criteriaType: 'count', criteriaTarget: 10 },
  { name: 'Master', description: 'Reach level 20', icon: 'crown', category: 'milestone', xpReward: 1000, isSecret: false, criteriaType: 'count', criteriaTarget: 20 },

  // Secret achievements
  { name: 'Night Owl', description: 'Log a mood entry after midnight', icon: 'moon', category: 'astrology', xpReward: 50, isSecret: true, criteriaType: 'custom', criteriaTarget: 1 },
  { name: 'Early Bird', description: 'Log a mood entry before 6 AM', icon: 'sun', category: 'astrology', xpReward: 50, isSecret: true, criteriaType: 'custom', criteriaTarget: 1 },
  { name: 'Lunar Connection', description: 'Log a mood entry during a full moon', icon: 'moon', category: 'astrology', xpReward: 75, isSecret: true, criteriaType: 'custom', criteriaTarget: 1 },
];

/**
 * Get all achievements with user progress
 */
export async function getUserAchievements(userId: number): Promise<UserAchievementData[]> {
  try {
    // Get all achievements
    const allAchievements = await db.select().from(achievements).where(eq(achievements.isActive, true));

    // Get user's unlocked achievements
    const userUnlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const unlockedMap = new Map(userUnlocked.map((ua) => [ua.achievementId, ua]));

    // Get user progress for calculating achievement progress
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    return allAchievements.map((ach) => {
      const userAch = unlockedMap.get(ach.id);
      const achievementProgress = calculateAchievementProgress(ach, progress, userAch);

      return {
        achievement: mapToAchievement(ach),
        unlockedAt: userAch?.unlockedAt || null,
        progress: achievementProgress,
        isUnlocked: !!userAch?.unlockedAt,
      };
    });
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get user achievements');
    throw error;
  }
}

/**
 * Check and unlock achievements for a user
 */
export async function checkAchievements(
  userId: number,
  category?: string
): Promise<Achievement[]> {
  try {
    const newlyUnlocked: Achievement[] = [];

    // Get achievements to check
    let allAchievements = await db.select().from(achievements).where(eq(achievements.isActive, true));

    const filtered = category
      ? allAchievements.filter((a) => a.category === category)
      : allAchievements;

    // Get user's already unlocked
    const alreadyUnlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const unlockedIds = new Set(alreadyUnlocked.filter(ua => ua.unlockedAt).map((ua) => ua.achievementId));

    // Get user progress
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!progress) return [];

    for (const ach of filtered) {
      if (unlockedIds.has(ach.id)) continue;

      const isEarned = checkAchievementEarned(ach, progress);

      if (isEarned) {
        // Check if there's already a user achievement record (for progress tracking)
        const existing = alreadyUnlocked.find(ua => ua.achievementId === ach.id);

        if (existing) {
          // Update to unlock
          await db.update(userAchievements)
            .set({ unlockedAt: new Date(), isNotified: false })
            .where(eq(userAchievements.id, existing.id));
        } else {
          // Create and unlock
          await db.insert(userAchievements).values({
            userId,
            achievementId: ach.id,
            progress: ach.criteriaTarget || 0,
            progressTarget: ach.criteriaTarget,
            unlockedAt: new Date(),
          });
        }

        // Award XP
        await awardXp(userId, ach.xpReward || XP_REWARDS.unlock_achievement, 'unlock_achievement', 'achievement', ach.id);

        newlyUnlocked.push(mapToAchievement(ach));

        logger.info({ userId, achievementName: ach.name }, 'Achievement unlocked');
      }
    }

    return newlyUnlocked;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to check achievements');
    throw error;
  }
}

/**
 * Get recently unlocked achievements
 */
export async function getRecentUnlocks(userId: number, limit: number = 5): Promise<UserAchievementData[]> {
  try {
    const recent = await db
      .select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        sql`${userAchievements.unlockedAt} IS NOT NULL`
      ))
      .orderBy(desc(userAchievements.unlockedAt))
      .limit(limit);

    const achievementIds = recent.map((r) => r.achievementId);

    if (achievementIds.length === 0) return [];

    const achievementData = await db
      .select()
      .from(achievements)
      .where(sql`${achievements.id} IN (${sql.join(achievementIds, sql`,`)})`);

    const achMap = new Map(achievementData.map((a) => [a.id, a]));

    return recent
      .map((r) => {
        const ach = achMap.get(r.achievementId);
        if (!ach) return null;
        return {
          achievement: mapToAchievement(ach),
          unlockedAt: r.unlockedAt,
          progress: 100,
          isUnlocked: true,
        };
      })
      .filter((r): r is UserAchievementData => r !== null);
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get recent unlocks');
    throw error;
  }
}

/**
 * Seed default achievements
 */
export async function seedAchievements(): Promise<void> {
  try {
    const existing = await db.select({ name: achievements.name }).from(achievements);
    const existingNames = new Set(existing.map((a) => a.name));

    const toInsert = DEFAULT_ACHIEVEMENTS.filter((a) => !existingNames.has(a.name));

    if (toInsert.length > 0) {
      await db.insert(achievements).values(toInsert);
      logger.info({ count: toInsert.length }, 'Seeded achievements');
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to seed achievements');
  }
}

function checkAchievementEarned(
  achievement: typeof achievements.$inferSelect,
  progress: typeof userProgress.$inferSelect
): boolean {
  const target = achievement.criteriaTarget || 1;

  // Check based on category and criteria type
  switch (achievement.category) {
    case 'streak':
      return (progress.dailyStreak || 0) >= target;
    case 'milestone':
      return (progress.currentLevel || 1) >= target;
    default:
      // For other categories, we'd need to track progress separately
      return false;
  }
}

function calculateAchievementProgress(
  achievement: typeof achievements.$inferSelect,
  progress: typeof userProgress.$inferSelect | undefined,
  userAch: typeof userAchievements.$inferSelect | undefined
): number {
  if (userAch?.unlockedAt) return 100;
  if (!progress) return 0;

  const target = achievement.criteriaTarget || 1;
  let current = 0;

  switch (achievement.category) {
    case 'streak':
      current = progress.dailyStreak || 0;
      break;
    case 'milestone':
      current = progress.currentLevel || 1;
      break;
    default:
      // Use user achievement progress if available
      current = userAch?.progress || 0;
  }

  return Math.min(100, Math.round((current / target) * 100));
}

function mapToAchievement(entry: typeof achievements.$inferSelect): Achievement {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description || '',
    icon: entry.icon || 'star',
    category: entry.category || 'general',
    xpReward: entry.xpReward || 50,
    isSecret: entry.isSecret || false,
    criteriaTarget: entry.criteriaTarget || 1,
  };
}
