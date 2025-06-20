import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'wouter';
import { Star, CalendarDays, Activity, Droplets, Gift, Lock, ChevronRight, Award } from 'lucide-react';
import { AchievementBadgeContainer } from '@/components/AchievementBadgeContainer';
import { AchievementBadgeProps } from '@/components/AchievementBadge';
import SocialSharing from '@/components/SocialSharing';
import { ReferralBanner } from '@/components/ReferralBanner';

// Mock user data
const mockUser = {
  name: "Aria Wilson",
  email: "aria@example.com",
  zodiacSign: "libra",
  avatar: "/assets/avatar.png",
  memberSince: "2023-10-15",
  isPremium: false,
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("today");
  
  // Mock achievement data
  const latestAchievements: AchievementBadgeProps[] = [
    {
      type: 'streak',
      level: 1,
      name: t('badge.streak.1.name'),
      description: t('badge.streak.1.description'),
      isNew: true,
      earnedDate: '2024-02-15',
    },
    {
      type: 'zodiac',
      level: 1,
      name: t('badge.zodiac.1.name'),
      description: t('badge.zodiac.1.description'),
      earnedDate: '2024-02-10',
    },
  ];
  
  const allAchievements: AchievementBadgeProps[] = [
    ...latestAchievements,
    {
      type: 'cosmic',
      level: 1,
      name: t('badge.cosmic.1.name'),
      description: t('badge.cosmic.1.description'),
      earnedDate: '2024-01-20',
    },
  ];
  
  // Mock horoscope data
  const mockHoroscope = {
    sign: "libra",
    date: "2024-04-12",
    forecast: "Today, your cosmic alignment suggests a focus on balance in your physical activities. Consider alternating between cardio and flexibility exercises. Your ruling planet Venus enhances your natural inclination toward harmony - embrace activities that bring joy while maintaining wellness. Hydration is especially important for you today.",
    focus: "Balance & Flexibility",
    recommended: "Yoga, light stretching, maintaining electrolyte balance",
    avoid: "Overexertion, skipping meals",
    element: "air",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {t('dashboard.title')}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t('dashboard.for')} <span className="font-medium text-foreground">{mockUser.name}</span>
      </p>
      
      {/* Referral Banner */}
      <ReferralBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main column - Horoscope and Tabs */}
        <div className="md:col-span-2 space-y-6">
          {/* Horoscope Card */}
          <Card className="backdrop-blur-md border-primary/20 bg-gradient-to-br from-background/70 to-background/90">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{t('dashboard.horoscope.title')}</CardTitle>
                  <CardDescription>{t('dashboard.horoscope.description')}</CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                {mockHoroscope.forecast}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold mb-1">Focus Areas:</p>
                  <p className="text-muted-foreground">{mockHoroscope.focus}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Recommended:</p>
                  <p className="text-muted-foreground">{mockHoroscope.recommended}</p>
                </div>
              </div>
              
              {/* Social Sharing */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <SocialSharing 
                  title={`${mockUser.zodiacSign.charAt(0).toUpperCase() + mockUser.zodiacSign.slice(1)} Horoscope for ${new Date().toLocaleDateString()}`}
                  text={mockHoroscope.forecast}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Tabbed Content */}
          <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="today">{t('dashboard.tab.today')}</TabsTrigger>
              <TabsTrigger value="week">{t('dashboard.tab.week')}</TabsTrigger>
              <TabsTrigger value="month">{t('dashboard.tab.month')}</TabsTrigger>
            </TabsList>
            
            {/* Today's Content */}
            <TabsContent value="today" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.widget.calendar')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm font-medium">{t('dashboard.weather')}: Harmonious</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('dashboard.widget.metrics')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">Active Streak</p>
                        <p className="text-sm font-medium">7 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.widget.element')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <Droplets className="h-5 w-5 text-sky-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Air Element Influence</p>
                      <p className="text-sm mb-1">
                        As an Air sign, intellectual pursuits and communication benefit your wellness today. 
                        Consider activities that engage your mind while maintaining physical balance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievement Badges Section */}
              <Card className="border-primary/20 bg-gradient-to-br from-background/70 to-background/90">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span>Cosmic Achievements</span>
                      </CardTitle>
                      <CardDescription>Your astrological wellness journey progress</CardDescription>
                    </div>
                    <Link href="/achievements" className="text-sm text-primary flex items-center hover:underline">
                      View all <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <AchievementBadgeContainer badges={latestAchievements} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Weekly Content */}
            <TabsContent value="week" className="space-y-4">
              <Card className="border border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t('dashboard.premium.weekly.title')} 
                    <span className="bg-yellow-600/20 text-yellow-600 text-xs px-2 py-0.5 rounded-full ml-2">
                      {t('dashboard.premium.locked')}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {t('dashboard.premium.weekly.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                    {t('dashboard.premium.unlock')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Monthly Content */}
            <TabsContent value="month" className="space-y-4">
              <Card className="border border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t('dashboard.premium.monthly.title')}
                    <span className="bg-yellow-600/20 text-yellow-600 text-xs px-2 py-0.5 rounded-full ml-2">
                      {t('dashboard.premium.locked')}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {t('dashboard.premium.monthly.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                    {t('dashboard.premium.unlock')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar column */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{mockUser.name}</CardTitle>
              <CardDescription>{mockUser.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-muted rounded-md p-2">
                  <p className="text-muted-foreground mb-1">Zodiac Sign</p>
                  <p className="font-medium capitalize">{mockUser.zodiacSign}</p>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <p className="text-muted-foreground mb-1">Element</p>
                  <p className="font-medium">Air</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-center text-muted-foreground">
                  Member since {new Date(mockUser.memberSince).toLocaleDateString()}
                </p>
              </div>
              
              {!mockUser.isPremium && (
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  {t('premium.upgrade')}
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Achievement Progress */}
          <Card className="bg-gradient-to-br from-background/90 to-background/70 border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> 
                Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Streak Mastery</span>
                    <span>1/3</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[33%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Zodiac Knowledge</span>
                    <span>1/3</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[33%]"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Wellness Journey</span>
                    <span>0/3</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[0%]"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link href="/achievements">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View All Achievements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Promo */}
          {!mockUser.isPremium && (
            <Card className="bg-gradient-to-br from-violet-950/30 to-indigo-950/30 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                        {t('premium.badge')}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Unlock deeper cosmic wellness insights
                    </CardDescription>
                  </div>
                  <Gift className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs mb-4">
                  <li className="flex items-start">
                    <Star className="h-3 w-3 text-primary mr-2 mt-0.5" />
                    Weekly in-depth zodiac health reports
                  </li>
                  <li className="flex items-start">
                    <Star className="h-3 w-3 text-primary mr-2 mt-0.5" />
                    Personalized wellness rituals
                  </li>
                  <li className="flex items-start">
                    <Star className="h-3 w-3 text-primary mr-2 mt-0.5" />
                    Cosmic achievement badge exclusives
                  </li>
                </ul>
                <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                  {t('premium.button')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;