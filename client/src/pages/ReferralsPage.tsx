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
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

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
        <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Invite Friends & Earn Rewards
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share the gift of personalized wellness with friends and family. 
          For every friend who joins, you both get premium features!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
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
            
            <div className="pt-4 border-t">
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
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Your Rewards
            </CardTitle>
            <CardDescription>
              Track your referral success and earned rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {referralData?.totalReferrals || 0}
              </div>
              <p className="text-muted-foreground">Friends Referred</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Reward Progress</span>
                <Badge variant="secondary">
                  {Math.min((referralData?.totalReferrals || 0) * 10, 100)}% to next tier
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span>Each referral = 1 month free premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <span>5 referrals = Lifetime 50% discount</span>
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

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Code</h3>
              <p className="text-sm text-muted-foreground">
                Send your unique referral code to friends via SMS, email, or social media
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Friend Signs Up</h3>
              <p className="text-sm text-muted-foreground">
                When they join using your code, they get their first month of premium free
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. You Both Win</h3>
              <p className="text-sm text-muted-foreground">
                You get premium rewards and they get personalized wellness insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}