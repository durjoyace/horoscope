import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Share2, 
  Users, 
  Gift, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ViralGrowthTriggers } from '@/components/ViralGrowthTriggers';
import { ReferralLeaderboard } from '@/components/ReferralLeaderboard';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  referrals: Array<{
    id: number;
    referredUserId: number;
    status: string;
    rewardType: string;
    rewardValue: string;
    createdAt: string;
    completedAt?: string;
  }>;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Share Wellness, Unlock Rewards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our community and help friends discover personalized wellness insights. Earn enhanced features as you share.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { data: referralData, isLoading } = useQuery<ReferralData>({
    queryKey: ['/api/referrals/my-referrals'],
    enabled: !!user,
  });

  const shareReferralMutation = useMutation({
    mutationFn: async (platform: string) => {
      const res = await apiRequest("POST", "/api/referrals/share", { platform });
      return await res.json();
    }
  });

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `Referral ${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try copying manually",
        variant: "destructive",
      });
    }
  };

  const generateShareLink = async (platform: string) => {
    try {
      const result = await shareReferralMutation.mutateAsync(platform);
      const { referralUrl, shareText } = result.data;

      if (platform === 'copy') {
        await copyToClipboard(referralUrl, 'link');
      } else if (platform === 'sms') {
        window.open(`sms:?body=${encodeURIComponent(shareText)}`);
      } else if (platform === 'email') {
        window.open(`mailto:?subject=Join me on HoroscopeHealth&body=${encodeURIComponent(shareText)}`);
      } else if (platform === 'social') {
        await copyToClipboard(shareText, 'link');
        toast({
          title: "Share text copied!",
          description: "Paste this in your social media post",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view referrals</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const referralUrl = `${baseUrl}/?ref=${referralData?.referralCode}`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4">
          <Gift className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Share Wellness, Unlock Premium
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Help friends discover personalized health insights and unlock enhanced features 
          like premium reports, priority support, and exclusive content.
        </p>
        
        {/* Social proof and urgency */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>2,847 friends joined this week</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Limited time: Double rewards</span>
          </div>
        </div>
      </div>

      {/* Viral Growth Triggers */}
      <div className="mb-8">
        <ViralGrowthTriggers 
          userReferrals={referralData?.totalReferrals || 0}
          onShareClick={() => {
            // Scroll to sharing section
            document.getElementById('sharing-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      <div id="sharing-section" className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Referral Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
            <CardDescription>
              Share this code with friends to give them free premium access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                value={referralData?.referralCode || ''} 
                readOnly 
                className="font-mono text-lg text-center"
              />
              <Button
                onClick={() => copyToClipboard(referralData?.referralCode || '', 'code')}
                variant="outline"
                size="icon"
              >
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your referral link:</p>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs font-mono">
                  <span className="flex-1 truncate">{referralUrl}</span>
                  <Button
                    onClick={() => copyToClipboard(referralUrl, 'link')}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-3">Share via:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => generateShareLink('sms')}
                    variant="outline"
                    size="sm"
                    disabled={shareReferralMutation.isPending}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    onClick={() => generateShareLink('email')}
                    variant="outline"
                    size="sm"
                    disabled={shareReferralMutation.isPending}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    onClick={() => generateShareLink('social')}
                    variant="outline"
                    size="sm"
                    disabled={shareReferralMutation.isPending}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Social
                  </Button>
                  <Button
                    onClick={() => generateShareLink('copy')}
                    variant="outline"
                    size="sm"
                    disabled={shareReferralMutation.isPending}
                  >
                    {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gamified Rewards Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Crown className="h-5 w-5 text-white" />
              </div>
              Wellness Ambassador Level
            </CardTitle>
            <CardDescription>
              Unlock exclusive perks as you help friends discover better health
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center py-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {referralData?.totalReferrals || 0}
              </div>
              <p className="text-muted-foreground mb-4">Lives Transformed</p>
              
              {/* Progress bar to next level */}
              <div className="w-full bg-muted rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((referralData?.totalReferrals || 0) % 5) * 20, 100)}%` }}
                ></div>
              </div>
              
              <Badge variant="outline" className="mb-4">
                {Math.floor((referralData?.totalReferrals || 0) / 5) === 0 ? "Wellness Starter" :
                 Math.floor((referralData?.totalReferrals || 0) / 5) === 1 ? "Health Advocate" :
                 Math.floor((referralData?.totalReferrals || 0) / 5) === 2 ? "Wellness Mentor" :
                 "Wellness Master"}
              </Badge>
            </div>
            
            {/* Tiered Rewards */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Next milestone:</span>
                <span className="text-muted-foreground">
                  {5 - ((referralData?.totalReferrals || 0) % 5)} more friends
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">1 Friend = Premium Reports</p>
                    <p className="text-xs text-yellow-600">Weekly wellness insights</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">5 Friends = VIP Features</p>
                    <p className="text-xs text-purple-600">Priority support & exclusive content</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <Star className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">10 Friends = Lifetime Premium</p>
                    <p className="text-xs text-emerald-600">All premium features included</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      {referralData?.referrals && referralData.referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>
              Your successful referrals and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralData.referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Referral #{referral.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {referral.status}
                    </Badge>
                    {referral.rewardValue && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {referral.rewardValue}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <div className="mb-8">
        <ReferralLeaderboard 
          userReferrals={referralData?.totalReferrals || 0}
          onShareClick={() => {
            document.getElementById('sharing-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>The Viral Health Revolution</CardTitle>
          <CardDescription>Join thousands spreading personalized wellness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mb-3">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Secret</h3>
              <p className="text-sm text-muted-foreground">
                Tell friends about the wellness app that actually works for your body type
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. They Transform</h3>
              <p className="text-sm text-muted-foreground">
                Friends discover their unique health insights and see real results
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-3">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Everyone Wins</h3>
              <p className="text-sm text-muted-foreground">
                You unlock premium features while spreading better health to your community
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}