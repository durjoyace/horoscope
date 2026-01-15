/**
 * Habit Tracking Service
 * Handles habit creation, completion, and streak tracking
 */

import { db } from '../../db';
import { habits, habitLogs } from '../../../shared/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { logger } from '../../logger';

// Types
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitCategory = 'health' | 'fitness' | 'mindfulness' | 'nutrition' | 'sleep' | 'social' | 'other';

export interface HabitInput {
  userId: number;
  name: string;
  description?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  targetDays?: number[];
  reminderTime?: string;
  icon?: string;
  color?: string;
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
  createdAt: Date;
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  notes: string | null;
  createdAt: Date;
}

export interface HabitWithStatus extends Habit {
  completedToday: boolean;
  todayLog: HabitLog | null;
}

/**
 * Create a new habit
 */
export async function createHabit(input: HabitInput): Promise<Habit> {
  try {
    const [habit] = await db
      .insert(habits)
      .values({
        userId: input.userId,
        name: input.name,
        description: input.description || null,
        category: input.category || 'other',
        frequency: input.frequency || 'daily',
        targetDays: input.targetDays || [0, 1, 2, 3, 4, 5, 6], // All days by default
        reminderTime: input.reminderTime || null,
        icon: input.icon || null,
        color: input.color || null,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        isArchived: false,
      })
      .returning();

    logger.info({ habitId: habit.id, userId: input.userId }, 'Created habit');
    return mapToHabit(habit);
  } catch (error) {
    logger.error({ err: error }, 'Failed to create habit');
    throw error;
  }
}

/**
 * Get all habits for a user
 */
export async function getUserHabits(userId: number, includeInactive: boolean = false): Promise<HabitWithStatus[]> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));

    // Get today's logs for all habits
    const habitIds = userHabits.map((h) => h.id);
    const todayLogs = habitIds.length > 0
      ? await db
          .select()
          .from(habitLogs)
          .where(and(
            sql`${habitLogs.habitId} IN (${sql.join(habitIds, sql`,`)})`,
            eq(habitLogs.date, today)
          ))
      : [];

    const logsMap = new Map(todayLogs.map((l) => [l.habitId, l]));

    const habitsWithStatus = userHabits
      .filter((h) => includeInactive || !h.isArchived)
      .map((h) => {
        const todayLog = logsMap.get(h.id);
        return {
          ...mapToHabit(h),
          completedToday: todayLog?.completed || false,
          todayLog: todayLog ? mapToHabitLog(todayLog) : null,
        };
      });

    return habitsWithStatus;
  } catch (error) {
    logger.error({ err: error, userId }, 'Failed to get user habits');
    throw error;
  }
}

/**
 * Get a single habit by ID
 */
export async function getHabit(habitId: number, userId: number): Promise<HabitWithStatus | null> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) return null;

    const [todayLog] = await db
      .select()
      .from(habitLogs)
      .where(and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, today)
      ));

    return {
      ...mapToHabit(habit),
      completedToday: todayLog?.completed || false,
      todayLog: todayLog ? mapToHabitLog(todayLog) : null,
    };
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to get habit');
    throw error;
  }
}

/**
 * Complete a habit for today
 */
export async function completeHabit(
  habitId: number,
  userId: number,
  notes?: string
): Promise<{ habit: Habit; log: HabitLog }> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Verify ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check for existing log
    const [existingLog] = await db
      .select()
      .from(habitLogs)
      .where(and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, today)
      ));

    let log: typeof habitLogs.$inferSelect;

    if (existingLog) {
      // Update existing log
      const [updated] = await db
        .update(habitLogs)
        .set({
          completed: true,
          notes: notes || existingLog.notes,
        })
        .where(eq(habitLogs.id, existingLog.id))
        .returning();
      log = updated;
    } else {
      // Create new log - include userId as required by schema
      const [created] = await db
        .insert(habitLogs)
        .values({
          habitId,
          userId, // Required field
          date: today,
          completed: true,
          notes: notes || null,
        })
        .returning();
      log = created;
    }

    // Update habit streak and total
    const newStreak = await calculateCurrentStreak(habitId);
    const [updatedHabit] = await db
      .update(habits)
      .set({
        currentStreak: newStreak,
        longestStreak: Math.max(habit.longestStreak || 0, newStreak),
        totalCompletions: (habit.totalCompletions || 0) + (existingLog ? 0 : 1),
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId))
      .returning();

    logger.info({ habitId, date: today }, 'Completed habit');

    return {
      habit: mapToHabit(updatedHabit),
      log: mapToHabitLog(log),
    };
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to complete habit');
    throw error;
  }
}

/**
 * Uncomplete a habit for today
 */
export async function uncompleteHabit(habitId: number, userId: number): Promise<Habit> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Verify ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Update log to incomplete
    await db
      .update(habitLogs)
      .set({ completed: false })
      .where(and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, today)
      ));

    // Recalculate streak
    const newStreak = await calculateCurrentStreak(habitId);
    const [updatedHabit] = await db
      .update(habits)
      .set({
        currentStreak: newStreak,
        totalCompletions: Math.max(0, (habit.totalCompletions || 0) - 1),
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId))
      .returning();

    return mapToHabit(updatedHabit);
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to uncomplete habit');
    throw error;
  }
}

/**
 * Update a habit
 */
export async function updateHabit(
  habitId: number,
  userId: number,
  updates: Partial<HabitInput>
): Promise<Habit> {
  try {
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) {
      throw new Error('Habit not found');
    }

    const [updated] = await db
      .update(habits)
      .set({
        name: updates.name || habit.name,
        description: updates.description !== undefined ? updates.description : habit.description,
        category: updates.category || habit.category,
        frequency: updates.frequency || habit.frequency,
        targetDays: updates.targetDays || habit.targetDays,
        reminderTime: updates.reminderTime !== undefined ? updates.reminderTime : habit.reminderTime,
        icon: updates.icon !== undefined ? updates.icon : habit.icon,
        color: updates.color !== undefined ? updates.color : habit.color,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId))
      .returning();

    return mapToHabit(updated);
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to update habit');
    throw error;
  }
}

/**
 * Archive a habit (soft delete)
 */
export async function archiveHabit(habitId: number, userId: number): Promise<boolean> {
  try {
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) return false;

    await db
      .update(habits)
      .set({
        isArchived: true,
        archivedAt: new Date(),
      })
      .where(eq(habits.id, habitId));

    logger.info({ habitId }, 'Archived habit');
    return true;
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to archive habit');
    throw error;
  }
}

/**
 * Get habit completion history
 */
export async function getHabitHistory(
  habitId: number,
  userId: number,
  days: number = 30
): Promise<HabitLog[]> {
  try {
    // Verify ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      ));

    if (!habit) {
      throw new Error('Habit not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await db
      .select()
      .from(habitLogs)
      .where(and(
        eq(habitLogs.habitId, habitId),
        gte(habitLogs.date, startDate.toISOString().split('T')[0])
      ))
      .orderBy(desc(habitLogs.date));

    return logs.map(mapToHabitLog);
  } catch (error) {
    logger.error({ err: error, habitId }, 'Failed to get habit history');
    throw error;
  }
}

/**
 * Calculate current streak for a habit
 */
async function calculateCurrentStreak(habitId: number): Promise<number> {
  const logs = await db
    .select()
    .from(habitLogs)
    .where(and(
      eq(habitLogs.habitId, habitId),
      eq(habitLogs.completed, true)
    ))
    .orderBy(desc(habitLogs.date))
    .limit(100);

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  let expectedDate = today;

  for (const log of logs) {
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((expectedDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0 || daysDiff === 1) {
      streak++;
      expectedDate = logDate;
    } else {
      break;
    }
  }

  // Check if streak is still active
  const firstLogDate = new Date(logs[0].date);
  const daysSinceFirst = Math.floor((today.getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceFirst > 1) {
    return 0;
  }

  return streak;
}

/**
 * Map database entry to Habit type
 */
function mapToHabit(entry: typeof habits.$inferSelect): Habit {
  return {
    id: entry.id,
    userId: entry.userId,
    name: entry.name,
    description: entry.description,
    category: entry.category || 'other',
    frequency: entry.frequency || 'daily',
    targetDays: (entry.targetDays as number[]) || [0, 1, 2, 3, 4, 5, 6],
    reminderTime: entry.reminderTime,
    icon: entry.icon,
    color: entry.color,
    currentStreak: entry.currentStreak || 0,
    longestStreak: entry.longestStreak || 0,
    totalCompletions: entry.totalCompletions || 0,
    isActive: !entry.isArchived, // Invert isArchived to isActive
    createdAt: entry.createdAt!,
  };
}

/**
 * Map database entry to HabitLog type
 */
function mapToHabitLog(entry: typeof habitLogs.$inferSelect): HabitLog {
  return {
    id: entry.id,
    habitId: entry.habitId,
    date: entry.date,
    completed: entry.completed ?? false,
    notes: entry.notes,
    createdAt: entry.createdAt!,
  };
}

// Preset habits for quick setup
export const PRESET_HABITS = [
  { name: 'Morning meditation', category: 'mindfulness', icon: 'meditation', color: '#8b5cf6' },
  { name: 'Drink 8 glasses of water', category: 'health', icon: 'water', color: '#3b82f6' },
  { name: '30 min exercise', category: 'fitness', icon: 'exercise', color: '#ef4444' },
  { name: 'Read for 20 minutes', category: 'other', icon: 'book', color: '#22c55e' },
  { name: 'Healthy breakfast', category: 'nutrition', icon: 'food', color: '#f59e0b' },
  { name: '7+ hours sleep', category: 'sleep', icon: 'sleep', color: '#6366f1' },
  { name: 'Gratitude journaling', category: 'mindfulness', icon: 'journal', color: '#ec4899' },
  { name: 'Take vitamins', category: 'health', icon: 'pill', color: '#14b8a6' },
];
