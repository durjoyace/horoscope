import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressProps {
  value: number;
  label: string;
  color: string;
  delay?: number;
  isMobile?: boolean;
  shouldReduceMotion?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  label,
  color,
  delay = 0,
  isMobile = false,
  shouldReduceMotion = false
}) => {
  // Use CSS animations for reduced motion or performance concerns
  if (shouldReduceMotion || (isMobile && value > 0)) {
    return (
      <div className="bg-gray-700 rounded-full h-3 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{
            width: `${value}%`,
            animationDelay: `${delay}ms`,
            animationName: 'progressFill',
            animationDuration: '1200ms',
            animationFillMode: 'both'
          }}
        >
          <div 
            className="absolute inset-0 bg-white/20 rounded-full animate-pulse"
            style={{ animationDelay: `${delay + 200}ms` }}
          />
        </div>
        <style jsx>{`
          @keyframes progressFill {
            from {
              width: 0%;
              opacity: 0;
            }
            to {
              width: ${value}%;
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // Use Framer Motion for desktop and devices that can handle it
  return (
    <div className="bg-gray-700 rounded-full h-3 overflow-hidden relative">
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: `${value}%`, opacity: 1 }}
        transition={{ 
          delay: delay / 1000, 
          duration: 1.2, 
          ease: "easeOut",
          width: { type: "spring", damping: 20, stiffness: 100 }
        }}
        className={`h-full rounded-full relative ${color}`}
        style={{ 
          transformOrigin: "left",
          willChange: "width, opacity"
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            delay: (delay + 200) / 1000,
            duration: 0.8, 
            repeat: 2,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-white/20 rounded-full"
        />
      </motion.div>
    </div>
  );
};