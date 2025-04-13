import { useState } from 'react';
import { 
  Star, 
  HeartPulse, 
  Brain, 
  MoveRight, 
  Info, 
  Award, 
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  Flame,
  Droplets,
  Wind,
  Leaf,
  Gift,
  ListChecks,
  Calendar,
  Quote,
  Activity,
  RefreshCw,
  Rocket,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { WellnessQuoteWidget } from '@/components/WellnessQuoteWidget';
import { FeatureCard } from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodiacSignNames } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface HomeProps {
  onUserRegistered?: (userData: any) => void;
  isLoggedIn?: boolean;
}

const elementIcons = {
  'Fire': <Flame className="h-5 w-5 text-red-500" />,
  'Earth': <Leaf className="h-5 w-5 text-green-600" />,
  'Air': <Wind className="h-5 w-5 text-purple-500" />,
  'Water': <Droplets className="h-5 w-5 text-blue-500" />
};

export default function Home({ onUserRegistered, isLoggedIn = false }: HomeProps) {
  const [email, setEmail] = useState('');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !selectedSign) {
      toast({
        title: 'Missing information',
        description: 'Please provide your email and select your zodiac sign.',
        variant: 'destructive',
      });
      return;
    }
    
    // Store user data in localStorage for the registration form
    const userDataToStore = {
      email,
      zodiacSign: selectedSign
    };
    localStorage.setItem('user', JSON.stringify(userDataToStore));
    console.log('Storing initial user data:', userDataToStore);
    
    setIsSubmitting(true);
    
    try {
      // Make an API call to register the user
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          zodiacSign: selectedSign,
          smsOptIn: false,
          newsletterOptIn: true,
          // A temporary password for the user account
          password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      const userData = await response.json();
      console.log('Signup successful:', userData);
      
      // Also store in localStorage after successful signup
      const finalUserData = {
        email,
        zodiacSign: selectedSign,
        registrationComplete: true
      };
      localStorage.setItem('user', JSON.stringify(finalUserData));
      console.log('Updated user data in localStorage after signup:', finalUserData);
      
      if (onUserRegistered) {
        onUserRegistered(userData);
      }
      
      toast({
        title: 'Welcome to HoroscopeHealth!',
        description: 'Your daily health horoscopes will start arriving soon.',
      });
      
      // Store success message in localStorage for the auth page
      localStorage.setItem('signupSuccess', 'true');
      
      // Redirect to auth page to complete full profile
      setTimeout(() => {
        window.location.href = '/auth?signup=true';
      }, 800); // Small delay to ensure localStorage is set
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - Modern cosmic-wellness design with pizzazz */}
      <section className="relative py-10 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Dynamic background with energy - using black and purple tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900 overflow-hidden">
          {/* Vibrant, energetic shapes with purple cosmic palette */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-soft-light">
            <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-gradient-to-r from-purple-700 to-violet-700 blur-2xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-700 to-purple-700 blur-2xl animate-pulse-slower"></div>
            <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-fuchsia-700 to-purple-800 blur-2xl animate-pulse"></div>
          </div>
          
          {/* Modern geometric patterns with motion */}
          <div className="absolute inset-0 select-none pointer-events-none">
            <div className="absolute top-1/4 right-1/5 w-24 h-1 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 opacity-60 transform rotate-45 animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-1/4 w-24 h-1 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 opacity-60 transform -rotate-45 animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-2/3 w-32 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 opacity-60 transform rotate-12 animate-pulse-slow"></div>
            
            {/* Subtle cosmic symbols */}
            <div className="absolute top-1/3 right-1/3 text-purple-400 opacity-10 text-6xl transform rotate-12">✦</div>
            <div className="absolute bottom-1/4 left-1/4 text-violet-400 opacity-10 text-6xl transform -rotate-12">✧</div>
          </div>
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs md:text-sm font-medium mb-6 sm:mb-8 md:mb-10 border border-purple-500/30 shadow-md animate-fade-in">
                <Activity className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                <span className="tracking-wide">{t('hero.tagline')}</span>
              </div>
              
              {/* Dynamic branded header with cosmic gradient text */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-5 animate-fade-in-delay relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
                  {t('hero.brand')}
                </span>
                <div className="absolute -bottom-1.5 left-0 w-24 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"></div>
              </h1>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-5 md:mb-7 text-slate-100 font-medium animate-fade-in-delay-2">
                <span className="block">{t('hero.title1')}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">{t('hero.title2')}</span>
              </h1>
              
              <p className="magazine-lead text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-7 md:mb-9 max-w-xl mx-auto lg:mx-0 animate-fade-in-delay-3 leading-relaxed">
                {t('hero.description')}
              </p>
              
              {!isLoggedIn ? (
                <div className="animate-slide-up-delay">
                  <form onSubmit={handleSignup} className="w-full max-w-md">
                    {/* Integrated benefits + signup card */}
                    <div className="max-w-md mx-auto">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                        {t('signup.header')}
                      </h3>
                      
                      {/* Main signup card with benefits inside - Modern wellness style */}
                      <div className="relative max-w-md mx-auto">
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 mb-6 shadow-lg">
                          {/* Email input with compelling benefits */}
                          <div className="space-y-6">
                            <div className="text-center space-y-2">
                              <h4 className="text-white text-xl font-bold mb-1">
                                {t('signup.title')}
                              </h4>
                              <p className="text-white/80 text-sm">
                                {t('signup.subtitle')}
                              </p>
                            </div>

                            {/* Clean, modern email input with cosmic style */}
                            <div className="relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/30 to-fuchsia-400/30 rounded-full blur-sm opacity-60"></div>
                              <Input
                                type="email"
                                placeholder={t('signup.email.placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="relative pl-10 h-14 bg-white/10 backdrop-blur-sm border-white/40 text-white placeholder:text-white/70 rounded-full focus:border-white/70 focus:ring-white/30 shadow-md"
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/90" />
                            </div>
                            
                            {/* Zodiac sign selector - ADDING THIS */}
                            <div className="mt-4">
                              <h5 className="text-white font-medium mb-2">Select your zodiac sign:</h5>
                              <div className="grid grid-cols-4 gap-2">
                                {zodiacSignNames.map((sign) => (
                                  <Button
                                    key={sign.value}
                                    variant={selectedSign === sign.value ? "default" : "outline"}
                                    className={`p-1 h-auto flex flex-col gap-0.5 transition-all duration-300 ${
                                      selectedSign === sign.value 
                                        ? "bg-primary text-white shadow-md scale-105" 
                                        : "bg-black/20 text-white hover:border-white/70"
                                    }`}
                                    onClick={() => setSelectedSign(sign.value as ZodiacSign)}
                                  >
                                    <span className="text-lg">{sign.symbol}</span>
                                    <span className="text-[9px]">{sign.label}</span>
                                  </Button>
                                ))}
                              </div>
                              {selectedSign && (
                                <div className="mt-2 text-center animate-fade-in">
                                  <p className="text-white text-sm">
                                    Selected: <span className="font-bold">{zodiacSignNames.find(s => s.value === selectedSign)?.label}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {/* Premium benefits with cosmic icons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="flex items-start space-x-2">
                                <Brain className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white text-sm">{t('signup.benefits.insights')}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Sparkles className="h-5 w-5 text-fuchsia-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white text-sm">{t('signup.benefits.wellness')}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Activity className="h-5 w-5 text-violet-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white text-sm">{t('signup.benefits.forecasts')}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Star className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white text-sm">{t('signup.benefits.rituals')}</span>
                              </div>
                            </div>

                            {/* Cosmic-styled CTA Button */}
                            <div className="relative mt-4 group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/60 to-fuchsia-400/60 rounded-full opacity-70 group-hover:opacity-100 blur-sm transition duration-300"></div>
                              <Button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="relative w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold text-base sm:text-lg rounded-full transition-all duration-300 border border-white/20 shadow-md group-hover:shadow-lg"
                                aria-label={t('signup.button')}
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    <span className="whitespace-nowrap text-sm sm:text-base">{t('signup.button.loading')}</span>
                                  </div>
                                ) : (
                                  <span className="whitespace-nowrap text-sm sm:text-base">{t('signup.button')}</span>
                                )}
                              </Button>
                            </div>
                            
                            {/* Persuasive microcopy */}
                            <div className="text-center space-y-2 mt-1">
                              <div className="flex items-center justify-center gap-1.5 text-white/90 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                                <span>{t('signup.microcopy')}</span>
                              </div>
                              <p className="text-white/60 text-xs italic">
                                {t('signup.testimonial')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all animate-pulse bg-gradient-to-r from-[#c300ff] to-[#8400ff] h-12 px-6 font-medium">
                    <Link href="/dashboard">{t('signup.dashboard')}</Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="shadow-md hover:shadow-lg hover:scale-[1.02] transition-all border-[#c300ff] text-[#c300ff] hover:bg-[#c300ff] hover:text-white h-12 px-6 font-medium"
                    asChild
                  >
                    <Link href="/onboarding">
                      <span className="flex items-center justify-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('onboarding.welcome.start')}
                      </span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-[320px] md:max-w-md">
                {/* Cosmic decorative elements */}
                <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10 rounded-lg transform rotate-3 animate-pulse-slow"></div>
                <div className="absolute -inset-4 md:-inset-6 border-2 border-purple-500/10 rounded-lg transform -rotate-1 animate-pulse-slower"></div>
                <div className="absolute -inset-1 md:-inset-2 border border-indigo-500/10 rounded-full animate-spin-slow"></div>
                
                {/* Main card - Cosmic styled */}
                <div className="relative backdrop-blur-md rounded-lg p-4 md:p-6 lg:p-8 shadow-xl animate-fade-in-up bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30">
                  <div className="text-center mb-4 md:mb-6">
                    <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full inline-flex justify-center items-center mb-3 md:mb-4">
                      <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-400 animate-pulse" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1 text-slate-100">{t('zodiac.profile.title')}</h2>
                    <p className="text-sm text-purple-200/80">{t('zodiac.profile.subtitle')}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
                    {zodiacSignNames.map((sign) => (
                      <Button
                        key={sign.value}
                        variant={selectedSign === sign.value ? "default" : "outline"}
                        className={`p-1.5 md:p-2 h-auto flex flex-col gap-0.5 md:gap-1 transition-all duration-300 ${
                          selectedSign === sign.value 
                            ? "shadow-md scale-105 md:scale-110 border-primary" 
                            : "hover:border-primary/50 hover:scale-105"
                        }`}
                        onClick={() => setSelectedSign(sign.value as ZodiacSign)}
                      >
                        <span className="text-lg md:text-xl">{sign.symbol}</span>
                        <span className="text-[10px] md:text-xs">{sign.label}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {selectedSign && (
                    <div className="text-center animate-fade-in">
                      <p className="font-medium mb-1 md:mb-2 text-sm md:text-base">
                        {zodiacSignNames.find(s => s.value === selectedSign)?.label}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                        {zodiacSignNames.find(s => s.value === selectedSign)?.dates}
                      </p>
                      <Button 
                        className="w-full shadow-md hover:shadow-lg transition-all text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02]"
                        onClick={() => {
                          // Scroll to email input if email is not provided
                          if (!email) {
                            const emailInput = document.querySelector('input[type="email"]');
                            if (emailInput) {
                              emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              (emailInput as HTMLElement).focus();
                              toast({
                                title: t('toast.email.required.title'),
                                description: t('toast.email.required.description'),
                                variant: 'default',
                              });
                            }
                          } else {
                            handleSignup(new Event('click') as unknown as React.FormEvent);
                          }
                        }}
                      >
                        {t('zodiac.profile.button')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Journey Section */}
      <section className="py-16 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              <span>{t('journey.badge')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('journey.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('journey.description')}
            </p>
            
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-full opacity-70 group-hover:opacity-100 blur-md transition duration-300"></div>
              <Button 
                size="lg" 
                asChild
                className="relative bg-gradient-to-r from-[#8a00ff] to-[#5000ff] hover:from-[#9a00ff] hover:to-[#6000ff] text-white font-bold px-6 sm:px-8 py-5 sm:py-6 rounded-full transition-all duration-300 border border-white/20 shadow-[0_0_20px_rgba(170,0,255,0.5)] group-hover:shadow-[0_0_25px_rgba(170,0,255,0.7)] hover:scale-105"
                aria-label={t('onboarding.welcome.start')}
              >
                <Link href="/onboarding">
                  <span className="flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t('onboarding.welcome.start')}
                  </span>
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-5 rounded-lg backdrop-blur-sm shadow-md">
                <div className="bg-purple-500/20 rounded-full p-3 inline-flex mb-4">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-100">{t('journey.step1.title')}</h3>
                <p className="text-sm text-slate-300">{t('journey.step1.description')}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-5 rounded-lg backdrop-blur-sm shadow-md">
                <div className="bg-purple-500/20 rounded-full p-3 inline-flex mb-4">
                  <Star className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-100">{t('journey.step2.title')}</h3>
                <p className="text-sm text-slate-300">{t('journey.step2.description')}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-5 rounded-lg backdrop-blur-sm shadow-md">
                <div className="bg-purple-500/20 rounded-full p-3 inline-flex mb-4">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-100">{t('journey.step3.title')}</h3>
                <p className="text-sm text-slate-300">{t('journey.step3.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="magazine-subheading mb-2">
              {t('how.title')}
            </h2>
            <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
              {t('how.heading')}
            </h2>
            <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
              {t('how.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard 
              icon={<Star className="h-full w-full" />}
              title={t('how.card1.title')}
              description={t('how.card1.description')}
              dialogContent={{
                sections: [
                  {
                    title: "Your Zodiac Blueprint",
                    content: "We analyze your zodiac sign's elemental constitution (Fire, Earth, Air, or Water), planetary rulers, and traditional health associations to create a comprehensive profile of your innate health tendencies."
                  },
                  {
                    title: "Personalized Analysis",
                    content: "Each zodiac sign has unique strengths and vulnerabilities in different body systems. For example, Aries rules the head and brain, while Taurus governs the throat and neck. We use these traditional correspondences to provide targeted health insights."
                  },
                  {
                    title: "Temporal Influences",
                    content: "We track how current planetary movements interact with your natal chart to identify times when certain health aspects need more attention or when you have natural advantages in particular wellness areas."
                  }
                ]
              }}
            />
            
            <FeatureCard 
              icon={<Brain className="h-full w-full" />}
              title={t('how.card2.title')}
              description={t('how.card2.description')}
              dialogContent={{
                sections: [
                  {
                    title: "Evidence-Based Practices",
                    content: "We combine traditional astrological wisdom with modern scientific understanding of nutrition, fitness, sleep science, stress management, and preventive health to create truly holistic recommendations."
                  },
                  {
                    title: "Our Research Methodology",
                    content: "Our team of experts includes both certified astrologists and healthcare professionals who work together to develop recommendations that are both astronomically aligned and scientifically sound."
                  },
                  {
                    title: "Continuous Improvement",
                    content: "We continuously review the latest wellness research and medical studies to ensure our recommendations remain current while still honoring the ancient wisdom of astrological health associations."
                  }
                ]
              }}
            />
            
            <FeatureCard 
              icon={<HeartPulse className="h-full w-full" />}
              title={t('how.card3.title')}
              description={t('how.card3.description')}
              dialogContent={{
                sections: [
                  {
                    title: "Daily Health Horoscopes",
                    content: "Every day, you'll receive personalized health insights based on your zodiac sign and current planetary alignments. These include specific wellness categories relevant to your zodiac energy that day."
                  },
                  {
                    title: "Actionable Recommendations",
                    content: "Your daily horoscope includes practical tips for nutrition, exercise, stress management, and self-care that are specifically aligned with your astrological profile and current celestial influences."
                  },
                  {
                    title: "Elemental Balance",
                    content: "Our guidance helps you understand how to balance your dominant elemental energies (Fire, Earth, Air, Water) through specific wellness practices, foods, and activities to achieve optimal wellbeing."
                  }
                ]
              }}
            />
          </div>
          
          {/* Daily Wellness Quote */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="magazine-subheading mb-2">
                {t('quote.title')}
              </h2>
              <h2 className="magazine-heading text-2xl md:text-3xl mb-4">
                {t('quote.heading')}
              </h2>
              <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
                {t('quote.subheading')}
              </p>
            </div>
            
            <div className="max-w-lg mx-auto">
              {/* Import the WellnessQuoteWidget at the top of the file */}
              <WellnessQuoteWidget zodiacSign={selectedSign as ZodiacSign || undefined} isPersonalized={!!selectedSign} />
              
              {!selectedSign && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {t('quote.select')}
                </p>
              )}
            </div>
          </div>
          
          {/* Premium membership promotion - Cosmic style */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-lg relative overflow-hidden">
              {/* Cosmic background elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left side: Content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{t('premium.badge')}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-100">{t('premium.title')}</h3>
                    
                    <p className="text-slate-300 mb-6">
                      {t('premium.description')}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-200">{t('premium.benefit1')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-200">{t('premium.benefit2')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-200">{t('premium.benefit3')}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      asChild 
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transition-all hover:scale-105"
                      aria-label={t('premium.button')}
                    >
                      <Link href="/premium">
                        <span className="flex items-center whitespace-nowrap">
                          {t('premium.button')}
                          <MoveRight className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Right side: Pricing */}
                  <div className="md:w-64 flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-5 border border-purple-500/20 backdrop-blur-sm">
                      <h4 className="text-lg font-bold mb-1 text-slate-100">{t('premium.plan.title')}</h4>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">$9.99</span>
                        <span className="text-purple-200/80">{t('premium.plan.period')}</span>
                      </div>
                      <ul className="space-y-2 mb-5">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-purple-400" />
                          <span className="text-slate-200">{t('premium.plan.feature1')}</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-purple-400" />
                          <span className="text-slate-200">{t('premium.plan.feature2')}</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-purple-400" />
                          <span className="text-slate-200">{t('premium.plan.feature3')}</span>
                        </li>
                      </ul>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full border-purple-500/50 text-white hover:bg-purple-500/10 hover:text-purple-300 transition-all hover:border-purple-400/70"
                        aria-label={t('premium.plan.button')}
                      >
                        <Link href="/premium">
                          <span className="whitespace-nowrap text-sm">{t('premium.plan.button')}</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" asChild className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-400/50 transition-all">
              <Link href="/science">
                {t('methodology.button')}
                <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Elements & Health */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="magazine-subheading mb-2">
              {t('elements.title')}
            </h2>
            <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
              {t('elements.heading')}
            </h2>
            <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
              {t('elements.description')}
            </p>
          </div>
          
          <div className="flex justify-center mb-6">
            <Link href="/elements" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>{t('elements.explore')}</span>
            </Link>
          </div>
        
          <Tabs defaultValue="fire" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 w-full gap-1">
              <TabsTrigger value="fire" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Flame className="h-4 w-4 text-red-500" /> 
                <span className="hidden sm:inline">{t('elements.fire')}</span>
              </TabsTrigger>
              <TabsTrigger value="earth" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Leaf className="h-4 w-4 text-green-600" /> 
                <span className="hidden sm:inline">{t('elements.earth')}</span>
              </TabsTrigger>
              <TabsTrigger value="air" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Wind className="h-4 w-4 text-purple-500" /> 
                <span className="hidden sm:inline">{t('elements.air')}</span>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Droplets className="h-4 w-4 text-blue-500" /> 
                <span className="hidden sm:inline">{t('elements.water')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fire">
              <Card>
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl flex-wrap">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    <span>Fire Signs:</span> <span className="font-normal text-sm sm:text-base">Aries, Leo, Sagittarius</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Dynamic, energetic, and passionate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Health Tendencies</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>High metabolic rate and natural vitality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Quick recovery from illness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Tendency toward inflammation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Risk of burnout when overextended</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Wellness Recommendations</h4>
                    <p className="mb-4">
                      Fire signs benefit from activities that channel their abundant energy while preventing burnout and inflammation.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Nutrition</h5>
                        <p className="text-sm text-muted-foreground">
                          Cooling foods and anti-inflammatory herbs
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Movement</h5>
                        <p className="text-sm text-muted-foreground">
                          High-intensity interval training balanced with recovery
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Balance</h5>
                        <p className="text-sm text-muted-foreground">
                          Regular relaxation practices to prevent overheating
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earth">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Earth Signs: Taurus, Virgo, Capricorn
                  </CardTitle>
                  <CardDescription>
                    Grounded, practical, and enduring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Health Tendencies</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Strong physical constitution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Excellent endurance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Need for consistent routines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Tendency toward stagnation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Wellness Recommendations</h4>
                    <p className="mb-4">
                      Earth signs thrive with structured routines and grounding practices that prevent stagnation.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Nutrition</h5>
                        <p className="text-sm text-muted-foreground">
                          High-fiber foods and regular eating schedules
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Movement</h5>
                        <p className="text-sm text-muted-foreground">
                          Strength training and hiking outdoors
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Balance</h5>
                        <p className="text-sm text-muted-foreground">
                          Connection with nature and grounding practices
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="air">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-purple-500" />
                    Air Signs: Gemini, Libra, Aquarius
                  </CardTitle>
                  <CardDescription>
                    Intellectual, communicative, and adaptable
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Health Tendencies</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Mental agility and adaptability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Respiratory system sensitivity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Need for varied stimulation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Tendency toward nervous tension</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Wellness Recommendations</h4>
                    <p className="mb-4">
                      Air signs thrive with varied activities that engage their intellect while supporting nervous system balance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Nutrition</h5>
                        <p className="text-sm text-muted-foreground">
                          Brain-supportive nutrients and regular small meals
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Movement</h5>
                        <p className="text-sm text-muted-foreground">
                          Varied workouts and breathwork practices
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Balance</h5>
                        <p className="text-sm text-muted-foreground">
                          Mind-calming techniques and adequate sleep
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="water">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Water Signs: Cancer, Scorpio, Pisces
                  </CardTitle>
                  <CardDescription>
                    Intuitive, emotional, and receptive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Health Tendencies</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Strong immune intuition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Emotional sensitivity affecting physical health</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Digestive system reactivity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Need for emotional processing</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Wellness Recommendations</h4>
                    <p className="mb-4">
                      Water signs benefit from practices that support emotional wellbeing and fluid balance within the body.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Nutrition</h5>
                        <p className="text-sm text-muted-foreground">
                          Hydrating foods and digestive support
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Movement</h5>
                        <p className="text-sm text-muted-foreground">
                          Water-based activities and gentle flowing movement
                        </p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <h5 className="font-medium mb-1">Balance</h5>
                        <p className="text-sm text-muted-foreground">
                          Emotional processing and boundary practices
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="magazine-subheading mb-2">
                ENHANCED HOROSCOPE INSIGHTS
              </h2>
              <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
                Beyond Daily Horoscopes
              </h2>
              <p className="magazine-lead mb-8 text-muted-foreground">
                Our premium membership unlocks deeper wellness insights and personalized guidance for your astrological health journey.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Weekly Premium Reports</h3>
                    <p className="text-muted-foreground">
                      Receive comprehensive wellness forecasts with detailed recommendations for nutrition, fitness, and self-care based on your sign's current celestial influences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Personalized Product Recommendations</h3>
                    <p className="text-muted-foreground">
                      Discover wellness products specifically aligned with your zodiac sign's constitution and current needs through our curated marketplace.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <HeartPulse className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Health Compatibility Insights</h3>
                    <p className="text-muted-foreground">
                      Learn which zodiac signs complement your wellness journey and how to optimize relationships for mutual health support.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Explore Premium Features
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Daily Inspiration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-3 text-muted-foreground">
                      Your Aries horoscope for today:
                    </p>
                    <p className="font-medium">
                      "Focus on high-intensity workouts followed by proper hydration today. Your fire energy peaks in the afternoon."
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      Fire Energy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-3 font-medium">Your Element Alignment</p>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">75% aligned with your natural element</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Wellness Focus</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Cardiovascular strength</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Anti-inflammatory nutrition</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Stress management</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Weekly Forecast</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">Premium Feature</p>
                    <p className="font-medium mt-2">
                      Unlock detailed weekly health forecasts with premium membership
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2" asChild>
                      <Link href="/premium">
                        <span>Upgrade</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="magazine-subheading mb-2">
              USER EXPERIENCES
            </h2>
            <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
              What Our Members Say
            </h2>
            <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who transformed their wellness through astrological insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 inline-block text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "After years of trying different wellness approaches, HoroscopeHealth finally helped me understand my Taurus constitution and why I need consistency and grounding practices. The daily recommendations have transformed my energy levels."
                </p>
                <div className="font-medium">Michael R.</div>
                <div className="text-sm text-muted-foreground">Taurus</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 inline-block text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "The premium weekly reports have been game-changing for my wellness routine. As a Gemini, I need variety, and the personalized recommendations keep me engaged while actually supporting my air element needs. Love this service!"
                </p>
                <div className="font-medium">Sarah K.</div>
                <div className="text-sm text-muted-foreground">Gemini</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 inline-block text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "As a skeptical Capricorn, I wasn't sure about astrological health advice, but the scientific approach won me over. The earth sign recommendations for bone health and structural fitness align perfectly with what my body needs."
                </p>
                <div className="font-medium">Jennifer L.</div>
                <div className="text-sm text-muted-foreground">Capricorn</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 zodiac-gradient star-bg relative overflow-hidden">
        {/* Celestial elements for the CTA */}
        <div className="absolute inset-0 opacity-30 select-none pointer-events-none">
          <div className="absolute top-1/4 right-1/3 h-1 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          <div className="absolute bottom-1/2 left-1/4 h-1.5 w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          <div className="absolute top-2/3 right-1/4 h-1 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center backdrop-blur-sm py-10 px-6 rounded-xl">
            <h2 className="magazine-subheading mb-2">
              BEGIN YOUR JOURNEY
            </h2>
            <h2 className="magazine-heading text-3xl md:text-5xl mb-6">
              Discover Your Horoscope Health Path
            </h2>
            <p className="magazine-lead text-muted-foreground mb-8">
              Join thousands of members receiving personalized daily health horoscopes tailored to their zodiac sign
            </p>
            
            {!isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isSubmitting || !selectedSign}>
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Signing Up</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground mt-4">
              Free daily horoscopes. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}