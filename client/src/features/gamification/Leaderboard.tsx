/**
 * Leaderboard Component
 * Displays rankings across different categories
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import {
  LeaderboardData,
  LeaderboardEntry,
  LeaderboardType,
  LEADERBOARD_TABS,
  LEVEL_TIERS,
} from './types';

interface LeaderboardProps {
  initialType?: LeaderboardType;
  userZodiacSign?: string;
}

export function Leaderboard({ initialType = 'global', userZodiacSign }: LeaderboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardType>(initialType);

  // Fetch leaderboard data based on active tab
  const { data, isLoading, error } = useQuery<LeaderboardData>({
    queryKey: ['leaderboard', activeTab, userZodiacSign],
    queryFn: async () => {
      let endpoint = '/api/v2/gamification/leaderboard';

      switch (activeTab) {
        case 'weekly':
          endpoint = '/api/v2/gamification/leaderboard/weekly';
          break;
        case 'zodiac':
          endpoint = `/api/v2/gamification/leaderboard/zodiac/${userZodiacSign || 'aries'}`;
          break;
        case 'friends':
          endpoint = '/api/v2/gamification/leaderboard/friends';
          break;
        case 'streaks':
          endpoint = '/api/v2/gamification/leaderboard/streaks';
          break;
        default:
          endpoint = '/api/v2/gamification/leaderboard';
      }

      const response = await fetch(endpoint, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {LEADERBOARD_TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === tab.type
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User's rank card */}
      {data?.userRank && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Your Rank</p>
              <p className="text-3xl font-bold">#{data.userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Total Players</p>
              <p className="text-xl font-semibold">{data.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-gray-500">Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Failed to load leaderboard
          </div>
        ) : !data?.entries.length ? (
          <div className="p-8 text-center text-gray-500">
            No data available
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Top 3 podium */}
            {data.entries.slice(0, 3).length > 0 && (
              <div className="p-4 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/20">
                <div className="flex justify-center items-end gap-4 py-4">
                  {/* 2nd place */}
                  {data.entries[1] && (
                    <PodiumEntry entry={data.entries[1]} position={2} isCurrentUser={data.entries[1].userId === user?.id} />
                  )}
                  {/* 1st place */}
                  {data.entries[0] && (
                    <PodiumEntry entry={data.entries[0]} position={1} isCurrentUser={data.entries[0].userId === user?.id} />
                  )}
                  {/* 3rd place */}
                  {data.entries[2] && (
                    <PodiumEntry entry={data.entries[2]} position={3} isCurrentUser={data.entries[2].userId === user?.id} />
                  )}
                </div>
              </div>
            )}

            {/* Rest of the list */}
            <AnimatePresence>
              {data.entries.slice(3).map((entry, index) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  isCurrentUser={entry.userId === user?.id}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Podium Entry Component (Top 3)
 */
interface PodiumEntryProps {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
  isCurrentUser: boolean;
}

function PodiumEntry({ entry, position, isCurrentUser }: PodiumEntryProps) {
  const tier = LEVEL_TIERS.find((t) => entry.level >= t.min && entry.level <= t.max) || LEVEL_TIERS[0];

  const medals = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  const heights = {
    1: 'h-24',
    2: 'h-20',
    3: 'h-16',
  };

  return (
    <motion.div
      className={`flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: position * 0.1 }}
    >
      {/* Avatar */}
      <div className={`relative ${isCurrentUser ? 'ring-2 ring-purple-500 rounded-full' : ''}`}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: tier.color }}
        >
          {entry.firstName?.[0] || entry.email[0].toUpperCase()}
        </div>
        <span className="absolute -bottom-1 -right-1 text-xl">{medals[position]}</span>
      </div>

      {/* Name */}
      <p className={`mt-2 text-sm font-medium ${isCurrentUser ? 'text-purple-600' : 'text-gray-900 dark:text-white'}`}>
        {entry.firstName || entry.email.split('@')[0]}
      </p>

      {/* XP */}
      <p className="text-xs text-gray-500">{entry.totalXp.toLocaleString()} XP</p>

      {/* Podium */}
      <div
        className={`mt-2 w-16 ${heights[position]} bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg flex items-end justify-center pb-1`}
      >
        <span className="text-white font-bold">{position}</span>
      </div>
    </motion.div>
  );
}

/**
 * Leaderboard Row Component
 */
interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  index: number;
}

function LeaderboardRow({ entry, isCurrentUser, index }: LeaderboardRowProps) {
  const tier = LEVEL_TIERS.find((t) => entry.level >= t.min && entry.level <= t.max) || LEVEL_TIERS[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`
        flex items-center gap-4 p-4 transition-colors
        ${isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
      `}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        <span className={`font-bold ${isCurrentUser ? 'text-purple-600' : 'text-gray-500'}`}>
          {entry.rank}
        </span>
      </div>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
        style={{ backgroundColor: tier.color }}
      >
        {entry.firstName?.[0] || entry.email[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${isCurrentUser ? 'text-purple-600' : 'text-gray-900 dark:text-white'}`}>
          {entry.firstName || entry.email.split('@')[0]}
          {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Level {entry.level}</span>
          {entry.zodiacSign && (
            <>
              <span>·</span>
              <span className="capitalize">{entry.zodiacSign}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="font-semibold text-gray-900 dark:text-white">
          {entry.totalXp.toLocaleString()} XP
        </p>
        {entry.dailyStreak > 0 && (
          <p className="text-xs text-orange-500">
            🔥 {entry.dailyStreak} day streak
          </p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Mini Leaderboard Widget
 */
interface MiniLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
  title?: string;
}

export function MiniLeaderboard({ entries, currentUserId, title = 'Top Players' }: MiniLeaderboardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {entries.slice(0, 5).map((entry) => {
          const tier = LEVEL_TIERS.find((t) => entry.level >= t.min && entry.level <= t.max) || LEVEL_TIERS[0];
          const isCurrentUser = entry.userId === currentUserId;

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-2 rounded-lg ${isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
            >
              <span className="w-6 text-center font-bold text-gray-500">{entry.rank}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: tier.color }}
              >
                {entry.firstName?.[0] || entry.email[0].toUpperCase()}
              </div>
              <span className={`flex-1 text-sm truncate ${isCurrentUser ? 'text-purple-600 font-medium' : ''}`}>
                {entry.firstName || entry.email.split('@')[0]}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {entry.totalXp.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
