import React from 'react';
import { Shield, Zap, Heart, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RiskReversalSection: React.FC<{ onSignup?: (phone: string) => void }> = ({ onSignup }) => {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Access",
      description: "Get your first personalized timing insight within minutes of signing up"
    },
    {
      icon: Shield,
      title: "No Commitments",
      description: "Try it, love it, or simply stop receiving messages anytime with one text"
    },
    {
      icon: Heart,
      title: "Actually Helpful",
      description: "Real timing advice that works with your natural rhythms, not generic horoscopes"
    }
  ];

  const socialProof = [
    "Sarah from NYC just discovered her perfect workout time",
    "Mike in LA improved his sleep quality by 300%",
    "Jessica lost 15 pounds using Taurus meal timing",
    "David's energy levels doubled with Scorpio scheduling",
    "Emma's productivity skyrocketed with Gemini focus hours"
  ];

  const [currentProof, setCurrentProof] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof(prev => (prev + 1) % socialProof.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Do You Have to Lose?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Most people waste years fighting their natural timing. Find out yours in 60 seconds.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                  <benefit.icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Live Social Proof */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium text-sm">LIVE ACTIVITY</span>
            </div>
            <div className="text-white text-lg transition-all duration-500">
              {socialProof[currentProof]}
            </div>
            <div className="text-slate-400 text-sm mt-2">
              Just now • Real user results
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Your Perfect Timing Awaits
            </h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Join 50,000+ people who stopped guessing and started knowing exactly when their body works best.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Takes 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Stop anytime</span>
              </div>
            </div>

            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-lg px-8 py-4"
            >
              Discover Your Timing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="text-xs text-slate-500 mt-4">
              ↑ Scroll up to enter your phone number
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};