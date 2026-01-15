/**
 * GlassCard Component
 * Glassmorphism card with cosmic styling and animations
 */

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'subtle' | 'gradient';
  glow?: boolean;
  glowColor?: 'purple' | 'pink' | 'cyan' | 'amber';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  borderGlow?: boolean;
}

const variantStyles = {
  default: 'bg-cosmic-surface backdrop-blur-md border border-cosmic-border',
  elevated: 'bg-cosmic-surface-light backdrop-blur-lg border border-cosmic-border-light shadow-cosmic-md',
  subtle: 'bg-cosmic-surface-glass backdrop-blur-sm border border-cosmic-border/50',
  gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-cosmic-border',
};

const glowColors = {
  purple: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  pink: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
  cyan: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]',
  amber: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const roundedStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      glow = false,
      glowColor = 'purple',
      hover = true,
      padding = 'md',
      rounded = 'lg',
      borderGlow = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          roundedStyles[rounded],
          glow && glowColors[glowColor],
          hover && 'hover:scale-[1.02] hover:shadow-lg hover:border-cosmic-border-glow',
          borderGlow && 'before:absolute before:inset-0 before:rounded-inherit before:p-[1px] before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:-z-10',
          className
        )}
        whileHover={hover ? { y: -4 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Animated gradient border version
interface GradientBorderCardProps extends GlassCardProps {
  gradientFrom?: string;
  gradientTo?: string;
  animated?: boolean;
}

export function GradientBorderCard({
  children,
  className,
  gradientFrom = 'from-purple-500',
  gradientTo = 'to-pink-500',
  animated = true,
  padding = 'md',
  rounded = 'lg',
  ...props
}: GradientBorderCardProps) {
  return (
    <div className={cn('relative p-[1px]', roundedStyles[rounded])}>
      {/* Gradient border */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-r',
          gradientFrom,
          gradientTo,
          roundedStyles[rounded]
        )}
        animate={
          animated
            ? {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }
            : undefined
        }
        transition={
          animated
            ? {
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }
            : undefined
        }
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Card content */}
      <motion.div
        className={cn(
          'relative bg-cosmic-bg-primary backdrop-blur-lg',
          paddingStyles[padding],
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Interactive spotlight card
interface SpotlightCardProps extends GlassCardProps {
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(139, 92, 246, 0.15)',
  padding = 'lg',
  rounded = 'xl',
  ...props
}: SpotlightCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden bg-cosmic-surface backdrop-blur-md border border-cosmic-border',
        paddingStyles[padding],
        roundedStyles[rounded],
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500',
        className
      )}
      style={{
        '--spotlight-color': spotlightColor,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01 }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Stats card variant
interface StatsCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatsCard({ icon, label, value, trend, className }: StatsCardProps) {
  return (
    <GlassCard className={cn('flex items-center gap-4', className)} padding="lg">
      {icon && (
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-cosmic-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-cosmic-text-primary">{value}</p>
      </div>
      {trend && (
        <div
          className={cn(
            'text-sm font-medium',
            trend.isPositive ? 'text-emerald-400' : 'text-red-400'
          )}
        >
          {trend.isPositive ? '+' : ''}{trend.value}%
        </div>
      )}
    </GlassCard>
  );
}

export default GlassCard;
