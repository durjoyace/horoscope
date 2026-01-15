/**
 * Cosmic Loader Components
 * Beautiful animated loaders with cosmic themes
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicLoaderProps {
  duration?: number;
  onComplete?: () => void;
  message?: string;
}

const constellations = [
  {
    name: "Aries",
    symbol: "♈",
    stars: [
      { x: 30, y: 40, delay: 0 },
      { x: 45, y: 35, delay: 200 },
      { x: 60, y: 45, delay: 400 },
      { x: 70, y: 30, delay: 600 }
    ]
  },
  {
    name: "Leo",
    symbol: "♌",
    stars: [
      { x: 25, y: 50, delay: 0 },
      { x: 40, y: 30, delay: 150 },
      { x: 50, y: 45, delay: 300 },
      { x: 65, y: 25, delay: 450 },
      { x: 75, y: 50, delay: 600 }
    ]
  },
  {
    name: "Scorpio",
    symbol: "♏",
    stars: [
      { x: 20, y: 35, delay: 0 },
      { x: 35, y: 50, delay: 100 },
      { x: 50, y: 40, delay: 200 },
      { x: 65, y: 55, delay: 300 },
      { x: 80, y: 30, delay: 400 }
    ]
  }
];

export const CosmicLoader: React.FC<CosmicLoaderProps> = ({
  duration = 3000,
  onComplete,
  message = "Aligning your cosmic energy..."
}) => {
  const [currentConstellation, setCurrentConstellation] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentConstellation((prev) =>
        prev === constellations.length - 1 ? 0 : prev + 1
      );
    }, 1000);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  const currentConst = constellations[currentConstellation];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(80)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Nebula effects */}
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Constellation symbol with glow */}
            <motion.div
              className="text-7xl mb-6"
              style={{
                textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)',
              }}
              animate={{
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)',
                  '0 0 60px rgba(139, 92, 246, 1), 0 0 100px rgba(139, 92, 246, 0.6)',
                  '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-gradient-to-br from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                {currentConst.symbol}
              </span>
            </motion.div>

            {/* Constellation name */}
            <motion.h2
              key={currentConst.name}
              className="text-3xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentConst.name}
            </motion.h2>

            {/* Orbital loader */}
            <OrbitalLoader />

            {/* Message */}
            <motion.p
              className="text-purple-300 text-lg mt-8"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {message}
            </motion.p>

            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-slate-800/50 rounded-full mt-6 overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
                  backgroundSize: '200% 100%',
                }}
                initial={{ width: '0%' }}
                animate={{
                  width: '100%',
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  width: { duration: duration / 1000, ease: 'linear' },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Orbital Loader - planets orbiting a sun
export function OrbitalLoader({ size = 120 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)',
        }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(251, 191, 36, 0.8)',
            '0 0 50px rgba(251, 191, 36, 1)',
            '0 0 30px rgba(251, 191, 36, 0.8)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Orbit 1 with planet */}
      <motion.div
        className="absolute border border-purple-500/30 rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
          }}
        />
      </motion.div>

      {/* Orbit 2 with planet */}
      <motion.div
        className="absolute border border-pink-500/20 rounded-full"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)',
          }}
        />
      </motion.div>
    </div>
  );
}

// Simple inline loader for buttons
export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Skeleton with cosmic shimmer
export function CosmicSkeleton({
  className = '',
  variant = 'text'
}: {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}) {
  const baseClass = variant === 'circular'
    ? 'rounded-full'
    : variant === 'rectangular'
    ? 'rounded-xl'
    : 'rounded-md';

  return (
    <div className={`relative overflow-hidden bg-purple-900/20 ${baseClass} ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Pulse loader
export function PulseLoader({ color = 'purple' }: { color?: 'purple' | 'pink' | 'amber' }) {
  const colors = {
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`w-3 h-3 rounded-full ${colors[color]}`}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

export default CosmicLoader;
