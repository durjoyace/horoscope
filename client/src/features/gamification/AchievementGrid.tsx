/**
 * Achievement Grid Component
 * Displays achievements with progress and unlock status
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAchievementData, ACHIEVEMENT_ICONS, ACHIEVEMENT_CATEGORIES } from './types';

interface AchievementGridProps {
  achievements: UserAchievementData[];
  grouped?: Record<string, UserAchievementData[]>;
  onAchievementClick?: (achievement: UserAchievementData) => void;
}

export function AchievementGrid({
  achievements,
  grouped,
  onAchievementClick,
}: AchievementGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayAchievements = selectedCategory && grouped
    ? grouped[selectedCategory] || []
    : achievements;

  // Calculate stats
  const totalUnlocked = achievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      {/* Stats header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Achievements
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalUnlocked} / {totalAchievements} unlocked
          </p>
        </div>
        <div className="w-24 h-24 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="url(#achievementGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(totalUnlocked / totalAchievements) * 264} 264`}
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${(totalUnlocked / totalAchievements) * 264} 264` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="achievementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((totalUnlocked / totalAchievements) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Category filter */}
      {grouped && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === null
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {ACHIEVEMENT_CATEGORIES.map((category) => (
            <button
              key={category.key}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Achievement grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {displayAchievements.map((ach) => (
            <AchievementCard
              key={ach.achievement.id}
              data={ach}
              onClick={() => onAchievementClick?.(ach)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/**
 * Individual Achievement Card
 */
interface AchievementCardProps {
  data: UserAchievementData;
  onClick?: () => void;
}

function AchievementCard({ data, onClick }: AchievementCardProps) {
  const { achievement, isUnlocked, progress, unlockedAt } = data;
  const icon = ACHIEVEMENT_ICONS[achievement.icon] || '🏆';

  // Hide description for secret achievements that aren't unlocked
  const showDescription = !achievement.isSecret || isUnlocked;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl text-center transition-colors
        ${isUnlocked
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700'
          : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700'
        }
      `}
    >
      {/* Secret badge */}
      {achievement.isSecret && !isUnlocked && (
        <div className="absolute top-2 right-2 text-xs">🔒</div>
      )}

      {/* Icon */}
      <motion.div
        className={`
          text-4xl mb-2 mx-auto
          ${!isUnlocked && 'grayscale opacity-50'}
        `}
        animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {achievement.isSecret && !isUnlocked ? '❓' : icon}
      </motion.div>

      {/* Title */}
      <h4 className={`
        font-semibold text-sm
        ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
      `}>
        {achievement.isSecret && !isUnlocked ? 'Secret Achievement' : achievement.name}
      </h4>

      {/* Description */}
      {showDescription && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {achievement.description}
        </p>
      )}

      {/* Progress bar or unlock date */}
      {isUnlocked ? (
        <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
          +{achievement.xpReward} XP
        </div>
      ) : (
        <div className="mt-2">
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-gray-400 mt-1">
            {progress}%
          </span>
        </div>
      )}
    </motion.button>
  );
}

/**
 * Achievement Unlock Modal
 */
interface AchievementUnlockModalProps {
  achievement: UserAchievementData;
  onClose: () => void;
}

export function AchievementUnlockModal({ achievement, onClose }: AchievementUnlockModalProps) {
  const { achievement: ach, isUnlocked, unlockedAt } = achievement;
  const icon = ACHIEVEMENT_ICONS[ach.icon] || '🏆';

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm w-full"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isUnlocked && (
          <motion.div
            className="text-5xl mb-2"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            🎉
          </motion.div>
        )}

        <motion.div
          className={`text-6xl mb-4 ${!isUnlocked && 'grayscale opacity-50'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          {icon}
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {ach.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {ach.description}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            +{ach.xpReward} XP
          </span>
        </div>

        {isUnlocked && unlockedAt && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Unlocked on {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}

        <button
          className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
          onClick={onClose}
        >
          {isUnlocked ? 'Awesome!' : 'Close'}
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Achievement Toast Notification
 */
interface AchievementToastProps {
  achievement: UserAchievementData;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const icon = ACHIEVEMENT_ICONS[achievement.achievement.icon] || '🏆';

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-2xl z-50 max-w-sm"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="text-4xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <p className="text-sm opacity-80">Achievement Unlocked!</p>
          <p className="font-bold">{achievement.achievement.name}</p>
          <p className="text-sm">+{achievement.achievement.xpReward} XP</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
