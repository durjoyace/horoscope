/**
 * Achievement Celebration Modal
 * Full-screen celebration with confetti when user earns achievements
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, X, ChevronRight } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

// Confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
}

const rarityConfig = {
  common: {
    gradient: 'from-slate-400 to-gray-500',
    glow: 'rgba(148, 163, 184, 0.5)',
    label: 'Common',
    bgGlow: 'bg-slate-400/20',
  },
  rare: {
    gradient: 'from-blue-400 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.5)',
    label: 'Rare',
    bgGlow: 'bg-blue-400/20',
  },
  epic: {
    gradient: 'from-purple-400 to-pink-500',
    glow: 'rgba(168, 85, 247, 0.5)',
    label: 'Epic',
    bgGlow: 'bg-purple-400/20',
  },
  legendary: {
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.6)',
    label: 'Legendary',
    bgGlow: 'bg-amber-400/30',
  },
};

const confettiColors = [
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function AchievementCelebration({ achievement, isOpen, onClose }: AchievementCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stage, setStage] = useState(0); // 0: intro, 1: reveal, 2: details

  // Generate confetti particles
  const createConfetti = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: Math.random() * 8 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      });
    }
    setParticles(newParticles);
  }, []);

  // Animation sequence
  useEffect(() => {
    if (isOpen) {
      setStage(0);
      const timer1 = setTimeout(() => setStage(1), 500);
      const timer2 = setTimeout(() => {
        setStage(2);
        createConfetti();
      }, 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, createConfetti]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            y: p.y + p.velocity.y,
            x: p.x + p.velocity.x,
            rotation: p.rotation + 5,
            velocity: {
              ...p.velocity,
              y: p.velocity.y + 0.1, // gravity
            },
          }))
          .filter(p => p.y < 120)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  if (!achievement) return null;

  const config = rarityConfig[achievement.rarity];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  transform: `rotate(${particle.rotation}deg)`,
                }}
              />
            ))}
          </div>

          {/* Radial glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={stage >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 max-w-md w-full mx-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>

            {/* Stage 0: Intro sparkle */}
            <AnimatePresence mode="wait">
              {stage === 0 && (
                <motion.div
                  key="intro"
                  className="flex items-center justify-center h-64"
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-16 h-16 text-purple-400" />
                  </motion.div>
                </motion.div>
              )}

              {/* Stage 1+: Achievement reveal */}
              {stage >= 1 && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  {/* Achievement unlocked text */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <span className="text-purple-400 uppercase tracking-widest text-sm font-medium">
                      Achievement Unlocked
                    </span>
                  </motion.div>

                  {/* Badge container */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                    className="relative inline-block mb-6"
                  >
                    {/* Rotating glow ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full ${config.bgGlow}`}
                      style={{ margin: '-20px' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className={`w-full h-full rounded-full bg-gradient-to-r ${config.gradient} opacity-30 blur-xl`} />
                    </motion.div>

                    {/* Badge */}
                    <div className={`
                      relative w-32 h-32 rounded-full
                      bg-gradient-to-br ${config.gradient}
                      flex items-center justify-center
                      shadow-2xl
                    `}>
                      {/* Inner circle */}
                      <div className="w-28 h-28 rounded-full bg-slate-900/80 flex items-center justify-center">
                        <span className="text-5xl">{achievement.icon}</span>
                      </div>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, transparent 100%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>

                    {/* Rarity label */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className={`
                        absolute -bottom-2 left-1/2 -translate-x-1/2
                        px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        bg-gradient-to-r ${config.gradient} text-white
                        shadow-lg
                      `}
                    >
                      {config.label}
                    </motion.div>
                  </motion.div>

                  {/* Achievement name */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {achievement.name}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/70 mb-6"
                  >
                    {achievement.description}
                  </motion.p>

                  {/* XP Reward */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30"
                  >
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">+{achievement.xpReward} XP</span>
                  </motion.div>

                  {/* Continue button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={onClose}
                    className={`
                      mt-8 w-full py-4 rounded-xl font-semibold text-white
                      bg-gradient-to-r ${config.gradient}
                      hover:opacity-90 transition-opacity
                      flex items-center justify-center gap-2
                      shadow-lg
                    `}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Floating stars */}
          {stage >= 2 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -30, -60],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manage celebration state
export function useAchievementCelebration() {
  const [isOpen, setIsOpen] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  const celebrate = (ach: Achievement) => {
    setAchievement(ach);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setAchievement(null), 300);
  };

  return { isOpen, achievement, celebrate, close };
}

export default AchievementCelebration;
