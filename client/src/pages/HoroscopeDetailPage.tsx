import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames, zodiacElements } from '@/data/zodiacData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Heart, 
  Users, 
  Dumbbell, 
  Leaf, 
  Brain,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { format } from 'date-fns';

export default function HoroscopeDetailPage() {
  const [match, params] = useRoute('/horoscope/:sign');
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const sign = params?.sign as ZodiacSign;
  const signData = zodiacSignNames.find(s => s.value === sign);
  // Get element data for the sign
  const getElementForSign = (zodiacSign: ZodiacSign) => {
    const fireElements = ['aries', 'leo', 'sagittarius'];
    const earthElements = ['taurus', 'virgo', 'capricorn'];
    const airElements = ['gemini', 'libra', 'aquarius'];
    const waterElements = ['cancer', 'scorpio', 'pisces'];
    
    if (fireElements.includes(zodiacSign)) return { name: 'Fire', color: 'Red' };
    if (earthElements.includes(zodiacSign)) return { name: 'Earth', color: 'Green' };
    if (airElements.includes(zodiacSign)) return { name: 'Air', color: 'Yellow' };
    if (waterElements.includes(zodiacSign)) return { name: 'Water', color: 'Blue' };
    return { name: 'Unknown', color: 'Purple' };
  };
  
  const elementData = getElementForSign(sign);

  // Fetch horoscope data
  const { data: horoscopeData, isLoading } = useQuery({
    queryKey: ['/api/horoscope', sign, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await fetch(`/api/horoscope/${sign}?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch horoscope');
      return response.json();
    },
    enabled: !!sign
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  if (!match || !sign || !signData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Horoscope Not Found</h1>
          <p className="text-gray-400">The requested zodiac sign could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
          <div className="absolute -top-40 right-60 transform w-96 h-96 rounded-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 left-40 transform w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-800 to-indigo-900 blur-3xl opacity-30"></div>
          <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">{signData.symbol}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                {signData.label}
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                {signData.dates} • {elementData?.name} Element
              </p>
            </div>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="border-purple-500/50 hover:bg-purple-900/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Card className="bg-gray-900/50 border border-purple-500/30 px-6 py-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="font-medium">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
            </Card>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="border-purple-500/50 hover:bg-purple-900/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Horoscope Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </motion.div>
                  <span className="text-lg">Consulting the stars...</span>
                </div>
              </motion.div>
            ) : horoscopeData ? (
              <motion.div
                key={format(selectedDate, 'yyyy-MM-dd')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-purple-500/30">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                      <Star className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="wellness" className="data-[state=active]:bg-purple-600">
                      <Heart className="h-4 w-4 mr-2" />
                      Wellness
                    </TabsTrigger>
                    <TabsTrigger value="mindfulness" className="data-[state=active]:bg-purple-600">
                      <Brain className="h-4 w-4 mr-2" />
                      Mind
                    </TabsTrigger>
                    <TabsTrigger value="compatibility" className="data-[state=active]:bg-purple-600">
                      <Users className="h-4 w-4 mr-2" />
                      Social
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Sun className="h-5 w-5 mr-3 text-amber-400" />
                          Daily Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-purple-300 mb-3">
                            {horoscopeData.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {horoscopeData.content}
                          </p>
                        </div>
                        
                        {horoscopeData.elementAlignment && (
                          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-300 mb-2 flex items-center">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Elemental Alignment
                            </h4>
                            <p className="text-purple-200">
                              {horoscopeData.elementAlignment}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="wellness" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center text-white">
                            <Heart className="h-5 w-5 mr-3 text-red-400" />
                            Health Focus
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 leading-relaxed">
                            {horoscopeData.wellness}
                          </p>
                        </CardContent>
                      </Card>

                      {horoscopeData.nutrition && (
                        <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center text-white">
                              <Leaf className="h-5 w-5 mr-3 text-green-400" />
                              Nutrition Guidance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 leading-relaxed">
                              {horoscopeData.nutrition}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {horoscopeData.fitness && (
                        <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center text-white">
                              <Dumbbell className="h-5 w-5 mr-3 text-blue-400" />
                              Fitness Recommendations
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 leading-relaxed">
                              {horoscopeData.fitness}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center text-white">
                            <Star className="h-5 w-5 mr-3 text-purple-400" />
                            Lucky Elements
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Lucky Color:</span>
                            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                              {elementData?.color || 'Cosmic Purple'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Element:</span>
                            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                              {elementData?.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Energy Level:</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="mindfulness" className="mt-6">
                    <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Moon className="h-5 w-5 mr-3 text-indigo-400" />
                          Mindfulness & Mental Wellness
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {horoscopeData.mindfulness ? (
                          <div>
                            <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                              Today's Mindfulness Practice
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              {horoscopeData.mindfulness}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                              Recommended Mindfulness Practice
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              As a {signData.label}, today is perfect for grounding meditation. 
                              Spend 10 minutes focusing on your breath and connecting with your inner wisdom. 
                              {elementData?.name === 'Fire' && ' Channel your passionate energy into focused intention.'}
                              {elementData?.name === 'Earth' && ' Let your natural stability guide you to peace.'}
                              {elementData?.name === 'Air' && ' Allow your thoughts to flow freely without judgment.'}
                              {elementData?.name === 'Water' && ' Trust your intuitive feelings to guide your practice.'}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
                          <h4 className="font-semibold text-indigo-300 mb-4">Quick Meditation</h4>
                          <div className="space-y-3 text-sm text-indigo-200">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                              Find a quiet, comfortable space
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                              Close your eyes and breathe deeply
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                              Focus on your {elementData?.name.toLowerCase()} energy
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                              Set a positive intention for your day
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="compatibility" className="mt-6">
                    <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Users className="h-5 w-5 mr-3 text-pink-400" />
                          Social & Relationship Energy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-pink-300 mb-3">
                            Today's Social Forecast
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            Your {elementData?.name} energy is influencing your social connections today. 
                            {elementData?.name === 'Fire' && ' Your natural charisma and enthusiasm will draw others to you. Great day for leadership and inspiring others.'}
                            {elementData?.name === 'Earth' && ' Your grounded presence offers stability to those around you. Perfect time for meaningful, practical conversations.'}
                            {elementData?.name === 'Air' && ' Your communication skills are heightened. Ideal for networking, brainstorming, and intellectual exchanges.'}
                            {elementData?.name === 'Water' && ' Your emotional intelligence and empathy are your superpowers today. Deep, heartfelt connections await.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-green-300 mb-2">Harmonious Signs Today</h4>
                            <div className="flex flex-wrap gap-2">
                              {elementData?.compatibleSigns?.map(compatibleSign => {
                                const compatibleSignData = zodiacSignNames.find(s => s.value === compatibleSign);
                                return (
                                  <Badge key={compatibleSign} variant="outline" className="border-green-500/50 text-green-300">
                                    {compatibleSignData?.symbol} {compatibleSignData?.label}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-300 mb-2">Growth Opportunities</h4>
                            <p className="text-amber-200 text-sm">
                              Challenge yourself to connect with signs that think differently. 
                              Their perspectives can offer valuable insights for your personal growth.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      No Horoscope Available
                    </h3>
                    <p className="text-gray-300">
                      We're working on generating your personalized horoscope for this date. 
                      Please try again in a few moments.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation to other signs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-white">
                Explore Other Zodiac Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {zodiacSignNames.map(otherSign => (
                  <a
                    key={otherSign.value}
                    href={`/horoscope/${otherSign.value}`}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                      otherSign.value === sign 
                        ? 'bg-purple-600/50 border border-purple-400' 
                        : 'hover:bg-purple-900/30 border border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{otherSign.symbol}</span>
                    <span className="text-xs font-medium text-center text-gray-300">
                      {otherSign.label}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}