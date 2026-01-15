/**
 * StarField Component
 * Animated starfield background with twinkling stars and shooting stars
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
}

interface StarFieldProps {
  starCount?: number;
  shootingStarInterval?: number;
  className?: string;
  interactive?: boolean;
}

export function StarField({
  starCount = 100,
  shootingStarInterval = 5000,
  className = '',
  interactive = false,
}: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Generate stars on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate stars when dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleDelay: Math.random() * 5,
        twinkleDuration: Math.random() * 2 + 2,
      });
    }
    setStars(newStars);
  }, [dimensions, starCount]);

  // Shooting stars
  useEffect(() => {
    if (shootingStarInterval <= 0) return;

    const createShootingStar = () => {
      const id = Date.now();
      const newStar: ShootingStar = {
        id,
        startX: Math.random() * dimensions.width * 0.5,
        startY: Math.random() * dimensions.height * 0.3,
        angle: Math.random() * 30 + 30, // 30-60 degrees
        duration: Math.random() * 1 + 1.5,
      };

      setShootingStars((prev) => [...prev, newStar]);

      // Remove after animation
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, newStar.duration * 1000);
    };

    const interval = setInterval(createShootingStar, shootingStarInterval);
    return () => clearInterval(interval);
  }, [shootingStarInterval, dimensions]);

  // Interactive mouse effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    // Could add interactive particle effects here
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      onMouseMove={handleMouseMove}
    >
      {/* Static stars */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.8 }}
      >
        {stars.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            initial={{ opacity: star.opacity }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.twinkleDuration,
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-px"
            style={{
              left: star.startX,
              top: star.startY,
              height: '80px',
              background: 'linear-gradient(to bottom, white, transparent)',
              transformOrigin: 'top left',
              rotate: `${star.angle}deg`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scaleY: [0, 1, 1, 0],
              x: [0, Math.cos((star.angle * Math.PI) / 180) * 300],
              y: [0, Math.sin((star.angle * Math.PI) / 180) * 300],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: star.duration, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Nebula glow effects */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '40%',
          height: '40%',
          top: '20%',
          left: '10%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '35%',
          height: '35%',
          bottom: '10%',
          right: '15%',
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}

// Mini version for cards/sections
export function MiniStarField({ count = 20 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default StarField;
