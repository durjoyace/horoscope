/**
 * Level Badge Component
 * Displays user's level with tier-colored styling
 */

import { motion } from 'framer-motion';
import { LevelTier } from './types';

interface LevelBadgeProps {
  level: number;
  tier: LevelTier;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTierName?: boolean;
  animated?: boolean;
  className?: string;
}

export function LevelBadge({
  level,
  tier,
  size = 'md',
  showTierName = false,
  animated = true,
  className = '',
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };

  const ringSize = {
    sm: 'ring-2',
    md: 'ring-2',
    lg: 'ring-4',
    xl: 'ring-4',
  };

  const BadgeContent = (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        font-bold text-white
        ${ringSize[size]} ring-white/30
        shadow-lg
        ${className}
      `}
      style={{
        backgroundColor: tier.color,
        boxShadow: `0 0 20px ${tier.color}60`,
      }}
    >
      {level}
    </div>
  );

  const badge = animated ? (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {BadgeContent}
    </motion.div>
  ) : (
    BadgeContent
  );

  if (showTierName) {
    return (
      <div className="flex flex-col items-center gap-1">
        {badge}
        <span
          className="text-xs font-medium"
          style={{ color: tier.color }}
        >
          {tier.name}
        </span>
      </div>
    );
  }

  return badge;
}

/**
 * Level Up Celebration Component
 */
interface LevelUpCelebrationProps {
  newLevel: number;
  tier: LevelTier;
  onClose: () => void;
}

export function LevelUpCelebration({ newLevel, tier, onClose }: LevelUpCelebrationProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration burst */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle, ${tier.color}40 0%, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* Stars animation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.sin((i / 5) * Math.PI * 2) * 100,
              y: Math.cos((i / 5) * Math.PI * 2) * 100 - 50,
            }}
            transition={{ duration: 1, delay: i * 0.1 }}
          >
            ⭐
          </motion.div>
        ))}

        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          🎉
        </motion.div>

        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Level Up!
        </motion.h2>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <LevelBadge level={newLevel} tier={tier} size="xl" animated={false} />
        </motion.div>

        <motion.p
          className="mt-4 text-gray-600 dark:text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          You've reached{' '}
          <span className="font-bold" style={{ color: tier.color }}>
            {tier.name}
          </span>{' '}
          status!
        </motion.p>

        <motion.button
          className="mt-6 px-6 py-2 rounded-full text-white font-medium"
          style={{ backgroundColor: tier.color }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Streak Badge Component
 */
interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  if (streak === 0) return null;

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1
        bg-gradient-to-r from-orange-500 to-red-500
        text-white rounded-full font-medium
        ${sizeClasses[size]}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.span
        className={iconSize[size]}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        🔥
      </motion.span>
      {streak} day{streak !== 1 ? 's' : ''}
    </motion.div>
  );
}
