import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
}

// Smooth spring physics for natural feel
const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Page variants for different transition styles
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
  },
};

export function PageTransition({ children, loading }: PageTransitionProps) {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  // Track location changes to trigger page transitions
  useEffect(() => {
    if (location !== prevLocation) {
      setIsTransitioning(true);

      // Simulate a short transition delay
      const timer = setTimeout(() => {
        setPrevLocation(location);
        setIsTransitioning(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  // Return content wrapped in transitions even during loading states
  return (
    <div className="relative min-h-[200px]">
      {/* Loading overlay with cosmic styling */}
      <AnimatePresence>
        {(loading || isTransitioning) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
          >
            {/* Cosmic loading indicator */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Orbital loader */}
              <div className="relative w-16 h-16">
                {/* Center dot */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{
                      background: i === 0 ? '#8b5cf6' : i === 1 ? '#ec4899' : '#fbbf24',
                      boxShadow: `0 0 10px ${i === 0 ? '#8b5cf6' : i === 1 ? '#ec4899' : '#fbbf24'}`,
                    }}
                    animate={{
                      x: [0, Math.cos(i * (2 * Math.PI / 3)) * 24 - 4, 0],
                      y: [0, Math.sin(i * (2 * Math.PI / 3)) * 24 - 4, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <motion.p
                className="text-purple-300/80 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isTransitioning ? 'Loading...' : 'Please wait...'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with smooth animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}