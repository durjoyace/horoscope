/**
 * CosmicButton Component
 * Neumorphic and gradient button variants with cosmic styling
 */

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CosmicButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'neumorphic' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  glowColor?: 'purple' | 'pink' | 'cyan' | 'amber';
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-pink-500',
  secondary:
    'bg-cosmic-surface border border-cosmic-border text-cosmic-text-primary hover:bg-cosmic-surface-light hover:border-cosmic-border-light',
  ghost:
    'bg-transparent text-cosmic-text-secondary hover:bg-cosmic-surface hover:text-cosmic-text-primary',
  outline:
    'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300',
  neumorphic:
    'bg-cosmic-bg-secondary text-cosmic-text-primary shadow-[5px_5px_10px_rgba(0,0,0,0.3),-5px_-5px_10px_rgba(60,60,90,0.1)] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2),inset_-5px_-5px_10px_rgba(60,60,90,0.1)]',
  glow: 'bg-cosmic-surface border border-purple-500/50 text-purple-300',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

const glowColors = {
  purple: 'shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]',
  pink: 'shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]',
  cyan: 'shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]',
};

export const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glowColor = 'purple',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-cosmic-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          variant === 'glow' && glowColors[glowColor],
          fullWidth && 'w-full',
          className
        )}
        whileHover={!disabled && !isLoading ? { scale: 1.02, y: -2 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="absolute left-1/2 -translate-x-1/2 h-4 w-4 animate-spin" />
        )}
        <span
          className={cn(
            'inline-flex items-center gap-2',
            isLoading && 'invisible'
          )}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </motion.button>
    );
  }
);

CosmicButton.displayName = 'CosmicButton';

// Icon-only button variant
interface IconButtonProps extends Omit<CosmicButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: ReactNode;
  'aria-label': string;
}

export const CosmicIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', ...props }, ref) => {
    const iconSizeStyles = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4',
    };

    return (
      <CosmicButton
        ref={ref}
        className={cn('!rounded-full', iconSizeStyles[size], className)}
        size={size}
        {...props}
      >
        {icon}
      </CosmicButton>
    );
  }
);

CosmicIconButton.displayName = 'CosmicIconButton';

// Button group
interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function CosmicButtonGroup({
  children,
  className,
  orientation = 'horizontal',
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal'
          ? 'flex-row [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:last-child)]:border-r-0'
          : 'flex-col [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:last-child)]:border-b-0',
        className
      )}
    >
      {children}
    </div>
  );
}

// Floating action button
interface FABProps extends Omit<CosmicButtonProps, 'children'> {
  icon: ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function CosmicFAB({
  icon,
  className,
  position = 'bottom-right',
  ...props
}: FABProps) {
  const positionStyles = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <motion.div
      className={positionStyles[position]}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
    >
      <CosmicButton
        className={cn('!rounded-full !p-4 shadow-2xl', className)}
        variant="primary"
        size="lg"
        {...props}
      >
        {icon}
      </CosmicButton>
    </motion.div>
  );
}

// Animated gradient button
interface GradientButtonProps extends Omit<CosmicButtonProps, 'variant'> {
  gradient?: string;
  animateGradient?: boolean;
}

export function AnimatedGradientButton({
  children,
  className,
  gradient = 'from-purple-600 via-pink-600 to-cyan-600',
  animateGradient = true,
  ...props
}: GradientButtonProps) {
  return (
    <CosmicButton
      className={cn(
        'bg-gradient-to-r bg-[length:200%_100%]',
        gradient,
        animateGradient && 'animate-cosmic-gradient',
        className
      )}
      variant="primary"
      {...props}
    >
      {children}
    </CosmicButton>
  );
}

// Ripple effect button
interface RippleButtonProps extends CosmicButtonProps {
  rippleColor?: string;
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, className, rippleColor = 'rgba(255,255,255,0.3)', onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: ${rippleColor};
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
      `;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      onClick?.(e);
    };

    return (
      <CosmicButton
        ref={ref}
        className={cn('overflow-hidden', className)}
        onClick={handleClick}
        {...props}
      >
        {children}
        <style>{`
          @keyframes ripple {
            to {
              width: 300px;
              height: 300px;
              opacity: 0;
            }
          }
        `}</style>
      </CosmicButton>
    );
  }
);

RippleButton.displayName = 'RippleButton';

export default CosmicButton;
