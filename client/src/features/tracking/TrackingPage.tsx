/**
 * Tracking Page
 * Main dashboard for mood and habit tracking
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyCheckIn } from './DailyCheckIn';
import { HabitTracker, StreakCounter } from './HabitTracker';
import { LunarPhaseWidget } from './LunarPhaseWidget';
import { CalendarHeatmap } from './CalendarHeatmap';
import { DashboardData, MoodEntry, getMoodConfig } from './types';
import {
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

export function TrackingPage() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);

  // Fetch dashboard data
  const { data: dashboard, isLoading } = useQuery<DashboardData>({
    queryKey: ['tracking-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/v2/tracking/dashboard', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      const data = await res.json();
      return data.data;
    },
  });

  // Fetch mood history for heatmap
  const { data: moodHistory } = useQuery<MoodEntry[]>({
    queryKey: ['mood-entries'],
    queryFn: async () => {
      const res = await fetch('/api/v2/tracking/mood?limit=90', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch mood history');
      const data = await res.json();
      return data.data;
    },
  });

  const heatmapData =
    moodHistory?.map((entry) => ({
      date: entry.date,
      value: entry.moodScore,
    })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading your wellness data...</div>
      </div>
    );
  }

  const moodConfig = dashboard?.mood.entry ? getMoodConfig(dashboard.mood.entry.moodScore) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Wellness Tracking</h1>
              <p className="text-white/60">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Quick stats */}
            {dashboard && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-white/50">Mood Streak</p>
                  <p className="text-lg font-bold text-orange-400">{dashboard.mood.streak} days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
              </div>
            )}
          </div>

          {/* Lunar phase bar */}
          {dashboard?.lunar && <LunarPhaseWidget lunar={dashboard.lunar} compact />}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pb-8 space-y-6">
        {/* Today's Mood Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5
                     border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              Today's Check-In
            </h2>
            {dashboard?.mood.hasEntry && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                Complete
              </span>
            )}
          </div>

          {dashboard?.mood.hasEntry && dashboard.mood.entry ? (
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${moodConfig?.color}30` }}
              >
                {moodConfig?.emoji}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{moodConfig?.label}</p>
                {dashboard.mood.entry.emotions.length > 0 && (
                  <p className="text-sm text-white/60">
                    Feeling: {dashboard.mood.entry.emotions.slice(0, 3).join(', ')}
                  </p>
                )}
                <p className="text-xs text-white/40 mt-1">
                  Logged at{' '}
                  {new Date(dashboard.mood.entry.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowCheckIn(true)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/70
                         hover:bg-white/20 hover:text-white transition-colors text-sm"
              >
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCheckIn(true)}
              className="w-full p-4 rounded-xl bg-purple-600/20 border border-purple-500/30
                       hover:bg-purple-600/30 transition-colors group"
            >
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Log Today's Mood</span>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </motion.div>

        {/* Habits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Daily Habits
            </h2>
            {dashboard?.habits && dashboard.habits.total > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dashboard.habits.progress}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>
                <span className="text-sm text-white/60">
                  {dashboard.habits.completed}/{dashboard.habits.total}
                </span>
              </div>
            )}
          </div>

          <HabitTracker
            habits={dashboard?.habits.items || []}
            onAddHabit={() => setShowHabitForm(true)}
          />
        </motion.div>

        {/* Lunar Insights */}
        {dashboard?.lunar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LunarPhaseWidget lunar={dashboard.lunar} />
          </motion.div>
        )}

        {/* Mood History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Mood History
            </h2>
            <span className="text-xs text-white/50">Last 12 weeks</span>
          </div>

          <CalendarHeatmap data={heatmapData} type="mood" weeks={12} />

          {dashboard?.mood.weeklyAverage && (
            <div className="mt-4 p-3 rounded-lg bg-white/5 flex items-center justify-between">
              <span className="text-sm text-white/60">Weekly Average</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getMoodConfig(Math.round(dashboard.mood.weeklyAverage)).emoji}</span>
                <span className="font-medium">{dashboard.mood.weeklyAverage.toFixed(1)}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {dashboard?.mood.streak && dashboard.mood.streak > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <StreakCounter
                current={dashboard.mood.streak}
                longest={dashboard.mood.streak} // TODO: Track longest streak
                label="Day Streak"
              />
            </motion.div>
          )}

          {dashboard?.habits && dashboard.habits.total > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{dashboard.habits.progress}%</span>
                  </div>
                  <p className="text-sm text-white/60">Today's Progress</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Daily Check-In Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <DailyCheckIn
            onClose={() => setShowCheckIn(false)}
            existingEntry={dashboard?.mood.entry}
          />
        )}
      </AnimatePresence>

      {/* Habit Form Modal */}
      <AnimatePresence>
        {showHabitForm && (
          <HabitFormModal onClose={() => setShowHabitForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple habit creation modal
function HabitFormModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('health');

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/v2/tracking/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, category }),
      });

      if (res.ok) {
        onClose();
        // Refresh will happen via query invalidation
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const categories = [
    { value: 'health', label: 'Health', icon: '❤️' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'other', label: 'Other', icon: '✨' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Create New Habit</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10
                       text-white placeholder:text-white/30
                       focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    category === cat.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[10px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white
                     hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            Create Habit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
