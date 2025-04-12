import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZodiacSign } from '@shared/types';
import { LanguageContext } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useContext } from 'react';

interface ZodiacWheelProps {
  onSelectSign?: (sign: ZodiacSign) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const zodiacSigns: Array<{
  sign: ZodiacSign;
  icon: string;
  angle: number;
}> = [
  { sign: 'aries', icon: '♈', angle: 0 },
  { sign: 'taurus', icon: '♉', angle: 30 },
  { sign: 'gemini', icon: '♊', angle: 60 },
  { sign: 'cancer', icon: '♋', angle: 90 },
  { sign: 'leo', icon: '♌', angle: 120 },
  { sign: 'virgo', icon: '♍', angle: 150 },
  { sign: 'libra', icon: '♎', angle: 180 },
  { sign: 'scorpio', icon: '♏', angle: 210 },
  { sign: 'sagittarius', icon: '♐', angle: 240 },
  { sign: 'capricorn', icon: '♑', angle: 270 },
  { sign: 'aquarius', icon: '♒', angle: 300 },
  { sign: 'pisces', icon: '♓', angle: 330 },
];

export function ZodiacWheel({ 
  onSelectSign, 
  className,
  size = 'md'
}: ZodiacWheelProps) {
  const { t } = useContext(LanguageContext);
  const [hoveredSign, setHoveredSign] = useState<ZodiacSign | null>(null);
  
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-48 h-48';
      case 'lg': return 'w-96 h-96';
      case 'md':
      default: return 'w-72 h-72';
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-2xl';
      case 'md':
      default: return 'text-lg';
    }
  };
  
  const getNodeSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      case 'md':
      default: return 'w-12 h-12';
    }
  };
  
  return (
    <div className={cn("relative", getSize(), className)}>
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-primary/5 border border-primary/20"></div>
      
      {/* Spokes */}
      {zodiacSigns.map(({ angle }) => (
        <div 
          key={angle}
          className="absolute top-1/2 left-1/2 w-1/2 h-[1px] origin-left bg-primary/10"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
      ))}
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/30"></div>
      
      {/* Zodiac nodes */}
      {zodiacSigns.map(({ sign, icon, angle }) => {
        const radians = (angle * Math.PI) / 180;
        const radius = size === 'sm' ? 40 : size === 'lg' ? 160 : 120;
        
        // Calculate position on circle
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        
        return (
          <motion.div
            key={sign}
            className={cn(
              "absolute flex items-center justify-center rounded-full cursor-pointer bg-primary/20 border-2 border-primary/30",
              getNodeSize(),
              hoveredSign === sign && "bg-primary/40 border-primary/70"
            )}
            style={{ 
              left: `calc(50% + ${x}px)`, 
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)' 
            }}
            whileHover={{ scale: 1.2 }}
            onMouseEnter={() => setHoveredSign(sign)}
            onMouseLeave={() => setHoveredSign(null)}
            onClick={() => onSelectSign?.(sign)}
            aria-label={t(`zodiac.signs.${sign}`)}
          >
            <span className={cn("text-primary-foreground", getIconSize())}>{icon}</span>
            
            {/* Sign name */}
            <span 
              className={cn(
                "absolute whitespace-nowrap capitalize font-medium text-xs",
                angle <= 90 || angle >= 270 ? "left-full ml-2" : "right-full mr-2"
              )}
            >
              {t(`zodiac.signs.${sign}`)}
            </span>
          </motion.div>
        );
      })}
      
      {/* Hover overlay */}
      {hoveredSign && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background/80 backdrop-blur-sm rounded-full py-2 px-4 text-center"
          >
            <h3 className="font-semibold capitalize">{t(`zodiac.signs.${hoveredSign}`)}</h3>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ZodiacWheel;