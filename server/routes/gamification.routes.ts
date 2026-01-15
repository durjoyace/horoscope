/**
 * Gamification Routes
 * Handles XP, achievements, and leaderboards
 */

import { Router, Request, Response } from 'express';
import { getUserProgress, getXpHistory, getTodayXp, awardXp, XP_REWARDS } from '../services/gamification/xp.service';
import { getUserAchievements, checkAchievements, getRecentUnlocks, seedAchievements } from '../services/gamification/achievement.service';
import {
  getGlobalLeaderboard,
  getZodiacLeaderboard,
  getFriendsLeaderboard,
  getWeeklyLeaderboard,
  getStreakLeaderboard,
} from '../services/gamification/leaderboard.service';
import { getFriendIds } from '../services/social/friendship.service';
import { logger } from '../logger';

const router = Router();

/**
 * Get user's gamification profile
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await getUserProgress(userId);
    const todayXp = await getTodayXp(userId);
    const recentAchievements = await getRecentUnlocks(userId, 3);

    res.json({
      progress,
      todayXp,
      recentAchievements,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to get gamification profile');
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * Get XP history
 */
router.get('/xp/history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const history = await getXpHistory(userId, limit);

    res.json(history);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get XP history');
    res.status(500).json({ error: 'Failed to get XP history' });
  }
});

/**
 * Award XP (internal/testing endpoint)
 */
router.post('/xp/award', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { reason, amount } = req.body;

    if (!reason || !XP_REWARDS[reason as keyof typeof XP_REWARDS]) {
      return res.status(400).json({ error: 'Invalid XP reason' });
    }

    const xpAmount = amount || XP_REWARDS[reason as keyof typeof XP_REWARDS];
    const result = await awardXp(userId, xpAmount, reason);

    // Check for newly unlocked achievements
    const newAchievements = await checkAchievements(userId);

    res.json({
      ...result,
      newAchievements,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to award XP');
    res.status(500).json({ error: 'Failed to award XP' });
  }
});

/**
 * Get all achievements with progress
 */
router.get('/achievements', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const achievements = await getUserAchievements(userId);

    // Group by category
    const grouped = achievements.reduce((acc, ach) => {
      const category = ach.achievement.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(ach);
      return acc;
    }, {} as Record<string, typeof achievements>);

    res.json({
      achievements,
      grouped,
      stats: {
        total: achievements.length,
        unlocked: achievements.filter((a) => a.isUnlocked).length,
        inProgress: achievements.filter((a) => !a.isUnlocked && a.progress > 0).length,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to get achievements');
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

/**
 * Check for newly unlocked achievements
 */
router.post('/achievements/check', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { category } = req.body;
    const newlyUnlocked = await checkAchievements(userId, category);

    res.json({
      newlyUnlocked,
      count: newlyUnlocked.length,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to check achievements');
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

/**
 * Get recent unlocks
 */
router.get('/achievements/recent', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const recent = await getRecentUnlocks(userId, limit);

    res.json(recent);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get recent unlocks');
    res.status(500).json({ error: 'Failed to get recent unlocks' });
  }
});

/**
 * Get global leaderboard
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const leaderboard = await getGlobalLeaderboard(userId, limit, offset);

    res.json(leaderboard);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get leaderboard');
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

/**
 * Get zodiac-specific leaderboard
 */
router.get('/leaderboard/zodiac/:sign', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { sign } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const leaderboard = await getZodiacLeaderboard(userId, sign, limit);

    res.json(leaderboard);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get zodiac leaderboard');
    res.status(500).json({ error: 'Failed to get zodiac leaderboard' });
  }
});

/**
 * Get friends leaderboard
 */
router.get('/leaderboard/friends', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const friendIds = await getFriendIds(userId);
    const leaderboard = await getFriendsLeaderboard(userId, friendIds);

    res.json(leaderboard);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get friends leaderboard');
    res.status(500).json({ error: 'Failed to get friends leaderboard' });
  }
});

/**
 * Get weekly leaderboard
 */
router.get('/leaderboard/weekly', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const leaderboard = await getWeeklyLeaderboard(userId, limit);

    res.json(leaderboard);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get weekly leaderboard');
    res.status(500).json({ error: 'Failed to get weekly leaderboard' });
  }
});

/**
 * Get streak leaderboard
 */
router.get('/leaderboard/streaks', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const leaderboard = await getStreakLeaderboard(userId, limit);

    res.json(leaderboard);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get streak leaderboard');
    res.status(500).json({ error: 'Failed to get streak leaderboard' });
  }
});

/**
 * Seed default achievements (admin only)
 */
router.post('/achievements/seed', async (req: Request, res: Response) => {
  try {
    await seedAchievements();
    res.json({ success: true, message: 'Achievements seeded' });
  } catch (error) {
    logger.error({ err: error }, 'Failed to seed achievements');
    res.status(500).json({ error: 'Failed to seed achievements' });
  }
});

export default router;
