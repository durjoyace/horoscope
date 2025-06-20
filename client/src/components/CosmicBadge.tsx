import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Crown, Heart, Zap, Moon, Sun } from 'lucide-react';

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface CosmicBadgeProps {
  type: 'wellness' | 'element' | 'cosmic' | 'streak' | 'premium' | 'achievement';
  title: string;
  description: string;
  level?: number;
  unlocked?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeIcons = {
  wellness: Heart,
  element: Zap,
  cosmic: Moon,
  streak: Star,
  premium: Crown,
  achievement: Sparkles
};

const badgeColors = {
  wellness: 'from-green-400 to-emerald-600',
  element: 'from-purple-400 to-violet-600',
  cosmic: 'from-blue-400 to-indigo-600',
  streak: 'from-yellow-400 to-orange-600',
  premium: 'from-amber-400 to-yellow-600',
  achievement: 'from-pink-400 to-rose-600'
};

const generateSparkles = (count: number): Sparkle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sparkle-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1
  }));
};

export const CosmicBadge: React.FC<CosmicBadgeProps> = ({
  type,
  title,
  description,
  level = 1,
  unlocked = true,
  animated = true,
  size = 'md',
  className = ''
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = badgeIcons[type];
  const colorGradient = badgeColors[type];
  
  useEffect(() => {
    if (animated && unlocked) {
      setSparkles(generateSparkles(6));
      
      const interval = setInterval(() => {
        setSparkles(generateSparkles(6));
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [animated, unlocked]);

  const badgeSize = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <motion.div
      className={`relative group cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Badge */}
      <motion.div
        className={`
          ${badgeSize[size]} 
          relative rounded-full flex items-center justify-center
          ${unlocked 
            ? `bg-gradient-to-br ${colorGradient} shadow-lg border-2 border-white/30` 
            : 'bg-gray-300 border-2 border-gray-400'
          }
          transition-all duration-300
        `}
        animate={unlocked && animated ? {
          boxShadow: [
            '0 0 20px rgba(147, 51, 234, 0.3)',
            '0 0 30px rgba(147, 51, 234, 0.5)',
            '0 0 20px rgba(147, 51, 234, 0.3)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Cosmic Background Pattern */}
        {unlocked && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-conic from-white/10 via-transparent to-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
        
        {/* Badge Icon */}
        <Icon 
          className={`
            ${iconSize[size]} 
            ${unlocked ? 'text-white' : 'text-gray-500'}
            relative z-10
          `}
        />
        
        {/* Level Indicator */}
        {level > 1 && unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-purple-600 border-2 border-purple-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {level}
          </motion.div>
        )}
      </motion.div>

      {/* Sparkle Animations */}
      <AnimatePresence>
        {unlocked && animated && sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Star className="w-full h-full text-yellow-300 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pulse Ring Animation */}
      {unlocked && isHovered && (
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorGradient} opacity-30`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl max-w-xs text-center">
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-xs text-gray-300 mt-1">{description}</div>
              
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Preset Badge Components
export const WellnessBadge: React.FC<Omit<CosmicBadgeProps, 'type'>> = (props) => (
  <CosmicBadge type="wellness" {...props} />
);

export const ElementBadge: React.FC<Omit<CosmicBadgeProps, 'type'>> = (props) => (
  <CosmicBadge type="element" {...props} />
);

export const CosmicAchievementBadge: React.FC<Omit<CosmicBadgeProps, 'type'>> = (props) => (
  <CosmicBadge type="cosmic" {...props} />
);

export const StreakBadge: React.FC<Omit<CosmicBadgeProps, 'type'>> = (props) => (
  <CosmicBadge type="streak" {...props} />
);

export const PremiumBadge: React.FC<Omit<CosmicBadgeProps, 'type'>> = (props) => (
  <CosmicBadge type="premium" {...props} />
);