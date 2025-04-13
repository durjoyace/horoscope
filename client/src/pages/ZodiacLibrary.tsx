import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  BookOpen,
  Heart,
  Star,
  Sparkles,
  Info,
  User,
  Puzzle,
  Activity,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import ZodiacWheel from '@/components/ZodiacWheel';
import ZodiacCompatibility from '@/components/ZodiacCompatibility';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames, zodiacWellnessRecommendations } from '@/data/zodiacData';

export default function ZodiacLibrary() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add missing properties to all zodiac signs
  const zodiacSignsData = zodiacSignNames.map(sign => ({
    ...sign,
    modality: sign.modality || 'Fixed',
    rulingPlanet: sign.rulingPlanet || sign.planet,
    traits: sign.traits || 'Unique, Powerful, Adaptive, Versatile',
    healthFocus: sign.healthFocus || 'Overall wellness and balance'
  }));
  
  const selectedSignData = zodiacSignsData.find(sign => sign.value === selectedSign);
  const wellnessData = zodiacWellnessRecommendations[selectedSign];

  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Fire': return 'bg-red-100 text-red-600';
      case 'Earth': return 'bg-green-100 text-green-600';
      case 'Air': return 'bg-blue-100 text-blue-600';
      case 'Water': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Zodiac Wellness Library
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore zodiac signs and discover personalized wellness insights aligned with your astrological profile
        </p>
      </div>
      
      {/* Interactive Zodiac Wheel */}
      <div className="mb-10 md:mb-20">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl md:text-2xl">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" /> 
              Interactive Zodiac Wheel
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Click on any sign to explore its detailed profile and wellness insights
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-2 md:p-6">
            <div>
              <ZodiacWheel
                onSelectSign={setSelectedSign}
                activeSigns={selectedSign ? [selectedSign] : []}
                highlightElements={true}
                size={window.innerWidth < 768 ? "sm" : "lg"}
              />
              
              {/* Sign labels for mobile view */}
              {window.innerWidth < 768 && (
                <div className="grid grid-cols-4 gap-2 mt-6 text-center">
                  {zodiacSignNames.map(sign => (
                    <Button 
                      key={sign.value}
                      variant="ghost" 
                      size="sm"
                      className={`flex flex-col items-center p-2 h-auto ${
                        selectedSign === sign.value ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setSelectedSign(sign.value as ZodiacSign)}
                    >
                      <span className="text-lg">{sign.symbol}</span>
                      <span className="text-xs">{sign.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Zodiac Sign Details */}
      {selectedSignData && (
        <div className="mb-10 md:mb-20">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 md:p-4 rounded-full ${getElementColor(selectedSignData.element)}`}>
                    <span className="text-2xl md:text-3xl">{selectedSignData.symbol}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl lg:text-3xl">{selectedSignData.label}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs md:text-sm">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" /> 
                      {selectedSignData.dates}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`mt-2 sm:mt-0 ${getElementColor(selectedSignData.element)}`}>
                  {selectedSignData.element} Element
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4 md:mb-6">
                  <TabsTrigger value="overview" className="text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                    <Info className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> 
                    <span className="hidden sm:inline">Overview</span>
                    <span className="sm:hidden">Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="wellness" className="text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                    <Activity className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> 
                    <span className="hidden sm:inline">Wellness Profile</span>
                    <span className="sm:hidden">Wellness</span>
                  </TabsTrigger>
                  <TabsTrigger value="compatibility" className="text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                    <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> 
                    <span className="hidden sm:inline">Compatibility</span>
                    <span className="sm:hidden">Matches</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Personality & Traits
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {selectedSignData.traits}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" /> Astrological Profile
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-sm font-medium">Element</p>
                            <p className="text-muted-foreground">{selectedSignData.element}</p>
                          </div>
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-sm font-medium">Modality</p>
                            <p className="text-muted-foreground">{selectedSignData.modality}</p>
                          </div>
                        </div>
                        <div className="bg-muted rounded-md p-3">
                          <p className="text-sm font-medium">Ruling Planet</p>
                          <p className="text-muted-foreground">{selectedSignData.rulingPlanet}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Health & Wellness Focus
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {selectedSignData.healthFocus}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" /> Key Strengths
                      </h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span> {selectedSignData.label} individuals are naturally gifted
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span> Excellent at adapting to new situations
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span> 
                          {selectedSignData.element === 'Fire' ? 'Passionate and energetic' : 
                           selectedSignData.element === 'Earth' ? 'Practical and reliable' :
                           selectedSignData.element === 'Air' ? 'Intellectual and communicative' :
                           'Intuitive and emotionally aware'}
                        </li>
                      </ul>
                      
                      <h3 className="text-lg font-medium mt-4 mb-3 flex items-center gap-2">
                        <Puzzle className="h-5 w-5 text-primary" /> Challenges
                      </h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">!</span> May struggle with consistency
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">!</span> Can be resistant to change
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">!</span> 
                          {selectedSignData.element === 'Fire' ? 'Can be impulsive and short-tempered' : 
                           selectedSignData.element === 'Earth' ? 'May become overly stubborn or materialistic' :
                           selectedSignData.element === 'Air' ? 'Sometimes detached or overthinking' :
                           'Can be overly sensitive or moody'}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Sun className="h-5 w-5 text-amber-500" /> 
                      <Moon className="h-5 w-5 text-blue-500" /> 
                      Horoscope Health Balance Tip
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedSignData.element === 'Fire' && 
                        "As a Fire sign, balance your abundant energy with calming activities and mindful rest. Your passionate nature is a gift, but remember to nurture your emotional wellbeing through grounding practices."}
                      {selectedSignData.element === 'Earth' && 
                        "Earth signs thrive with structure, but don't forget to embrace spontaneity occasionally. Your practical approach to wellness should include time for joy and play alongside your disciplined routines."}
                      {selectedSignData.element === 'Air' && 
                        "Your mental energy needs regular grounding. Balance intellectual pursuits with physical activity and sensory experiences. Remember to move from thinking to feeling regularly for holistic wellness."}
                      {selectedSignData.element === 'Water' && 
                        "Your emotional sensitivity is your superpower, but boundaries are essential. Create regular emotional clearing practices and seek physical activities that help channel your intense feelings constructively."}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="wellness" className="space-y-6">
                  <p className="text-muted-foreground">
                    Based on your {selectedSignData.element} element and {selectedSignData.modality} modality, these wellness recommendations are customized to harmonize with your {selectedSignData.label} energy.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="nutrition">
                      <AccordionTrigger>Nutrition Recommendations</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">•</span> {wellnessData.recommendation}
                          </li>
                          {wellnessData.nutritionTips && wellnessData.nutritionTips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="exercise">
                      <AccordionTrigger>Ideal Exercise Types</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span> {wellnessData.strength}
                          </li>
                          {wellnessData.exerciseTypes && wellnessData.exerciseTypes.map((exercise, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span> {exercise}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="relaxation">
                      <AccordionTrigger>Relaxation Methods</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span> Focus on {wellnessData.challenge}
                          </li>
                          {wellnessData.relaxationMethods && wellnessData.relaxationMethods.map((method, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span> {method}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="daily">
                      <AccordionTrigger>Daily Wellness Habits</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-amber-500 mr-2">•</span> {wellnessData.challenge} - focus area
                          </li>
                          <li className="flex items-start">
                            <span className="text-amber-500 mr-2">•</span> {wellnessData.recommendation}
                          </li>
                          {wellnessData.dailyWellnessHabits && wellnessData.dailyWellnessHabits.map((habit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-500 mr-2">•</span> {habit}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium mb-2">Want a Deeper Wellness Analysis?</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to our premium membership for personalized weekly health forecasts and customized wellness plans based on your full astrological profile.
                    </p>
                    <Button>
                      Explore Premium Membership
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="compatibility">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      {selectedSignData.label} naturally resonates with certain zodiac energies. Discover how your sign interacts with others in relationships, friendships, and wellness partnerships.
                    </p>
                    
                    <ZodiacCompatibility initialSign1={selectedSign} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between px-4 md:px-6 pb-4 md:pb-6">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs md:text-sm"
                onClick={() => {
                  const currentIndex = zodiacSignNames.findIndex(s => s.value === selectedSign);
                  const prevIndex = (currentIndex - 1 + zodiacSignNames.length) % zodiacSignNames.length;
                  setSelectedSign(zodiacSignNames[prevIndex].value);
                }}
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="hidden xs:inline">Previous Sign</span>
                <span className="xs:hidden">Prev</span>
              </Button>
              <Button
                size="sm"
                className="text-xs md:text-sm"
                onClick={() => {
                  const currentIndex = zodiacSignNames.findIndex(s => s.value === selectedSign);
                  const nextIndex = (currentIndex + 1) % zodiacSignNames.length;
                  setSelectedSign(zodiacSignNames[nextIndex].value);
                }}
              >
                <span className="hidden xs:inline">Next Sign</span>
                <span className="xs:hidden">Next</span>
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-1 md:ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Compatibility Calculator */}
      <div className="mb-10 md:mb-20">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Zodiac Compatibility Calculator</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover how different signs interact in relationships, friendships, and wellness partnerships
          </p>
        </div>
        
        <div className="px-2 md:px-0">
          <ZodiacCompatibility />
        </div>
      </div>
    </div>
  );
}