/**
 * FloatingOrb Component
 * Decorative floating orbs with glow effects
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'purple' | 'pink' | 'cyan' | 'amber' | 'gradient';
  blur?: boolean;
  pulse?: boolean;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: number;
  duration?: number;
  className?: string;
}

const sizeStyles = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const colorStyles = {
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-400',
  amber: 'bg-amber-500',
  gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
};

export function FloatingOrb({
  size = 'md',
  color = 'purple',
  blur = true,
  pulse = true,
  position,
  delay = 0,
  duration = 6,
  className,
}: FloatingOrbProps) {
  return (
    <motion.div
      className={cn(
        'absolute rounded-full pointer-events-none',
        sizeStyles[size],
        colorStyles[color],
        blur && 'blur-2xl',
        'opacity-30',
        className
      )}
      style={{
        ...position,
      }}
      animate={{
        y: [0, -20, 0],
        scale: pulse ? [1, 1.1, 1] : 1,
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Orbital decoration - multiple orbs orbiting a center
interface OrbitalProps {
  centerSize?: number;
  orbitRadius?: number;
  orbCount?: number;
  orbSize?: number;
  colors?: string[];
  duration?: number;
  className?: string;
}

export function OrbitalDecoration({
  centerSize = 60,
  orbitRadius = 80,
  orbCount = 3,
  orbSize = 8,
  colors = ['#8B5CF6', '#EC4899', '#22D3EE'],
  duration = 10,
  className,
}: OrbitalProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: orbitRadius * 2 + orbSize, height: orbitRadius * 2 + orbSize }}
    >
      {/* Center orb */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
        style={{
          width: centerSize,
          height: centerSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orbiting orbs */}
      {Array.from({ length: orbCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orbSize,
            height: orbSize,
            backgroundColor: colors[i % colors.length],
            top: '50%',
            left: '50%',
            boxShadow: `0 0 10px ${colors[i % colors.length]}`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: duration + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: orbSize,
              height: orbSize,
              backgroundColor: colors[i % colors.length],
              transform: `translateX(${orbitRadius}px) translateY(-50%)`,
              boxShadow: `0 0 15px ${colors[i % colors.length]}`,
            }}
          />
        </motion.div>
      ))}

      {/* Orbit path indicators */}
      <div
        className="absolute border border-purple-500/20 rounded-full"
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}

// Floating dots pattern
interface FloatingDotsProps {
  count?: number;
  colors?: string[];
  area?: { width: number; height: number };
  className?: string;
}

export function FloatingDots({
  count = 10,
  colors = ['#8B5CF6', '#EC4899', '#22D3EE'],
  area = { width: 200, height: 200 },
  className,
}: FloatingDotsProps) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * area.width,
    y: Math.random() * area.height,
    size: Math.random() * 4 + 2,
    color: colors[i % colors.length],
    duration: Math.random() * 3 + 3,
    delay: Math.random() * 2,
  }));

  return (
    <div
      className={cn('relative pointer-events-none', className)}
      style={{ width: area.width, height: area.height }}
    >
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            left: dot.x,
            top: dot.y,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Glowing ring decoration
interface GlowRingProps {
  size?: number;
  color?: string;
  thickness?: number;
  blur?: number;
  animated?: boolean;
  className?: string;
}

export function GlowRing({
  size = 100,
  color = '#8B5CF6',
  thickness = 2,
  blur = 10,
  animated = true,
  className,
}: GlowRingProps) {
  return (
    <motion.div
      className={cn('rounded-full pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid ${color}`,
        boxShadow: `0 0 ${blur}px ${color}, inset 0 0 ${blur}px ${color}`,
      }}
      animate={
        animated
          ? {
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }
          : undefined
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Constellation pattern
interface ConstellationProps {
  points?: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Constellation({
  points = [
    { x: 10, y: 20 },
    { x: 40, y: 10 },
    { x: 70, y: 30 },
    { x: 90, y: 15 },
    { x: 60, y: 50 },
    { x: 30, y: 60 },
  ],
  width = 100,
  height = 80,
  color = '#8B5CF6',
  className,
}: ConstellationProps) {
  return (
    <svg
      className={cn('pointer-events-none', className)}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width, height }}
    >
      {/* Lines connecting points */}
      {points.map((point, i) => {
        if (i === points.length - 1) return null;
        const next = points[i + 1];
        return (
          <motion.line
            key={`line-${i}`}
            x1={`${point.x}%`}
            y1={`${point.y}%`}
            x2={`${next.x}%`}
            y2={`${next.y}%`}
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.3 }}
          />
        );
      })}

      {/* Star points */}
      {points.map((point, i) => (
        <motion.circle
          key={`star-${i}`}
          cx={`${point.x}%`}
          cy={`${point.y}%`}
          r="2"
          fill={color}
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}

export default FloatingOrb;
