import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Gift, Users, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface ReferralBannerProps {
  onDismiss?: () => void;
}

export function ReferralBanner({ onDismiss }: ReferralBannerProps) {
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!user || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const totalReferrals = (user as any).referralRewards || 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 m-4 mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-full">
            <Gift className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Invite Friends & Earn Rewards
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {totalReferrals > 0 
                ? `${totalReferrals} lives transformed! You're helping friends discover better health.`
                : "Your friends deserve the wellness breakthrough you've discovered."
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                <Users className="h-3 w-3 mr-1" />
                {totalReferrals} transformations
              </Badge>
              {totalReferrals < 10 && (
                <Badge variant="outline" className="text-xs text-red-600 border-red-200 animate-pulse">
                  {10 - totalReferrals} away from FREE FOREVER
                </Badge>
              )}
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                2x rewards ending today
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/referrals">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Start Sharing
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-purple-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}