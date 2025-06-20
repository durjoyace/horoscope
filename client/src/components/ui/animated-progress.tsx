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
  if (shouldReduceMotion) {
    return (
      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
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