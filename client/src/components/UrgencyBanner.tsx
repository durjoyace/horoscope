import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UrgencyBanner: React.FC = () => {
  const [currentTrigger, setCurrentTrigger] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Calculate hours until end of day
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeLeft(`${hours}h ${minutes}m`);

    // Cycle through triggers every 8 seconds
    const interval = setInterval(() => {
      setCurrentTrigger(prev => (prev + 1) % triggers.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const triggers = [
    {
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      text: `${Math.floor(Math.random() * 200) + 300} people discovered their perfect timing today`,
      urgency: false
    },
    {
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      text: 'Join the 87% who report better energy within their first week',
      urgency: false
    },
    {
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      text: 'Over 1,200 new people started this week - your zodiac insights are waiting',
      urgency: false
    },
    {
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      text: `Limited spots for personalized timing analysis - ${timeLeft} left today`,
      urgency: true
    }
  ];

  const currentItem = triggers[currentTrigger];
  const IconComponent = currentItem.icon;

  return (
    <div className={`${currentItem.bgColor} border ${currentItem.borderColor} rounded-lg p-4 transition-all duration-500`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconComponent className={`h-5 w-5 ${currentItem.color}`} />
          <span className="text-sm font-medium text-slate-200">
            {currentItem.text}
          </span>
        </div>
        {currentItem.urgency && (
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}</span>
          </div>
        )}
      </div>
    </div>
  );
};