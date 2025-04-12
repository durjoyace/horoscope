import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
}

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
      }, 300); // Slightly longer transition for better visual effect
      
      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);
  
  // Return content wrapped in transitions even during loading states
  return (
    <div className="relative min-h-[200px]">
      {/* Loading overlay */}
      {(loading || isTransitioning) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <LoadingSpinner 
            size="md" 
            text={isTransitioning ? "Changing page..." : "Loading..."}
          />
        </div>
      )}
      
      {/* Content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}