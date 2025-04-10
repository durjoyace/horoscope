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
  Leaf
} from 'lucide-react';
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
    
    setIsSubmitting(true);
    
    try {
      // This would make an API call in a complete app
      const userData = {
        email,
        zodiacSign: selectedSign,
        subscriptionStatus: 'none',
        subscriptionTier: 'free'
      };
      
      // Store in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (onUserRegistered) {
        onUserRegistered(userData);
      }
      
      toast({
        title: 'Welcome to HoroscopeHealth!',
        description: 'Your daily health horoscopes will start arriving soon.',
      });
      
      // In a complete app, this would redirect to a dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'An error occurred during signup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-primary/20 via-primary/10 to-background star-bg">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 rounded-full bg-[#8B5CF6]/10 backdrop-blur-md animate-float"></div>
          <div className="absolute top-40 right-10 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full bg-[#3B82F6]/10 backdrop-blur-md animate-float-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-full bg-[#8B5CF6]/10 backdrop-blur-md animate-float-slower"></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full bg-[#3B82F6]/10 backdrop-blur-md animate-pulse"></div>
          
          {/* Constellation-like elements */}
          <div className="absolute inset-0 opacity-30 select-none pointer-events-none">
            <div className="absolute top-1/4 left-1/5 h-1 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-1/3 right-1/4 h-1.5 w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute bottom-1/3 left-1/3 h-1 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-2/3 right-1/5 h-1.5 w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-1/2 left-1/2 h-1 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          </div>
          
          {/* Zodiac Symbols Background - more subtle and modern */}
          <div className="absolute inset-0 opacity-5 select-none pointer-events-none">
            <div className="absolute top-1/4 left-1/5 text-3xl sm:text-4xl md:text-6xl transform rotate-12">♈</div>
            <div className="absolute top-1/3 right-1/4 text-3xl sm:text-5xl md:text-7xl transform -rotate-6">♉</div>
            <div className="absolute bottom-1/4 left-1/3 text-3xl sm:text-4xl md:text-5xl transform rotate-45">♌</div>
            <div className="absolute top-2/3 right-1/5 text-3xl sm:text-5xl md:text-8xl transform -rotate-12">♓</div>
            <div className="absolute top-1/2 left-1/2 text-3xl sm:text-4xl md:text-6xl transform rotate-90">♎</div>
          </div>
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-background/40 text-primary px-2.5 sm:px-3 py-1.5 sm:py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 sm:mb-6 md:mb-8 backdrop-blur-md border border-primary/20 shadow-sm animate-fade-in">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                <span>Where Ancient Wisdom Meets Modern Science</span>
              </div>
              
              <h1 className="magazine-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 md:mb-6 animate-slide-up">
                <span className="block">Your Personalized</span>
                <span className="gradient-heading">Horoscope Health Guide</span>
              </h1>
              
              <p className="magazine-lead text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-delay">
                Discover how your zodiac sign influences your health tendencies and receive daily personalized wellness recommendations based on your astrological profile.
              </p>
              
              {!isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start animate-slide-up-delay">
                  <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="shadow-sm border-primary/20 text-sm"
                    />
                    <Button type="submit" disabled={isSubmitting} className="shadow-md hover:shadow-lg transition-all text-sm">
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Signing Up</span>
                          <div className="h-3 w-3 md:h-4 md:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        'Get Started'
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-all animate-pulse">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-[320px] md:max-w-md">
                {/* Decorative cosmic elements */}
                <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-[#ff00ff]/20 via-[#c300ff]/10 to-[#3a00ff]/20 rounded-lg transform rotate-6 animate-pulse-slow"></div>
                <div className="absolute -inset-4 md:-inset-6 border-2 border-[#ff00ff]/10 rounded-lg transform -rotate-3 animate-pulse-slower"></div>
                <div className="absolute -inset-1 md:-inset-2 border border-[#c300ff]/20 rounded-full animate-spin-slow"></div>
                
                {/* Main card */}
                <div className="relative backdrop-blur-md rounded-lg p-4 md:p-6 lg:p-8 shadow-xl animate-fade-in-up bg-gradient-to-br from-[#8400ff]/30 to-[#3a00ff]/30 border border-[#c300ff]/40">
                  <div className="text-center mb-4 md:mb-6">
                    <div className="p-2 md:p-3 bg-[#ff00ff]/20 rounded-full inline-flex justify-center items-center mb-3 md:mb-4">
                      <Star className="h-6 w-6 md:h-8 md:w-8 text-[#ff00ff] animate-spin-slow" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1">Your Horoscope Health Profile</h2>
                    <p className="text-sm text-muted-foreground">Select your zodiac sign to begin</p>
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
                        className="w-full shadow-md hover:shadow-lg transition-all text-sm"
                        disabled={!email}
                        onClick={handleSignup}
                      >
                        Get My Horoscope
                      </Button>
                    </div>
                  )}
                </div>
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
              SCIENCE MEETS ASTROLOGY
            </h2>
            <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
              How Horoscope Health Works
            </h2>
            <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
              Our unique methodology bridges ancient astrological wisdom with modern health science
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard 
              icon={<Star className="h-full w-full" />}
              title="Astrological Analysis"
              description="We analyze your zodiac sign's elemental constitution, planetary rulers, and traditional health associations to understand your innate tendencies."
              dialogContent={{
                sections: [
                  {
                    title: "Your Cosmic Blueprint",
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
              title="Scientific Integration"
              description="Our team combines astrological insights with evidence-based wellness research to create recommendations that honor both systems."
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
              title="Personalized Guidance"
              description="You receive daily horoscopes with specific health and wellness recommendations tailored to your sign's unique constitution and current cosmic influences."
              dialogContent={{
                sections: [
                  {
                    title: "Daily Health Horoscopes",
                    content: "Every day, you'll receive personalized health insights based on your zodiac sign and current planetary alignments. These include specific wellness categories relevant to your cosmic energy that day."
                  },
                  {
                    title: "Actionable Recommendations",
                    content: "Your daily horoscope includes practical tips for nutrition, exercise, stress management, and self-care that are specifically aligned with your astrological profile and current cosmic influences."
                  },
                  {
                    title: "Elemental Balance",
                    content: "Our guidance helps you understand how to balance your dominant elemental energies (Fire, Earth, Air, Water) through specific wellness practices, foods, and activities to achieve optimal wellbeing."
                  }
                ]
              }}
            />
          </div>
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/science">
                Learn About Our Methodology
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
              ELEMENTAL ANALYSIS
            </h2>
            <h2 className="magazine-heading text-3xl md:text-4xl mb-4">
              Elemental Health Insights
            </h2>
            <p className="magazine-lead text-muted-foreground max-w-2xl mx-auto">
              Each zodiac sign belongs to one of four elements, influencing your health tendencies and wellness needs
            </p>
          </div>
          
          <div className="flex justify-center mb-6">
            <Link href="/elements" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
              <Info className="h-4 w-4" />
              <span>Explore all elements</span>
            </Link>
          </div>
        
          <Tabs defaultValue="fire" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 w-full gap-1">
              <TabsTrigger value="fire" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Flame className="h-4 w-4 text-red-500" /> 
                <span className="hidden sm:inline">Fire</span>
              </TabsTrigger>
              <TabsTrigger value="earth" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Leaf className="h-4 w-4 text-green-600" /> 
                <span className="hidden sm:inline">Earth</span>
              </TabsTrigger>
              <TabsTrigger value="air" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Wind className="h-4 w-4 text-purple-500" /> 
                <span className="hidden sm:inline">Air</span>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 h-auto py-2">
                <Droplets className="h-4 w-4 text-blue-500" /> 
                <span className="hidden sm:inline">Water</span>
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
                Our premium membership unlocks deeper wellness insights and personalized guidance for your cosmic health journey.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Weekly Premium Reports</h3>
                    <p className="text-muted-foreground">
                      Receive comprehensive wellness forecasts with detailed recommendations for nutrition, fitness, and self-care based on your sign's current cosmic influences.
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
                      <Link href="/dashboard">
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
              Real stories from people who transformed their wellness through cosmic insights
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
      <section className="py-20 md:py-28 cosmic-gradient star-bg relative overflow-hidden">
        {/* Cosmic elements for the CTA */}
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