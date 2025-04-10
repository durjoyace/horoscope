import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  HeartPulse, 
  Users, 
  ShieldAlert,
  Lightbulb,
  LucideIcon
} from 'lucide-react';
import { PremiumReportContent, ZodiacSign } from '@shared/types';
import { useToast } from '@/hooks/use-toast';
import { PremiumPlans } from './PremiumPlans';

interface PremiumReportProps {
  email: string;
  zodiacSign: ZodiacSign;
  subscriptionStatus?: string;
  subscriptionTier?: string;
}

export function PremiumReport({ 
  email, 
  zodiacSign, 
  subscriptionStatus = 'none',
  subscriptionTier = 'free'
}: PremiumReportProps) {
  const [report, setReport] = useState<PremiumReportContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const { toast } = useToast();

  const isPremium = subscriptionStatus === 'active' && 
    (subscriptionTier === 'premium' || subscriptionTier === 'pro');

  useEffect(() => {
    const fetchReport = async () => {
      if (!email || !zodiacSign) return;
      
      try {
        setIsLoading(true);
        setError(null);
        setNeedsSubscription(false);
        
        const response = await fetch(`/api/premium/weekly-report?email=${encodeURIComponent(email)}&sign=${zodiacSign}`);
        const data = await response.json();

        if (response.status === 403 && data.subscriptionRequired) {
          setNeedsSubscription(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch premium report');
        }

        if (data.success && data.premiumReport) {
          setReport(data.premiumReport.content);
        } else {
          throw new Error(data.message || 'Failed to fetch premium report');
        }
      } catch (error: any) {
        console.error('Error fetching premium report:', error);
        setError(error.message || 'Failed to fetch premium report');
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch premium report',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [email, zodiacSign, toast]);

  // If user needs a subscription
  if (needsSubscription || !isPremium) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Premium Weekly Health Report</CardTitle>
            <CardDescription>
              Subscribe to unlock your personalized weekly premium health horoscope report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" />
                <span>Personalized wellness insights based on your zodiac sign</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Detailed monthly health forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Weekly personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Compatibility insights for optimal wellness</span>
              </div>
              
              <Button className="w-full mt-4" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                View Premium Plans
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PremiumPlans 
          userEmail={email} 
          currentTier={subscriptionTier}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>We couldn't load your premium report</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!report) return null;

  interface SectionProps {
    title: string;
    content: string;
    icon: LucideIcon;
  }

  const Section = ({ title, content, icon: Icon }: SectionProps) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Premium Weekly Health Report</CardTitle>
        <CardDescription>
          Your personalized astrological health forecast for {zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Section 
          title="Weekly Overview" 
          content={report.weeklyOverview}
          icon={Calendar}
        />

        <Separator />

        <Section 
          title="Wellness Insights" 
          content={report.wellnessInsights}
          icon={HeartPulse}
        />

        <Separator />

        <Section 
          title="Monthly Forecast" 
          content={report.monthlyForecast}
          icon={BarChart3}
        />

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Personalized Recommendations</h3>
          </div>
          <ul className="space-y-2 list-disc pl-6">
            {report.personalizedRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <Section 
          title="Compatibility Insights" 
          content={report.compatibilityInsights}
          icon={Users}
        />

        <Separator />

        <Section 
          title="Challenge Areas" 
          content={report.challengeAreas}
          icon={ShieldAlert}
        />

        <Separator />

        <Section 
          title="Growth Opportunities" 
          content={report.growthOpportunities}
          icon={Lightbulb}
        />
      </CardContent>
    </Card>
  );
}