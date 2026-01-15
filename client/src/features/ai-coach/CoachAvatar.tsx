/**
 * AI Coach Avatar Component
 * Animated avatar for the wellness coach
 */

import { motion } from 'framer-motion';
import { getElementColor, AVATAR_PULSE } from './types';

interface CoachAvatarProps {
  zodiacSign?: string | null;
  isTyping?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { container: 40, icon: 20 },
  md: { container: 56, icon: 28 },
  lg: { container: 80, icon: 40 },
};

export function CoachAvatar({ zodiacSign, isTyping = false, size = 'md' }: CoachAvatarProps) {
  const colors = getElementColor(zodiacSign);
  const dimensions = SIZES[size];

  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: dimensions.container,
        height: dimensions.container,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        boxShadow: isTyping ? `0 0 20px ${colors.glow}` : 'none',
      }}
      animate={
        isTyping
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 10px ${colors.glow}`,
                `0 0 25px ${colors.glow}`,
                `0 0 10px ${colors.glow}`,
              ],
            }
          : {}
      }
      transition={{
        duration: AVATAR_PULSE / 1000,
        repeat: isTyping ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      {/* Inner glow ring */}
      <div
        className="absolute inset-1 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 30%, white, transparent)`,
        }}
      />

      {/* Cosmic icon */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        {/* Star/cosmic design */}
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>

      {/* Typing indicator dots */}
      {isTyping && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={{
                y: [-2, 2, -2],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
