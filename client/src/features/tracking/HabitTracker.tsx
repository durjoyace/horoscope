/**
 * Habit Tracker Component
 * Displays habits with completion toggles
 */

import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitWithStatus, getCategoryConfig, HABIT_CATEGORIES } from './types';
import { Check, Flame, Plus } from 'lucide-react';

interface HabitTrackerProps {
  habits: HabitWithStatus[];
  onAddHabit: () => void;
}

export function HabitTracker({ habits, onAddHabit }: HabitTrackerProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async ({ habitId, complete }: { habitId: number; complete: boolean }) => {
      const endpoint = complete ? 'complete' : 'uncomplete';
      const res = await fetch(`/api/v2/tracking/habits/${habitId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to update habit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-habits'] });
      queryClient.invalidateQueries({ queryKey: ['tracking-dashboard'] });
    },
  });

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
          <Plus className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/60 mb-4">No habits yet</p>
        <button
          onClick={onAddHabit}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          Create your first habit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          index={index}
          onToggle={(complete) =>
            toggleMutation.mutate({ habitId: habit.id, complete })
          }
          isLoading={toggleMutation.isPending}
        />
      ))}

      <motion.button
        onClick={onAddHabit}
        className="w-full p-3 rounded-xl border border-dashed border-white/20
                   flex items-center justify-center gap-2 text-white/50
                   hover:border-white/40 hover:text-white/70 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5" />
        <span>Add Habit</span>
      </motion.button>
    </div>
  );
}

interface HabitCardProps {
  habit: HabitWithStatus;
  index: number;
  onToggle: (complete: boolean) => void;
  isLoading: boolean;
}

function HabitCard({ habit, index, onToggle, isLoading }: HabitCardProps) {
  const category = getCategoryConfig(habit.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl bg-white/5 border border-white/10
                  flex items-center gap-4 ${habit.completedToday ? 'opacity-80' : ''}`}
    >
      {/* Completion toggle */}
      <motion.button
        onClick={() => onToggle(!habit.completedToday)}
        disabled={isLoading}
        className={`w-10 h-10 rounded-full flex items-center justify-center
                   transition-all ${
                     habit.completedToday
                       ? 'bg-green-500 text-white'
                       : 'bg-white/10 text-white/40 hover:bg-white/20'
                   }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Check className="w-5 h-5" />
      </motion.button>

      {/* Habit info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${habit.completedToday ? 'line-through text-white/50' : 'text-white'}`}>
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${category.color}30`, color: category.color }}
          >
            {category.icon} {category.label}
          </span>
        </div>
      </div>

      {/* Streak */}
      {habit.currentStreak > 0 && (
        <div className="flex items-center gap-1 text-orange-400">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">{habit.currentStreak}</span>
        </div>
      )}
    </motion.div>
  );
}

interface StreakCounterProps {
  current: number;
  longest: number;
  label?: string;
}

export function StreakCounter({ current, longest, label = 'Day Streak' }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
        <Flame className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{current}</span>
          <span className="text-white/60">{label}</span>
        </div>
        {longest > current && (
          <p className="text-sm text-white/50">Best: {longest} days</p>
        )}
      </div>
    </div>
  );
}
