/**
 * XP Progress Bar Component
 * Displays user's XP progress with animated fill
 */

import { motion } from 'framer-motion';
import { UserProgress } from './types';

interface XPBarProps {
  progress: UserProgress;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPBar({
  progress,
  showLevel = true,
  size = 'md',
  className = '',
}: XPBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLevel && (
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <motion.span
              className={`font-bold ${textClasses[size]}`}
              style={{ color: progress.tier.color }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Level {progress.level}
            </motion.span>
            <span
              className={`px-2 py-0.5 rounded-full text-white text-xs font-medium`}
              style={{ backgroundColor: progress.tier.color }}
            >
              {progress.tier.name}
            </span>
          </div>
          <span className={`text-gray-500 dark:text-gray-400 ${textClasses[size]}`}>
            {progress.currentLevelXp.toLocaleString()} / {progress.nextLevelXp.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        {/* Animated progress fill */}
        <motion.div
          className={`${heightClasses[size]} rounded-full relative`}
          style={{
            backgroundColor: progress.tier.color,
            backgroundImage: `linear-gradient(90deg, ${progress.tier.color}, ${progress.tier.color}dd)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress.progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />
        </motion.div>
      </div>

      {/* XP to next level */}
      {showLevel && progress.progressPercent < 100 && (
        <div className={`text-right mt-1 text-gray-400 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
          {(progress.nextLevelXp - progress.currentLevelXp).toLocaleString()} XP to level{' '}
          {progress.level + 1}
        </div>
      )}
    </div>
  );
}

/**
 * Compact XP display for header/nav
 */
interface XPBadgeProps {
  progress: UserProgress;
  onClick?: () => void;
}

export function XPBadge({ progress, onClick }: XPBadgeProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Level badge */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: progress.tier.color }}
      >
        {progress.level}
      </div>

      {/* Mini progress bar */}
      <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: progress.tier.color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress.progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* XP count */}
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {progress.totalXp.toLocaleString()} XP
      </span>
    </motion.button>
  );
}

/**
 * XP Gain Animation Popup
 */
interface XPGainProps {
  amount: number;
  reason: string;
  onComplete?: () => void;
}

export function XPGainPopup({ amount, reason, onComplete }: XPGainProps) {
  return (
    <motion.div
      className="fixed top-20 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg shadow-lg z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <motion.span
          className="text-2xl font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          +{amount}
        </motion.span>
        <div>
          <div className="text-sm font-medium">XP Earned!</div>
          <div className="text-xs opacity-80">{reason}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
