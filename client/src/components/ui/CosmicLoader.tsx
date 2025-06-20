import React, { useState, useEffect } from 'react';

interface CosmicLoaderProps {
  duration?: number;
  onComplete?: () => void;
  message?: string;
}

export const CosmicLoader: React.FC<CosmicLoaderProps> = ({ 
  duration = 3000, 
  onComplete 
}) => {
  const [currentConstellation, setCurrentConstellation] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const constellations = [
    {
      name: "Aries",
      symbol: "♈",
      stars: [
        { x: 30, y: 40, delay: 0 },
        { x: 45, y: 35, delay: 200 },
        { x: 60, y: 45, delay: 400 },
        { x: 70, y: 30, delay: 600 }
      ]
    },
    {
      name: "Leo",
      symbol: "♌", 
      stars: [
        { x: 25, y: 50, delay: 0 },
        { x: 40, y: 30, delay: 150 },
        { x: 50, y: 45, delay: 300 },
        { x: 65, y: 25, delay: 450 },
        { x: 75, y: 50, delay: 600 }
      ]
    },
    {
      name: "Scorpio",
      symbol: "♏",
      stars: [
        { x: 20, y: 35, delay: 0 },
        { x: 35, y: 50, delay: 100 },
        { x: 50, y: 40, delay: 200 },
        { x: 65, y: 55, delay: 300 },
        { x: 80, y: 30, delay: 400 }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentConstellation((prev) => 
        prev === constellations.length - 1 ? 0 : prev + 1
      );
    }, 1000);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete, constellations.length]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center z-50 animate-fade-out">
        <div className="animate-fade-out">
          {/* Fade out animation */}
        </div>
      </div>
    );
  }

  const currentConst = constellations[currentConstellation];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center z-50">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main constellation area */}
      <div className="relative w-80 h-80 flex flex-col items-center justify-center">
        {/* Constellation symbol */}
        <div className="text-6xl text-purple-400 mb-8 animate-pulse-slow">
          {currentConst.symbol}
        </div>

        {/* Constellation name */}
        <div className="text-2xl font-semibold text-white mb-8 animate-fade-in">
          {currentConst.name}
        </div>

        {/* Star constellation */}
        <div className="relative w-64 h-64">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Constellation lines */}
            {currentConst.stars.map((star, index) => {
              if (index === currentConst.stars.length - 1) return null;
              const nextStar = currentConst.stars[index + 1];
              return (
                <line
                  key={`line-${index}`}
                  x1={star.x}
                  y1={star.y}
                  x2={nextStar.x}
                  y2={nextStar.y}
                  stroke="rgba(147, 51, 234, 0.4)"
                  strokeWidth="0.5"
                  className="animate-draw-line"
                  style={{
                    animationDelay: `${Math.max(star.delay, nextStar.delay) + 200}ms`
                  }}
                />
              );
            })}

            {/* Stars */}
            {currentConst.stars.map((star, index) => (
              <circle
                key={`star-${index}`}
                cx={star.x}
                cy={star.y}
                r="1.5"
                fill="#fbbf24"
                className="animate-star-appear"
                style={{
                  animationDelay: `${star.delay}ms`
                }}
              />
            ))}
          </svg>
        </div>

        {/* Loading text */}
        <div className="text-slate-300 text-lg mt-8 animate-pulse">
          Aligning your cosmic energy...
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-loading-bar"
            style={{
              animationDuration: `${duration}ms`
            }}
          />
        </div>
      </div>
    </div>
  );
};