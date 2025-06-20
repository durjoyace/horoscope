import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  Target,
  Trophy,
  Timer
} from 'lucide-react';

interface ViralTriggerProps {
  userReferrals: number;
  onShareClick: () => void;
}

export function ViralGrowthTriggers({ userReferrals, onShareClick }: ViralTriggerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [liveActivity, setLiveActivity] = useState(0);

  // Countdown timer for urgency
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(23, 59, 59, 999); // End of day
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const triggers = [
    // FOMO Trigger
    {
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Double Rewards End Today',
      description: `Only ${timeLeft} left to earn 2x premium features per referral`,
      action: 'Share Now',
      urgent: true
    },
    
    // Social Proof
    {
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: `${247 + liveActivity} People Joined Today`,
      description: 'Your friends are already discovering better health',
      action: 'Join the Movement',
      urgent: false
    },
    
    // Competition Trigger
    {
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Top 10% This Week',
      description: `You're beating ${Math.max(0, 8 - userReferrals)} other users. Keep going!`,
      action: 'Stay Ahead',
      urgent: false
    },
    
    // Achievement Unlock
    {
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      title: 'Wellness Hero Status',
      description: `${Math.max(0, 10 - userReferrals)} more friends = Lifetime premium access`,
      action: 'Unlock Status',
      urgent: false
    }
  ];

  return (
    <div className="space-y-4">
      {triggers.map((trigger, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden ${trigger.borderColor} ${trigger.urgent ? 'animate-pulse' : ''}`}
        >
          <CardContent className={`p-4 ${trigger.bgColor}/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${trigger.bgColor} rounded-full`}>
                  <trigger.icon className={`h-5 w-5 ${trigger.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    {trigger.title}
                    {trigger.urgent && (
                      <Badge variant="destructive" className="text-xs animate-bounce">
                        <Timer className="h-3 w-3 mr-1" />
                        URGENT
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{trigger.description}</p>
                </div>
              </div>
              
              <Button 
                onClick={onShareClick}
                size="sm"
                variant={trigger.urgent ? "default" : "outline"}
                className={trigger.urgent ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                {trigger.urgent && <Zap className="h-4 w-4 mr-2" />}
                {trigger.action}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}