import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PricingPlan } from '@shared/types';
import { apiRequest } from '@/lib/queryClient';

interface PremiumPlansProps {
  userEmail: string;
  currentTier?: string;
  onSubscribeSuccess?: () => void;
}

export function PremiumPlans({ userEmail, currentTier = 'free', onSubscribeSuccess }: PremiumPlansProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const { toast } = useToast();

  // Fetch subscription plans if they're not already loaded
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch('/api/subscription/plans');
        const data = await response.json();

        if (data.success) {
          setPlans(data.plans);
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to load subscription plans',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription plans',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleSubscribe = async (priceId: string) => {
    if (!userEmail) {
      toast({
        title: 'Error',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session with Stripe
      const response = await apiRequest('POST', '/api/subscription/create-checkout', {
        email: userEmail,
        priceId,
        successUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: `${window.location.origin}/dashboard?subscription=canceled`,
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to create checkout session',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPlans) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Use placeholder plans if no plans were fetched
  const displayPlans = plans.length > 0 ? plans : [
    {
      id: 'price_monthly',
      name: 'Premium Monthly',
      description: 'Enhanced astrological health insights delivered weekly',
      price: 9.99,
      interval: 'month',
      features: [
        'Weekly premium health horoscopes',
        'Personalized wellness recommendations',
        'Compatibility insights for optimal wellness',
        'Growth and challenge insights',
      ],
      stripePriceId: 'price_monthly',
      tier: 'premium'
    },
    {
      id: 'price_yearly',
      name: 'Premium Yearly',
      description: 'Our best value plan with 2 months free',
      price: 99.99,
      interval: 'year',
      features: [
        'All Premium Monthly features',
        '2 months free (save 16%)',
        'Priority email support',
        'Early access to new features',
      ],
      stripePriceId: 'price_yearly',
      tier: 'premium'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Premium Health Horoscopes</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Unlock deeper astrological health insights and personalized wellness recommendations tailored to your zodiac sign.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayPlans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.tier === 'premium' ? 'border-primary/20' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="pb-3 space-y-6 flex-grow">
              <div className="flex items-baseline text-2xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /{plan.interval}
                </span>
              </div>

              <Separator />

              <ul className="space-y-2 list-none pl-0">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                variant={currentTier === plan.tier ? 'outline' : 'default'}
                disabled={isLoading || currentTier === plan.tier}
                className="w-full"
                onClick={() => handleSubscribe(plan.stripePriceId)}
              >
                {currentTier === plan.tier ? (
                  'Current Plan'
                ) : (
                  isLoading ? 'Processing...' : `Subscribe${plan.interval === 'year' ? ' (Save 16%)' : ''}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Free tier card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {currentTier === 'free' && (
                <Badge variant="outline" className="ml-2">
                  Current Plan
                </Badge>
              )}
            </div>
            <CardDescription>Basic daily health horoscopes</CardDescription>
          </CardHeader>

          <CardContent className="pb-3 space-y-6 flex-grow">
            <div className="flex items-baseline text-2xl font-bold">
              $0
              <span className="text-sm font-normal text-muted-foreground ml-1">
                /forever
              </span>
            </div>

            <Separator />

            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Daily health horoscopes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>Basic wellness tips</span>
              </li>
              <li className="flex items-start text-muted-foreground">
                <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Weekly premium reports</span>
              </li>
              <li className="flex items-start text-muted-foreground">
                <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Personalized recommendations</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              disabled={true}
              className="w-full"
            >
              Always Free
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}