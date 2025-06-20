import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users,
  Crown,
  Zap,
  Fire
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  badge: string;
  isCurrentUser?: boolean;
}

interface ReferralLeaderboardProps {
  userReferrals: number;
  onShareClick: () => void;
}

export function ReferralLeaderboard({ userReferrals, onShareClick }: ReferralLeaderboardProps) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simulate leaderboard data with realistic progression
    const generateLeaderboard = () => {
      const mockData: LeaderboardEntry[] = [
        { rank: 1, name: "Sarah M.", referrals: 47, badge: "Wellness Master" },
        { rank: 2, name: "Alex K.", referrals: 31, badge: "Health Guru" },
        { rank: 3, name: "Jamie L.", referrals: 28, badge: "Wellness Mentor" },
        { rank: 4, name: "Morgan P.", referrals: 24, badge: "Health Advocate" },
        { rank: 5, name: "Taylor R.", referrals: 19, badge: "Wellness Guide" },
        { rank: 6, name: "Jordan S.", referrals: 16, badge: "Health Helper" },
        { rank: 7, name: "Casey B.", referrals: 14, badge: "Wellness Friend" },
        { rank: 8, name: "Riley D.", referrals: 12, badge: "Health Starter" }
      ];

      // Insert current user into leaderboard
      if (user) {
        const userRank = mockData.findIndex(entry => entry.referrals <= userReferrals) + 1 || mockData.length + 1;
        const userName = user.firstName ? `${user.firstName} ${user.lastName?.[0] || ''}.` : "You";
        
        const userEntry: LeaderboardEntry = {
          rank: userRank,
          name: userName,
          referrals: userReferrals,
          badge: getBadgeForReferrals(userReferrals),
          isCurrentUser: true
        };

        // Insert user at correct position
        if (userRank <= mockData.length) {
          // Update ranks for users below
          mockData.forEach(entry => {
            if (entry.rank >= userRank) entry.rank++;
          });
          mockData.splice(userRank - 1, 0, userEntry);
        } else {
          mockData.push(userEntry);
        }
      }

      return mockData.slice(0, 10); // Top 10
    };

    setLeaderboard(generateLeaderboard());
  }, [user, userReferrals]);

  const getBadgeForReferrals = (count: number): string => {
    if (count >= 40) return "Wellness Master";
    if (count >= 30) return "Health Guru";
    if (count >= 20) return "Wellness Mentor";
    if (count >= 15) return "Health Advocate";
    if (count >= 10) return "Wellness Guide";
    if (count >= 5) return "Health Helper";
    if (count >= 1) return "Wellness Friend";
    return "Health Starter";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</div>;
    }
  };

  const currentUserRank = leaderboard.find(entry => entry.isCurrentUser)?.rank || leaderboard.length + 1;
  const nextTargetReferrals = leaderboard.find(entry => entry.rank === currentUserRank - 1)?.referrals || (userReferrals + 5);
  const referralsNeeded = Math.max(0, nextTargetReferrals - userReferrals + 1);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          Wellness Champions
        </CardTitle>
        <CardDescription>
          See how you rank among our top wellness ambassadors this month
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Current User Status */}
        {currentUserRank <= 10 && (
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200/50 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {getRankIcon(currentUserRank)}
                </div>
                <div>
                  <p className="font-semibold text-purple-800">You're #{currentUserRank}!</p>
                  <p className="text-sm text-purple-600">
                    {referralsNeeded > 0 
                      ? `${referralsNeeded} more referrals to climb the leaderboard`
                      : "You're at the top! Keep sharing to stay there."
                    }
                  </p>
                </div>
              </div>
              <Button onClick={onShareClick} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Fire className="h-4 w-4 mr-2" />
                Share Now
              </Button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-2">
          {leaderboard.slice(0, 8).map((entry) => (
            <div 
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                entry.isCurrentUser 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <p className={`font-medium ${entry.isCurrentUser ? 'text-purple-800' : 'text-gray-900'}`}>
                    {entry.name}
                    {entry.isCurrentUser && <span className="ml-2 text-purple-600">(You)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{entry.badge}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-lg">{entry.referrals}</span>
                </div>
                {entry.rank <= 3 && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {entry.rank === 1 ? 'Champion' : entry.rank === 2 ? 'Runner-up' : '3rd Place'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {currentUserRank > 10 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">Break into the Top 10!</p>
                <p className="text-sm text-amber-600">Share with friends to climb the leaderboard</p>
              </div>
              <Button onClick={onShareClick} size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                Start Climbing
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}