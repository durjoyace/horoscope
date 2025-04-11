import React, { useState } from 'react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ZodiacWheelProps {
  activeSigns?: ZodiacSign[];
  onSelectSign?: (sign: ZodiacSign) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  highlightElements?: boolean;
}

export default function ZodiacWheel({
  activeSigns = [],
  onSelectSign,
  interactive = true,
  size = 'md',
  highlightElements = false,
}: ZodiacWheelProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Smaller wheel size for small screens
  const width = size === 'sm' ? 280 : size === 'md' ? 500 : 700;
  const center = width / 2;
  const radius = (width / 2) * 0.8;
  
  const getSignPosition = (index: number, total: number = 12) => {
    // Calculate position on the circle
    const angle = (index * (2 * Math.PI / total)) - Math.PI / 2; // Start at the top (12 o'clock)
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };
  
  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Fire': return 'text-red-500 bg-red-100';
      case 'Earth': return 'text-green-600 bg-green-100';
      case 'Air': return 'text-blue-500 bg-blue-100';
      case 'Water': return 'text-indigo-500 bg-indigo-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getElementGradient = (element: string): string => {
    switch (element) {
      case 'Fire': return 'from-red-500/20 to-orange-500/20';
      case 'Earth': return 'from-green-500/20 to-emerald-500/20';
      case 'Air': return 'from-blue-500/20 to-sky-500/20';
      case 'Water': return 'from-indigo-500/20 to-blue-400/20';
      default: return 'from-gray-500/20 to-gray-400/20';
    }
  };
  
  const handleSignClick = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    if (onSelectSign) {
      onSelectSign(sign);
    }
    if (interactive) {
      setOpenDialog(true);
    }
  };
  
  const getSignInfo = (sign: ZodiacSign) => {
    const signData = zodiacSignNames.find(s => s.value === sign);
    if (!signData) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">{signData.symbol}</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">{signData.label}</h3>
              <p className="text-sm text-muted-foreground">{signData.dates}</p>
            </div>
          </div>
          <Badge className={`mt-1 sm:mt-0 ${getElementColor(signData.element)}`}>
            {signData.element} Element
          </Badge>
        </div>
        
        <div className="grid gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-medium">Ruling Planet</h4>
            <p className="text-sm sm:text-base">{signData.rulingPlanet || signData.planet}</p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-medium">Traits</h4>
            <p className="text-sm sm:text-base">{signData.traits || "Unique, Versatile, Adaptable"}</p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-medium">Health Focus</h4>
            <p className="text-sm sm:text-base">{signData.healthFocus || "Overall wellness and balance"}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="relative" style={{ width, height: width }}>
      {/* Elements background quadrants */}
      {highlightElements && (
        <div className="absolute inset-0 rounded-full overflow-hidden" style={{ width, height: width }}>
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-500/10 to-sky-500/10"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-indigo-500/10 to-blue-400/10"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-500/10 to-emerald-500/10"></div>
        </div>
      )}
      
      {/* Zodiac wheel circle */}
      <div 
        className="absolute rounded-full border-2 border-gray-200"
        style={{
          width: radius * 2,
          height: radius * 2,
          left: center - radius,
          top: center - radius,
        }}
      ></div>
      
      {/* Center */}
      <div 
        className="absolute rounded-full bg-primary/20 flex items-center justify-center"
        style={{
          width: radius * 0.5,
          height: radius * 0.5,
          left: center - (radius * 0.25),
          top: center - (radius * 0.25),
        }}
      >
        <div className="text-primary font-medium text-center">
          <div className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>Zodiac</div>
          <div className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>Wheel</div>
        </div>
      </div>
      
      {/* Signs */}
      {zodiacSignNames.map((sign, index) => {
        const { x, y } = getSignPosition(index);
        const isActive = activeSigns.includes(sign.value);
        const isSelected = selectedSign === sign.value;
        
        return (
          <Dialog key={sign.value} open={openDialog && selectedSign === sign.value} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button
                className={`absolute rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive || isSelected
                    ? `scale-110 shadow-lg ${getElementColor(sign.element)}`
                    : 'bg-white border border-gray-200 hover:scale-110 hover:shadow-md'
                }`}
                style={{
                  // Use smaller buttons for mobile (sm size)
                  width: size === 'sm' ? radius * 0.25 : radius * 0.3,
                  height: size === 'sm' ? radius * 0.25 : radius * 0.3,
                  left: x - (size === 'sm' ? radius * 0.125 : radius * 0.15),
                  top: y - (size === 'sm' ? radius * 0.125 : radius * 0.15),
                  transform: isActive || isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => handleSignClick(sign.value)}
              >
                <div className="text-center">
                  <div className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} mb-0.5 md:mb-1`}>{sign.symbol}</div>
                  {/* Hide label on small size to prevent overflow */}
                  {size === 'sm' ? (null) : (
                    <div className="text-xs font-medium">{sign.label}</div>
                  )}
                </div>
              </button>
            </DialogTrigger>
            
            {interactive && (
              <DialogContent className="max-w-[90vw] w-full sm:max-w-md p-4 sm:p-6">
                <DialogHeader className="pb-2 sm:pb-4">
                  <DialogTitle className="text-lg sm:text-xl">Zodiac Sign Details</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Learn more about this zodiac sign's characteristics and health insights
                  </DialogDescription>
                </DialogHeader>
                {getSignInfo(sign.value)}
              </DialogContent>
            )}
          </Dialog>
        );
      })}
      
      {/* Lines connecting to center */}
      <svg 
        width={width} 
        height={width} 
        className="absolute top-0 left-0 pointer-events-none"
      >
        {zodiacSignNames.map((sign, index) => {
          const { x, y } = getSignPosition(index);
          return (
            <line 
              key={sign.value}
              x1={center} 
              y1={center} 
              x2={x} 
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      {/* Selected sign info card */}
      {selectedSign && !interactive && (
        <Card className="absolute left-0 right-0 mx-auto -bottom-48 max-w-sm">
          <CardHeader className="pb-2">
            <CardTitle>{zodiacSignNames.find(s => s.value === selectedSign)?.label}</CardTitle>
            <CardDescription>{zodiacSignNames.find(s => s.value === selectedSign)?.dates}</CardDescription>
          </CardHeader>
          <CardContent>
            {getSignInfo(selectedSign)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}