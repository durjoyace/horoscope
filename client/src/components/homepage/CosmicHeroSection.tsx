import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CosmicHeroSectionProps {
  onSignup?: (email: string) => void;
  isLoggedIn?: boolean;
}

export const CosmicHeroSection: React.FC<CosmicHeroSectionProps> = ({ 
  onSignup, 
  isLoggedIn = false 
}) => {
  const [email, setEmail] = useState('');
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSignupClick = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: t('toast.email.required.title'),
        description: t('toast.email.required.description'),
        variant: "destructive",
      });
      return;
    }
    
    if (onSignup) {
      onSignup(email);
    } else {
      localStorage.setItem('pendingSignupEmail', email);
      navigate('/auth?signup=true');
    }
  };

  return (
    <section className="relative py-10 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Dynamic background with energy - using black and purple tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900 overflow-hidden">
        {/* Vibrant, energetic shapes with purple cosmic palette */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-soft-light">
          <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-gradient-to-r from-purple-700 to-violet-700 blur-2xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-700 to-purple-700 blur-2xl animate-pulse-slower"></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-fuchsia-700 to-purple-800 blur-2xl animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column: Hero content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4 tracking-wide">
              <span className="mr-1 text-[10px] uppercase">{t('hero.tagline')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight">
              <span className="block">{t('hero.title1')}</span>
              <span className="block bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              {t('hero.description')}
            </p>
            
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('signup.email.placeholder')}
                  className="bg-white/10 border-white/20 text-white h-12 focus:border-purple-500 focus:ring-purple-500 w-full max-w-xs mx-auto sm:mx-0"
                />
                <Button 
                  onClick={handleSignupClick}
                  className="h-12 px-8 rounded-md bg-gradient-to-r from-[#8a00ff] to-[#5000ff] hover:from-[#9a00ff] hover:to-[#6000ff] text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                >
                  {t('signup.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
            
            {!isLoggedIn && (
              <div className="mt-4 text-sm text-slate-400">
                <p className="flex items-center justify-center lg:justify-start gap-1.5 mx-auto lg:mx-0">
                  {t('signup.microcopy')}
                </p>
              </div>
            )}
            
            {isLoggedIn && (
              <div className="flex justify-center lg:justify-start">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="h-12 px-8 rounded-md bg-gradient-to-r from-[#8a00ff] to-[#5000ff] hover:from-[#9a00ff] hover:to-[#6000ff] text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                >
                  {t('signup.dashboard')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Right column: Zodiac selection */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-black/50 backdrop-blur-lg border border-purple-900/50 rounded-2xl p-6 shadow-xl shadow-purple-900/20">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white">{t('signup.profile')}</h2>
                <p className="text-sm text-slate-400">{t('signup.select')}</p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {zodiacSignNames.map((sign) => (
                  <button
                    key={sign.value}
                    onClick={() => navigate(`/auth?signup=true&sign=${sign.value}`)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
                  >
                    <div className="text-2xl mb-1">
                      {sign.value === 'aries' && '♈'}
                      {sign.value === 'taurus' && '♉'}
                      {sign.value === 'gemini' && '♊'}
                      {sign.value === 'cancer' && '♋'}
                      {sign.value === 'leo' && '♌'}
                      {sign.value === 'virgo' && '♍'}
                      {sign.value === 'libra' && '♎'}
                      {sign.value === 'scorpio' && '♏'}
                      {sign.value === 'sagittarius' && '♐'}
                      {sign.value === 'capricorn' && '♑'}
                      {sign.value === 'aquarius' && '♒'}
                      {sign.value === 'pisces' && '♓'}
                    </div>
                    <span className="text-xs text-slate-300 truncate w-full text-center">
                      {sign.label}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => navigate('/auth?signup=true')}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-md mt-2"
                  variant="secondary"
                >
                  {t('signup.get')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {[
              { text: t('signup.benefits.insights') },
              { text: t('signup.benefits.wellness') },
              { text: t('signup.benefits.forecasts') },
              { text: t('signup.benefits.rituals') }
            ].map((benefit, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-purple-500/10 p-1 mr-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-sm text-slate-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};