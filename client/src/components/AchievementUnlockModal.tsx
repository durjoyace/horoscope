import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CosmicBadge } from './CosmicBadge';
import { Star, Sparkles, Trophy, X } from 'lucide-react';

interface Achievement {
  id: string;
  type: 'wellness' | 'element' | 'cosmic' | 'streak' | 'premium' | 'achievement';
  title: string;
  description: string;
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: string;
}

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

interface FloatingSparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const rarityColors = {
  common: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-700', accent: 'text-gray-500' },
  rare: { bg: 'from-blue-400 to-blue-600', text: 'text-blue-700', accent: 'text-blue-500' },
  epic: { bg: 'from-purple-400 to-purple-600', text: 'text-purple-700', accent: 'text-purple-500' },
  legendary: { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-700', accent: 'text-yellow-500' }
};

const rarityNames = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
};

const generateFloatingSparkles = (count: number): FloatingSparkle[] => {
  const colors = ['#FFD700', '#FF69B4', '#9370DB', '#00CED1', '#FF6347'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `floating-sparkle-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
};

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onShare
}) => {
  const [sparkles, setSparkles] = useState<FloatingSparkle[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen && achievement) {
      setSparkles(generateFloatingSparkles(20));
      
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen, achievement]);

  if (!achievement) return null;

  const rarity = rarityColors[achievement.rarity];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-0 text-white overflow-hidden">
        {/* Background Cosmic Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] bg-cover bg-center opacity-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-conic from-purple-500/20 via-transparent to-pink-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Sparkles */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute pointer-events-none z-10"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: sparkle.size,
                height: sparkle.size,
                color: sparkle.color
              }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                y: [20, -20, -40],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="w-full h-full" fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="relative z-20 p-6 text-center space-y-6">
          {/* Header */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="space-y-2"
          >
            <Trophy className="h-12 w-12 mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Achievement Unlocked!
            </h2>
          </motion.div>

          {/* Badge Display */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.5 }}
                className="flex justify-center"
              >
                <CosmicBadge
                  type={achievement.type}
                  title={achievement.title}
                  description={achievement.description}
                  level={achievement.level}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievement Details */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{achievement.title}</h3>
                  <p className="text-white/80">{achievement.description}</p>
                </div>

                {/* Rarity Badge */}
                <div className="flex justify-center">
                  <Badge 
                    className={`bg-gradient-to-r ${rarity.bg} text-white border-0 px-4 py-1`}
                  >
                    {rarityNames[achievement.rarity]} Achievement
                  </Badge>
                </div>

                {/* Level Indicator */}
                {achievement.level > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white/90">Level {achievement.level}</span>
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                )}

                {/* Reward */}
                {achievement.reward && (
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-sm text-white/70 mb-1">Reward Unlocked</div>
                    <div className="text-white font-medium">{achievement.reward}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-3 justify-center"
              >
                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Particle Burst Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-yellow-400/30 via-transparent to-transparent" />
        </motion.div>

        {/* Orbital Rings */}
        <motion.div
          className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ margin: '20%' }}
        />
        <motion.div
          className="absolute inset-0 border border-white/10 rounded-full pointer-events-none"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ margin: '10%' }}
        />
      </DialogContent>
    </Dialog>
  );
};