import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HoroscopeContent, ZodiacSign, SubscriptionStatus, SubscriptionTier } from '@shared/types';
import { format } from 'date-fns';
import { PremiumReport } from '@/components/PremiumReport';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Clock, Flame, Droplets, Flower, Wind } from 'lucide-react';

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  zodiacSign: ZodiacSign;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  subscriptionEndDate?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract user data from localStorage for demo purposes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    } else {
      // Redirect to home if no user data is found
      setLocation('/');
    }
  }, [setLocation]);

  // Fetch today's horoscope
  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!user?.zodiacSign) return;

      try {
        setIsLoading(true);
        const date = format(new Date(), 'yyyy-MM-dd');
        const response = await fetch(`/api/horoscope/${user.zodiacSign}?date=${date}`);
        const data = await response.json();

        if (data.success) {
          setHoroscope(data.content);
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to load horoscope',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        toast({
          title: 'Error',
          description: 'Failed to load horoscope',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [user, toast]);

  const elementIconMap: Record<string, any> = {
    fire: <Flame className="h-5 w-5 text-red-500" />,
    water: <Droplets className="h-5 w-5 text-blue-500" />,
    earth: <Flower className="h-5 w-5 text-green-500" />,
    air: <Wind className="h-5 w-5 text-purple-500" />
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email.substring(0, 2).toUpperCase();

  const getZodiacEmoji = (sign: ZodiacSign): string => {
    const emojis: Record<ZodiacSign, string> = {
      aries: '♈',
      taurus: '♉',
      gemini: '♊',
      cancer: '♋',
      leo: '♌',
      virgo: '♍',
      libra: '♎',
      scorpio: '♏',
      sagittarius: '♐',
      capricorn: '♑',
      aquarius: '♒',
      pisces: '♓'
    };
    return emojis[sign] || '✨';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName ? `${user.firstName}'s Dashboard` : 'Your Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {getZodiacEmoji(user.zodiacSign)} {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)} • {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {user.subscriptionTier === 'premium' && user.subscriptionStatus === 'active' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Premium Member</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">Daily Horoscope</TabsTrigger>
          <TabsTrigger value="premium">Weekly Premium Report</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </CardContent>
            </Card>
          ) : horoscope ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Daily Health Horoscope</CardTitle>
                  <CardDescription>
                    Astrological health insights for {format(new Date(), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" /> Daily Overview
                    </h3>
                    <p className="mt-2">{horoscope.overview}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {elementIconMap[horoscope.elementAlignment.toLowerCase()] || <Sparkles className="h-5 w-5 text-primary" />}
                      Element Alignment
                    </h3>
                    <p className="mt-2">{horoscope.elementAlignment}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" /> Health Tip of the Day
                    </h3>
                    <p className="mt-2">{horoscope.healthTip}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold">Nutritional Focus</h3>
                    <p className="mt-2">{horoscope.nutritionFocus}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Could not load horoscope. Please try again later.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="premium">
          <PremiumReport 
            email={user.email}
            zodiacSign={user.zodiacSign}
            subscriptionStatus={user.subscriptionStatus}
            subscriptionTier={user.subscriptionTier}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}