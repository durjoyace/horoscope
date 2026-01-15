/**
 * Gamification Page
 * Main hub for XP, achievements, and leaderboards
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { XPBar, XPBadge } from './XPBar';
import { LevelBadge, StreakBadge } from './LevelBadge';
import { AchievementGrid, AchievementUnlockModal } from './AchievementGrid';
import { Leaderboard } from './Leaderboard';
import {
  GamificationProfile,
  UserAchievementData,
  XpTransaction,
} from './types';

type TabType = 'overview' | 'achievements' | 'leaderboard' | 'history';

export function GamificationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedAchievement, setSelectedAchievement] = useState<UserAchievementData | null>(null);

  // Fetch gamification profile
  const { data: profile, isLoading: profileLoading } = useQuery<GamificationProfile>({
    queryKey: ['gamification-profile'],
    queryFn: async () => {
      const response = await fetch('/api/v2/gamification/profile', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  // Fetch achievements
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery<{
    achievements: UserAchievementData[];
    grouped: Record<string, UserAchievementData[]>;
    stats: { total: number; unlocked: number; inProgress: number };
  }>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await fetch('/api/v2/gamification/achievements', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return response.json();
    },
    enabled: activeTab === 'overview' || activeTab === 'achievements',
  });

  // Fetch XP history
  const { data: xpHistory, isLoading: historyLoading } = useQuery<XpTransaction[]>({
    queryKey: ['xp-history'],
    queryFn: async () => {
      const response = await fetch('/api/v2/gamification/xp/history', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch XP history');
      return response.json();
    },
    enabled: activeTab === 'history',
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const progress = profile?.progress;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Summary */}
          {progress && (
            <div className="flex items-center gap-6">
              <LevelBadge level={progress.level} tier={progress.tier} size="xl" showTierName />

              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {user?.firstName || 'Cosmic Traveler'}
                </h1>
                <p className="text-white/80 text-sm">
                  {progress.tier.name} · {progress.totalXp.toLocaleString()} total XP
                </p>

                <div className="mt-3">
                  <XPBar progress={progress} size="md" />
                </div>
              </div>

              {/* Streak */}
              {progress.dailyStreak > 0 && (
                <div className="text-center">
                  <StreakBadge streak={progress.dailyStreak} size="lg" />
                  <p className="text-xs text-white/60 mt-1">
                    Best: {progress.longestStreak} days
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{profile?.todayXp || 0}</p>
              <p className="text-sm text-white/70">XP Today</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{achievementsData?.stats.unlocked || 0}</p>
              <p className="text-sm text-white/70">Achievements</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{progress?.dailyStreak || 0}</p>
              <p className="text-sm text-white/70">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {(['overview', 'achievements', 'leaderboard', 'history'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Recent achievements */}
              {profile?.recentAchievements && profile.recentAchievements.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Achievements
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {profile.recentAchievements.map((ach) => (
                      <motion.button
                        key={ach.achievement.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAchievement(ach)}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm"
                      >
                        <span className="text-3xl">{ach.achievement.icon}</span>
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                          {ach.achievement.name}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick actions */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Earn More XP
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <QuickAction
                    icon="📊"
                    title="Track Your Mood"
                    description="+15 XP per entry"
                    href="/tracking"
                  />
                  <QuickAction
                    icon="✅"
                    title="Complete Habits"
                    description="+20 XP each"
                    href="/tracking"
                  />
                  <QuickAction
                    icon="🌟"
                    title="Read Horoscope"
                    description="+5 XP daily"
                    href="/dashboard"
                  />
                  <QuickAction
                    icon="👥"
                    title="Add Friends"
                    description="+25 XP per friend"
                    href="/social"
                  />
                </div>
              </section>

              {/* Progress towards next achievements */}
              {achievementsData && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Almost There
                  </h2>
                  <div className="space-y-3">
                    {achievementsData.achievements
                      .filter((a) => !a.isUnlocked && a.progress >= 50)
                      .slice(0, 3)
                      .map((ach) => (
                        <div
                          key={ach.achievement.id}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4"
                        >
                          <span className="text-2xl grayscale">{ach.achievement.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {ach.achievement.name}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${ach.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">{ach.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {achievementsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : achievementsData ? (
                <AchievementGrid
                  achievements={achievementsData.achievements}
                  grouped={achievementsData.grouped}
                  onAchievementClick={setSelectedAchievement}
                />
              ) : null}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Leaderboard userZodiacSign={user?.zodiacSign} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                XP History
              </h2>
              {historyLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : xpHistory && xpHistory.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                  {xpHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {tx.reason.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-green-600 font-semibold">+{tx.amount} XP</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No XP history yet. Start earning!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementUnlockModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Quick Action Card
 */
interface QuickActionProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

function QuickAction({ icon, title, description, href }: QuickActionProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-sm"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-purple-600">{description}</p>
      </div>
    </motion.a>
  );
}

export default GamificationPage;
