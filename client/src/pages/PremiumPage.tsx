import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Sparkles,
  Star,
  ArrowRight,
  CheckCircle,
  X,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';

export default function PremiumPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubscribe = async () => {
    // In a real application, this would open a Stripe checkout
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Premium Activation",
        description: "Your premium subscription is being processed. We'll notify you when it's active.",
      });
      
      // In a real implementation, we'd use a Stripe redirection or modal
      // For now, we'll just simulate success
      navigate('/dashboard');
    }, 1500);
  };
  
  const isPremium = user?.isPremium;
  
  if (isPremium) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block p-3 bg-yellow-500/20 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">You're Already Premium!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            You're already enjoying all the benefits of our Premium service. Thank you for your support!
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Go to Your Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-block p-3 bg-yellow-500/20 rounded-full mb-4">
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Elevate Your Wellness Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock deeper astrological health insights with our premium membership, designed for those seeking comprehensive wellness guidance.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Personalized Reports</CardTitle>
              <CardDescription>
                In-depth weekly wellness reports based on your unique astrological profile
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Premium Content</CardTitle>
              <CardDescription>
                Exclusive access to premium content and monthly special reports
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Priority Support</CardTitle>
              <CardDescription>
                Get direct support from our team of astrological health experts
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        {/* Pricing Plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Select the option that works best for you
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly Plan */}
          <Card className={`border-2 ${selectedPlan === 'monthly' ? 'border-primary shadow-lg' : 'border-border'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Monthly Plan</CardTitle>
                  <CardDescription>Perfect for testing the waters</CardDescription>
                </div>
                <div className="flex items-start">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Weekly premium reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Exercise & nutrition recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-5 w-5" />
                  <span>Annual discount</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('monthly')}
              >
                {selectedPlan === 'monthly' ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Annual Plan */}
          <Card className={`border-2 ${selectedPlan === 'annual' ? 'border-primary shadow-lg' : 'border-border'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Annual Plan</CardTitle>
                  <CardDescription>Best value for committed users</CardDescription>
                </div>
                <div className="flex items-start">
                  <span className="text-3xl font-bold">$89.99</span>
                  <span className="text-muted-foreground ml-1">/yr</span>
                </div>
              </div>
              <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 25%
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Weekly premium reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Exercise & nutrition recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>25% annual discount</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                variant={selectedPlan === 'annual' ? 'default' : 'outline'}
                onClick={() => setSelectedPlan('annual')}
              >
                {selectedPlan === 'annual' ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Subscribe Button */}
        <div className="mt-12 text-center">
          <Button 
            onClick={handleSubscribe} 
            disabled={isProcessing} 
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-10"
          >
            {isProcessing ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            By subscribing, you agree to our terms of service and privacy policy.
          </p>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <h3 className="text-xl font-medium mb-2">How will premium membership enhance my experience?</h3>
              <p className="text-muted-foreground">
                Premium membership provides deeper health insights, personalized weekly reports, and recommendations specifically tailored to your astrological profile. You'll receive more detailed guidance about how your zodiac sign affects your wellness needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have premium access until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                We don't currently offer a free trial, but we do have a 14-day money-back guarantee if you're not satisfied with the premium experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}