/**
 * Tracking API Routes
 * Handles mood entries, habits, and wellness tracking
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../logger';
import {
  createMoodEntry,
  getMoodEntries,
  getTodaysMoodEntry,
  getMoodAnalytics,
  COMMON_EMOTIONS,
  COMMON_ACTIVITIES,
} from '../services/tracking/mood.service';
import {
  createHabit,
  getUserHabits,
  getHabit,
  completeHabit,
  uncompleteHabit,
  updateHabit,
  archiveHabit,
  getHabitHistory,
  PRESET_HABITS,
} from '../services/tracking/habit.service';
import { getLunarData } from '../services/astrology/lunar.service';

const router = Router();

// Validation schemas
const moodEntrySchema = z.object({
  moodScore: z.number().min(1).max(5),
  energyLevel: z.number().min(1).max(5).optional(),
  emotions: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().min(1).max(5).optional(),
});

const habitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['health', 'fitness', 'mindfulness', 'nutrition', 'sleep', 'social', 'other']).optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']).optional(),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  reminderTime: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

// ==================== MOOD ENDPOINTS ====================

/**
 * POST /api/v2/tracking/mood
 * Create or update today's mood entry
 */
router.post('/mood', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const validatedInput = moodEntrySchema.parse(req.body);

    const entry = await createMoodEntry({
      userId: req.user.id,
      ...validatedInput,
    });

    res.status(201).json({
      success: true,
      message: 'Mood entry saved',
      data: entry,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error saving mood entry');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not save mood entry.',
    });
  }
});

/**
 * GET /api/v2/tracking/mood
 * Get mood entries for the user
 */
router.get('/mood', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const limit = parseInt(req.query.limit as string) || 30;
    const entries = await getMoodEntries(req.user.id, undefined, undefined, limit);

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching mood entries');
    res.status(500).json({
      success: false,
      message: 'Could not fetch mood entries.',
    });
  }
});

/**
 * GET /api/v2/tracking/mood/today
 * Get today's mood entry
 */
router.get('/mood/today', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const entry = await getTodaysMoodEntry(req.user.id);
    const lunarData = getLunarData(new Date());

    res.status(200).json({
      success: true,
      data: {
        entry,
        hasEntry: !!entry,
        lunarData,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching today mood');
    res.status(500).json({
      success: false,
      message: 'Could not fetch today mood entry.',
    });
  }
});

/**
 * GET /api/v2/tracking/mood/analytics
 * Get mood analytics and insights
 */
router.get('/mood/analytics', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const days = parseInt(req.query.days as string) || 30;
    const analytics = await getMoodAnalytics(req.user.id, days);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching mood analytics');
    res.status(500).json({
      success: false,
      message: 'Could not fetch mood analytics.',
    });
  }
});

/**
 * GET /api/v2/tracking/mood/options
 * Get common emotions and activities for UI
 */
router.get('/mood/options', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      emotions: COMMON_EMOTIONS,
      activities: COMMON_ACTIVITIES,
    },
  });
});

// ==================== HABIT ENDPOINTS ====================

/**
 * POST /api/v2/tracking/habits
 * Create a new habit
 */
router.post('/habits', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const validatedInput = habitSchema.parse(req.body);

    const habit = await createHabit({
      userId: req.user.id,
      ...validatedInput,
    });

    res.status(201).json({
      success: true,
      message: 'Habit created',
      data: habit,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating habit');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not create habit.',
    });
  }
});

/**
 * GET /api/v2/tracking/habits
 * Get all habits for the user
 */
router.get('/habits', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const includeInactive = req.query.includeInactive === 'true';
    const habits = await getUserHabits(req.user.id, includeInactive);

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching habits');
    res.status(500).json({
      success: false,
      message: 'Could not fetch habits.',
    });
  }
});

/**
 * GET /api/v2/tracking/habits/presets
 * Get preset habit suggestions
 */
router.get('/habits/presets', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: PRESET_HABITS,
  });
});

/**
 * GET /api/v2/tracking/habits/:id
 * Get a specific habit
 */
router.get('/habits/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const habit = await getHabit(habitId, req.user.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching habit');
    res.status(500).json({
      success: false,
      message: 'Could not fetch habit.',
    });
  }
});

/**
 * PUT /api/v2/tracking/habits/:id
 * Update a habit
 */
router.put('/habits/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const validatedInput = habitSchema.partial().parse(req.body);

    const habit = await updateHabit(habitId, req.user.id, validatedInput);

    res.status(200).json({
      success: true,
      message: 'Habit updated',
      data: habit,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error updating habit');

    if ((error as Error).message === 'Habit not found') {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not update habit.',
    });
  }
});

/**
 * DELETE /api/v2/tracking/habits/:id
 * Archive a habit
 */
router.delete('/habits/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const archived = await archiveHabit(habitId, req.user.id);

    if (!archived) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit archived',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error archiving habit');
    res.status(500).json({
      success: false,
      message: 'Could not archive habit.',
    });
  }
});

/**
 * POST /api/v2/tracking/habits/:id/complete
 * Mark habit as complete for today
 */
router.post('/habits/:id/complete', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const notes = req.body.notes as string | undefined;

    const { habit, log } = await completeHabit(habitId, req.user.id, notes);

    res.status(200).json({
      success: true,
      message: 'Habit completed',
      data: { habit, log },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error completing habit');

    if ((error as Error).message === 'Habit not found') {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not complete habit.',
    });
  }
});

/**
 * POST /api/v2/tracking/habits/:id/uncomplete
 * Mark habit as incomplete for today
 */
router.post('/habits/:id/uncomplete', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const habit = await uncompleteHabit(habitId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Habit uncompleted',
      data: habit,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error uncompleting habit');

    if ((error as Error).message === 'Habit not found') {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not uncomplete habit.',
    });
  }
});

/**
 * GET /api/v2/tracking/habits/:id/history
 * Get habit completion history
 */
router.get('/habits/:id/history', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID',
      });
    }

    const days = parseInt(req.query.days as string) || 30;
    const history = await getHabitHistory(habitId, req.user.id, days);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching habit history');

    if ((error as Error).message === 'Habit not found') {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not fetch habit history.',
    });
  }
});

// ==================== DASHBOARD ENDPOINT ====================

/**
 * GET /api/v2/tracking/dashboard
 * Get combined tracking dashboard data
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Get all data in parallel
    const [todayMood, habits, moodAnalytics, lunarData] = await Promise.all([
      getTodaysMoodEntry(req.user.id),
      getUserHabits(req.user.id),
      getMoodAnalytics(req.user.id, 7),
      Promise.resolve(getLunarData(new Date())),
    ]);

    const completedHabits = habits.filter((h) => h.completedToday).length;
    const totalHabits = habits.length;

    res.status(200).json({
      success: true,
      data: {
        mood: {
          hasEntry: !!todayMood,
          entry: todayMood,
          weeklyAverage: moodAnalytics.averageMood,
          streak: moodAnalytics.currentStreak,
        },
        habits: {
          total: totalHabits,
          completed: completedHabits,
          progress: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
          items: habits.slice(0, 5), // Top 5 habits
        },
        lunar: lunarData,
        date: new Date().toISOString().split('T')[0],
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching dashboard');
    res.status(500).json({
      success: false,
      message: 'Could not fetch dashboard data.',
    });
  }
});

export default router;
