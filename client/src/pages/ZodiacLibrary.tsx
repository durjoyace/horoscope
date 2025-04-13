import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
  Users2 as Users
} from 'lucide-react';

import ZodiacWheel from '@/components/ZodiacWheel';
import ZodiacCompatibility from '@/components/ZodiacCompatibility';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames, zodiacWellnessRecommendations } from '@/data/zodiacData';

export default function ZodiacLibrary() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [activeTab, setActiveTab] = useState('overview');
  const [view, setView] = useState<'wheel' | 'compatibility'>('wheel');
  
  // Add missing properties to all zodiac signs
  const zodiacSignsData = zodiacSignNames.map(sign => ({
    ...sign,
    modality: sign.modality || 'Fixed',
    rulingPlanet: sign.rulingPlanet || sign.planet || 'Unknown',
    traits: sign.traits || 'Unique, Powerful, Adaptive, Versatile',
    healthFocus: sign.healthFocus || 'Overall wellness and balance'
  }));
  
  const selectedSignData = zodiacSignsData.find(sign => sign.value === selectedSign);
  const wellnessData = zodiacWellnessRecommendations[selectedSign] || {
    strength: 'Natural vitality and energy',
    challenge: 'Finding balance in daily routines',
    recommendation: 'Balance activity with rest for optimal wellness'
  };

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
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Zodiac Wellness Library
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore zodiac signs and discover personalized wellness insights aligned with your astrological profile
        </p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-muted p-1 rounded-lg">
          <button 
            onClick={() => setView('wheel')} 
            className={`px-4 py-2.5 rounded-md flex items-center gap-2 text-sm md:text-base font-medium transition-colors ${
              view === 'wheel' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Zodiac Wheel</span>
          </button>
          
          <button 
            onClick={() => setView('compatibility')} 
            className={`px-4 py-2.5 rounded-md flex items-center gap-2 text-sm md:text-base font-medium transition-colors ${
              view === 'compatibility' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Compatibility Calculator</span>
          </button>
        </div>
      </div>
      
      {/* Content based on selected view */}
      {view === 'wheel' ? (
        <>
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
                              <li className="flex items-start">
                                <span className="text-green-500 mr-2">•</span> Focus on whole foods that support your natural {selectedSignData.element.toLowerCase()} element
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-500 mr-2">•</span> Stay hydrated with water infused with herbs aligned with your sign
                              </li>
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
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span> {selectedSignData.element === 'Fire' ? 'High-intensity interval training and competitive sports' : 
                                 selectedSignData.element === 'Earth' ? 'Strength training and hiking in nature' :
                                 selectedSignData.element === 'Air' ? 'Dance, tai chi, and activities that combine movement with mind' :
                                 'Swimming, fluid movement practices like yoga flow, and water sports'}
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span> Exercise outdoors when possible to connect with natural elements
                              </li>
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
                              <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span> {selectedSignData.element === 'Fire' ? 'Cool down with gentle breathwork and moonlight meditation' : 
                                 selectedSignData.element === 'Earth' ? 'Release tension with massage and sound therapy' :
                                 selectedSignData.element === 'Air' ? 'Ground yourself with weighted blankets and earthing practices' :
                                 'Create emotional boundaries with journaling and safe space visualization'}
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span> Schedule regular mental health check-ins on your calendar
                              </li>
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
                              <li className="flex items-start">
                                <span className="text-amber-500 mr-2">•</span> Set intentions aligned with your zodiac strengths each morning
                              </li>
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
                    
                    <TabsContent value="compatibility" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Most Compatible Signs</h3>
                          <ul className="space-y-3">
                            {selectedSignData.element === 'Fire' && (
                              <>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♌</span>
                                  <div>
                                    <p className="font-medium">Leo</p>
                                    <p className="text-sm text-muted-foreground">Fellow fire sign - mutual energy and passion</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♐</span>
                                  <div>
                                    <p className="font-medium">Sagittarius</p>
                                    <p className="text-sm text-muted-foreground">Complementary fire elements create harmony</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♒</span>
                                  <div>
                                    <p className="font-medium">Aquarius</p>
                                    <p className="text-sm text-muted-foreground">Air feeds fire for a stimulating connection</p>
                                  </div>
                                </li>
                              </>
                            )}
                            {selectedSignData.element === 'Earth' && (
                              <>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♉</span>
                                  <div>
                                    <p className="font-medium">Taurus</p>
                                    <p className="text-sm text-muted-foreground">Shared earth element brings stability</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♍</span>
                                  <div>
                                    <p className="font-medium">Virgo</p>
                                    <p className="text-sm text-muted-foreground">Practical and grounded connection</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♓</span>
                                  <div>
                                    <p className="font-medium">Pisces</p>
                                    <p className="text-sm text-muted-foreground">Water nourishes earth for balanced growth</p>
                                  </div>
                                </li>
                              </>
                            )}
                            {selectedSignData.element === 'Air' && (
                              <>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♊</span>
                                  <div>
                                    <p className="font-medium">Gemini</p>
                                    <p className="text-sm text-muted-foreground">Intellectual stimulation and communication</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♎</span>
                                  <div>
                                    <p className="font-medium">Libra</p>
                                    <p className="text-sm text-muted-foreground">Shared air element creates harmony</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♈</span>
                                  <div>
                                    <p className="font-medium">Aries</p>
                                    <p className="text-sm text-muted-foreground">Air fans fire for passionate exchange</p>
                                  </div>
                                </li>
                              </>
                            )}
                            {selectedSignData.element === 'Water' && (
                              <>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♋</span>
                                  <div>
                                    <p className="font-medium">Cancer</p>
                                    <p className="text-sm text-muted-foreground">Emotional depth and intuitive connection</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♏</span>
                                  <div>
                                    <p className="font-medium">Scorpio</p>
                                    <p className="text-sm text-muted-foreground">Intense emotional and spiritual bond</p>
                                  </div>
                                </li>
                                <li className="flex items-center gap-2 bg-muted rounded-md p-3">
                                  <span className="text-2xl">♉</span>
                                  <div>
                                    <p className="font-medium">Taurus</p>
                                    <p className="text-sm text-muted-foreground">Water nourishes earth for growth</p>
                                  </div>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Wellness Partnership Insights</h3>
                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <h4 className="font-medium mb-2">Health & Wellness Partnerships</h4>
                            <p className="text-muted-foreground mb-3">
                              {selectedSignData.label} individuals benefit from wellness partnerships with {
                                selectedSignData.element === 'Fire' ? 'Air signs who can provide mental clarity and perspective' :
                                selectedSignData.element === 'Earth' ? 'Water signs who bring emotional depth to your routine' :
                                selectedSignData.element === 'Air' ? 'Fire signs who motivate and energize your approach' :
                                'Earth signs who help ground your intuitive insights'
                              }.
                            </p>
                            <p className="text-muted-foreground">
                              Your ideal wellness accountability partner will complement your {selectedSignData.element.toLowerCase()} element 
                              by providing balance to your natural tendencies.
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium">Best Activities to Share</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span> 
                                {selectedSignData.element === 'Fire' ? 'Competitive sports with air signs for mental strategy' :
                                 selectedSignData.element === 'Earth' ? 'Nature hikes with water signs for emotional connection' :
                                 selectedSignData.element === 'Air' ? 'Creative movement classes with fire signs for energy' :
                                 'Intuitive cooking with earth signs for grounding'}
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span> 
                                {selectedSignData.element === 'Fire' ? 'Meditation retreats with water signs for emotional balance' :
                                 selectedSignData.element === 'Earth' ? 'Spontaneous adventure with fire signs for energy' :
                                 selectedSignData.element === 'Air' ? 'Journaling workshops with water signs for emotional depth' :
                                 'Practical goal-setting with earth signs for structure'}
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span> Regular check-ins with your astrological complement
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <p className="text-muted-foreground mb-3">
                          For a more personalized compatibility analysis, use our full compatibility calculator below.
                        </p>
                        <Button variant="outline" className="mb-2" onClick={() => setView('compatibility')}>
                          <Heart className="h-4 w-4 mr-2" /> Open Compatibility Calculator
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        /* Compatibility Calculator View */
        <div className="mb-10 md:mb-20 relative">
          {/* Background gradient for visual appeal */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 rounded-3xl -z-10"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full translate-y-1/4 -translate-x-1/4 blur-2xl"></div>
          
          <div className="pt-10 pb-12 px-4 md:px-8 md:pt-12 md:pb-16 rounded-3xl border border-primary/10">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center mb-4 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
                Featured Tool
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Zodiac Compatibility Calculator
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how different signs interact in relationships, friendships, and wellness partnerships
              </p>
            </div>
            
            <div className="px-0 md:px-4 lg:px-8">
              <ZodiacCompatibility />
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-3">
                Want more detailed compatibility insights?
              </p>
              <Button className="bg-gradient-to-r from-[#8a00ff] to-[#5000ff] text-white">
                Get Premium Analysis
              </Button>
            </div>
          </div>
          
          {/* Additional information about compatibility */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" /> Love Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Understand how your zodiac sign's traits influence romantic relationships and 
                  find your most harmonious love matches based on astrological elements and modalities.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" /> Friendship Dynamics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover which zodiac signs naturally complement your social energy and learn how
                  to navigate potential conflicts based on elemental and planetary influences.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" /> Wellness Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find ideal wellness accountability partners based on zodiac compatibility, 
                  and learn which signs can help you achieve balance in your health journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Disclaimer and legal section */}
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p className="mb-2">For entertainment purposes only. Results should not replace professional health advice.</p>
        <p>© {new Date().getFullYear()} Battle Green Consulting LLC. All rights reserved.</p>
      </div>
    </div>
  );
}