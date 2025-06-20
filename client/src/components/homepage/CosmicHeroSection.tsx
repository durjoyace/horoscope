import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Smartphone, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCosmicLoader } from '@/hooks/useCosmicLoader';

interface CosmicHeroSectionProps {
  onSignup?: (phone: string) => void;
  isLoggedIn?: boolean;
}

export const CosmicHeroSection: React.FC<CosmicHeroSectionProps> = ({ 
  onSignup, 
  isLoggedIn = false 
}) => {
  const [phone, setPhone] = useState('');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { showLoader, setLoadingMessage } = useCosmicLoader();

  const handleSignupClick = () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid phone number to receive your daily horoscope via SMS.",
        variant: "destructive",
      });
      return;
    }
    
    if (onSignup) {
      onSignup(phone);
    } else {
      localStorage.setItem('pendingSignupPhone', phone);
      navigate('/signup');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignupClick();
    }
  };

  const testCosmicLoader = async () => {
    setLoadingMessage("Demonstrating cosmic constellation transitions...");
    await showLoader(5000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            <span>Chronobiology Meets Astrology</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Body Has a Schedule
            <span className="block bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mt-2">
              We Know When
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl mx-auto leading-relaxed">
            Get daily wellness insights that tell you exactly when to exercise, eat, rest, and focus for maximum health impact. Your zodiac sign reveals your body's natural timing.
          </p>
          
          {!isLoggedIn && (
            <>
              {/* Phone input form */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="h-14 pl-12 text-lg bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                  <Button 
                    onClick={handleSignupClick}
                    className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 shadow-lg shadow-purple-500/25"
                  >
                    Get Your Insights
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
              
              {/* Demo button for cosmic loader */}
              <div className="mt-8">
                <Button
                  onClick={testCosmicLoader}
                  variant="outline"
                  className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Preview Cosmic Loading Animation
                </Button>
              </div>
            </>
          )}
          
          {isLoggedIn && (
            <div className="max-w-md mx-auto">
              <Button
                onClick={() => navigate('/dashboard')}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};