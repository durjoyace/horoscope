import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Moon, Sun, Award, Trophy, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

export interface AchievementBadgeProps {
  type: 'streak' | 'zodiac' | 'wellness' | 'element' | 'cosmic';
  level: 1 | 2 | 3;
  name: string;
  description: string;
  isNew?: boolean;
  earnedDate?: string;
  onClick?: () => void;
}

// Badge colors based on type and level
const getBadgeColors = (type: AchievementBadgeProps['type'], level: number) => {
  const baseColors = {
    streak: ['from-amber-500 to-orange-500', 'from-amber-600 to-orange-600', 'from-amber-700 to-orange-700'],
    zodiac: ['from-indigo-500 to-purple-500', 'from-indigo-600 to-purple-600', 'from-indigo-700 to-purple-700'],
    wellness: ['from-emerald-500 to-teal-500', 'from-emerald-600 to-teal-600', 'from-emerald-700 to-teal-700'],
    element: ['from-sky-500 to-blue-500', 'from-sky-600 to-blue-600', 'from-sky-700 to-blue-700'],
    cosmic: ['from-fuchsia-500 to-pink-500', 'from-fuchsia-600 to-pink-600', 'from-fuchsia-700 to-pink-700'],
  };
  
  return baseColors[type][level - 1];
};

// Badge icons based on type
const getBadgeIcon = (type: AchievementBadgeProps['type'], level: number) => {
  const icons = {
    streak: <Moon className="h-4 w-4 md:h-5 md:w-5" />,
    zodiac: <Star className="h-4 w-4 md:h-5 md:w-5" />,
    wellness: <Sun className="h-4 w-4 md:h-5 md:w-5" />,
    element: <Sparkles className="h-4 w-4 md:h-5 md:w-5" />,
    cosmic: level >= 3 ? <Trophy className="h-4 w-4 md:h-5 md:w-5" /> : <Award className="h-4 w-4 md:h-5 md:w-5" />,
  };
  
  return icons[type];
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  level,
  name,
  description,
  isNew = false,
  earnedDate,
  onClick,
}) => {
  const { t } = useLanguage();
  const [showSparkles, setShowSparkles] = useState(isNew);
  
  // If the badge is new, show sparkles for 5 seconds
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setShowSparkles(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Sparkle animation positions - these will be randomized
  const generateSparkles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 - 40, // Random position around the badge
      y: Math.random() * 80 - 40,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }));
  };

  const [sparkles] = useState(generateSparkles(10));
  
  return (
    <div className="relative inline-flex">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          p-0.5 md:p-1 rounded-full cursor-pointer
          bg-gradient-to-br ${getBadgeColors(type, level)}
          shadow-md hover:shadow-lg transition-all duration-300
          ${isNew ? 'ring-2 ring-white ring-opacity-50 animate-pulse' : ''}
        `}
        onClick={onClick}
      >
        <Badge
          className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center border-none p-0
                     bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
          variant="outline"
        >
          <div className="flex flex-col items-center justify-center">
            {getBadgeIcon(type, level)}
            <span className="text-[8px] md:text-[10px] mt-1 text-center font-medium">
              {name}
            </span>
          </div>
        </Badge>
      </motion.div>
      
      {/* New badge indicator */}
      {isNew && (
        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white text-[8px] px-1 py-0.5 animate-bounce">
          {t('badge.new')}
        </div>
      )}
      
      {/* Sparkles animation around the badge */}
      <AnimatePresence>
        {showSparkles && sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, sparkle.scale, 0],
              x: sparkle.x,
              y: sparkle.y,
              rotate: sparkle.rotation
            }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              delay: sparkle.delay
            }}
            className="absolute left-1/2 top-1/2 pointer-events-none"
          >
            <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L15.1 8.9H24L16.5 14.4L19.6 23.3L12 17.8L4.4 23.3L7.5 14.4L0 8.9H8.9L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const AchievementTooltip: React.FC<{ badge: AchievementBadgeProps }> = ({ badge }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-3 max-w-xs">
      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full mr-2 bg-gradient-to-br ${getBadgeColors(badge.type, badge.level)}`} />
        <h4 className="font-bold text-sm">{badge.name}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
      {badge.earnedDate && (
        <p className="text-xs text-muted-foreground italic">
          {t('badge.earned')}: {badge.earnedDate}
        </p>
      )}
    </div>
  );
};