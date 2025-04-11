import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Star, 
  CalendarDays, 
  BarChart3, 
  Sparkles, 
  Compass, 
  Settings,
  RefreshCw,
  Sun,
  Moon,
  Cloud
} from 'lucide-react';
import { ZodiacSign } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WellnessQuoteWidget } from '@/components/WellnessQuoteWidget';

const Dashboard = () => {
  const [userData, setUserData] = useState<{
    zodiacSign: ZodiacSign;
    email: string;
    subscriptionTier: 'free' | 'premium';
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  
  // Faux weather/cosmic data for UI demonstration
  const [cosmicWeather] = useState({
    moonPhase: 'Waxing Crescent',
    lunarDay: 4,
    sunSign: 'Aries',
    dominantPlanet: 'Mars',
    weather: 'clear',
    temperature: 72
  });

  useEffect(() => {
    // Simulate loading user data
    const checkForStoredUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData({
            zodiacSign: parsedUser.zodiacSign || 'aries',
            email: parsedUser.email || 'user@example.com',
            subscriptionTier: parsedUser.subscriptionTier || 'free'
          });
        } catch (e) {
          console.error('Failed to parse stored user data', e);
        }
      }
      setIsLoading(false);
    };
    
    // Simulate API call delay
    setTimeout(checkForStoredUser, 800);
  }, []);

  const getWeatherIcon = () => {
    switch (cosmicWeather.weather) {
      case 'clear': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'night': return <Moon className="h-6 w-6 text-indigo-400" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your cosmic dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-5 p-8">
          <Star className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Welcome to Horoscope Health</h1>
          <p className="text-muted-foreground">Please sign in or register to access your personalized cosmic health dashboard.</p>
          <div className="flex gap-4 justify-center mt-6">
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Cosmic Wellness Dashboard</h1>
          <p className="text-muted-foreground">
            Personalized for <span className="capitalize">{userData.zodiacSign}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 flex items-center gap-3">
              {getWeatherIcon()}
              <div>
                <p className="text-sm font-medium">{cosmicWeather.temperature}°</p>
                <p className="text-xs text-muted-foreground">Cosmic Weather</p>
              </div>
            </CardContent>
          </Card>
          
          {userData.subscriptionTier === 'free' && (
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/premium">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                <span>Upgrade to Premium</span>
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Date tabs */}
      <Tabs defaultValue={activeTab} className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">Monthly Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Horoscope Card - Placeholder */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Your Daily Horoscope</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">April 11, 2025</p>
                </div>
                <CardDescription>Cosmic insights tailored to your zodiac sign</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder content */}
                <div className="space-y-4">
                  <p>
                    Today's celestial alignment brings a focus on your physical wellbeing, <span className="capitalize">{userData.zodiacSign}</span>. 
                    The position of Mars suggests elevated energy levels, making this an ideal day for cardiovascular activities.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-primary/5 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium">Energy</p>
                      <div className="flex justify-center mt-1">
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium">Focus</p>
                      <div className="flex justify-center mt-1">
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/10"></div>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium">Creativity</p>
                      <div className="flex justify-center mt-1">
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium">Balance</p>
                      <div className="flex justify-center mt-1">
                        <div className="w-8 h-1.5 rounded-full bg-primary/40"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/10"></div>
                        <div className="w-8 h-1.5 rounded-full bg-primary/10"></div>
                      </div>
                    </div>
                  </div>
                  <p>
                    Your wellness tip for today: Focus on hydration and mineral intake to support your
                    natural energy flow. The moon's influence on your element suggests heightened intuition
                    around dietary needs.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Wellness Quote Widget */}
            <WellnessQuoteWidget zodiacSign={userData.zodiacSign} isPersonalized={true} />
          </div>
          
          {/* Additional Dashboard Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">Cosmic Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Moon in {cosmicWeather.moonPhase}</p>
                <p className="text-sm">Lunar Day: {cosmicWeather.lunarDay}</p>
                <p className="text-sm">Sun in {cosmicWeather.sunSign}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Next favorable day: April 15
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">Wellness Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Mindfulness</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full mt-1">
                    <div className="h-2 bg-primary/60 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Activity</span>
                    <span>58%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full mt-1">
                    <div className="h-2 bg-primary/60 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Sleep Quality</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full mt-1">
                    <div className="h-2 bg-primary/60 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">Element Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">
                  {userData.zodiacSign === 'aries' || 
                  userData.zodiacSign === 'leo' || 
                  userData.zodiacSign === 'sagittarius' ? 'Fire' : 
                  userData.zodiacSign === 'taurus' || 
                  userData.zodiacSign === 'virgo' || 
                  userData.zodiacSign === 'capricorn' ? 'Earth' :
                  userData.zodiacSign === 'gemini' || 
                  userData.zodiacSign === 'libra' || 
                  userData.zodiacSign === 'aquarius' ? 'Air' : 'Water'} Element
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Today's focus is on transformation and release. Embrace change with confidence.
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-primary/70" />
                  <span className="text-xs text-primary/70">Aligned with {cosmicWeather.dominantPlanet}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">Weekly Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Your weekly wellness report is {userData.subscriptionTier === 'premium' ? 'available' : 'locked'}.
                </p>
                {userData.subscriptionTier === 'premium' ? (
                  <Button size="sm" variant="default" className="w-full mt-2">
                    View Full Report
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                    <Link href="/premium">
                      <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
                      <span>Unlock with Premium</span>
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="week">
          {userData.subscriptionTier === 'premium' ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Weekly Cosmic Forecast</CardTitle>
                    <p className="text-sm text-muted-foreground">April 11 - April 17, 2025</p>
                  </div>
                  <CardDescription>Extended astrological wellness insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Weekly forecast content for premium users would appear here.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="max-w-md mx-auto">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Unlock Weekly Forecasts</h3>
                <p className="text-muted-foreground mb-6">
                  Upgrade to Premium to access detailed weekly wellness forecasts tailored to your zodiac sign.
                </p>
                <Button asChild>
                  <Link href="/premium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Upgrade to Premium</span>
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="month">
          {userData.subscriptionTier === 'premium' ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Monthly Cosmic Forecast</CardTitle>
                    <p className="text-sm text-muted-foreground">April 2025</p>
                  </div>
                  <CardDescription>Long-term astrological wellness patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Monthly forecast content for premium users would appear here.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="max-w-md mx-auto">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Unlock Monthly Forecasts</h3>
                <p className="text-muted-foreground mb-6">
                  Upgrade to Premium for comprehensive monthly wellness forecasts and planning tools.
                </p>
                <Button asChild>
                  <Link href="/premium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Upgrade to Premium</span>
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;