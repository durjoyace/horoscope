import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { zodiacSignNames, zodiacDescriptions, zodiacElementColors } from '@/data/zodiacData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Heart, 
  Apple, 
  Activity, 
  Dumbbell,
  Flame,
  Leaf,
  Wind,
  Droplets,
  ShieldAlert,
  Lightbulb,
  Users
} from 'lucide-react';

export default function ZodiacLibrary() {
  const [, params] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const signFromUrl = urlParams.get('sign');
  
  const [selectedSign, setSelectedSign] = useState<string>(
    signFromUrl && zodiacSignNames.some(s => s.value === signFromUrl) 
      ? signFromUrl 
      : 'aries'
  );

  const selectedSignData = zodiacSignNames.find(s => s.value === selectedSign);
  const selectedSignDetails = zodiacDescriptions[selectedSign as keyof typeof zodiacDescriptions];
  
  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire':
        return <Flame className={`h-5 w-5 ${zodiacElementColors.Fire}`} />;
      case 'Earth':
        return <Leaf className={`h-5 w-5 ${zodiacElementColors.Earth}`} />;
      case 'Air':
        return <Wind className={`h-5 w-5 ${zodiacElementColors.Air}`} />;
      case 'Water':
        return <Droplets className={`h-5 w-5 ${zodiacElementColors.Water}`} />;
      default:
        return <Sun className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <Sun className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Zodiac Health Library
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the unique health characteristics, strengths, and wellness recommendations for each zodiac sign
        </p>
      </div>

      {/* Zodiac Sign Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {zodiacSignNames.map((sign) => (
          <Button
            key={sign.value}
            variant={selectedSign === sign.value ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setSelectedSign(sign.value)}
          >
            <span className="text-lg">{sign.symbol}</span>
            <span>{sign.label}</span>
          </Button>
        ))}
      </div>

      {/* Selected Sign Info */}
      {selectedSignData && selectedSignDetails && (
        <div className="mb-20">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            {/* Sign Overview */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{selectedSignData.symbol}</div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {selectedSignData.label}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{selectedSignData.dates}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {getElementIcon(selectedSignData.element)}
                      <span className={zodiacElementColors[selectedSignData.element as keyof typeof zodiacElementColors]}>
                        {selectedSignData.element} Element
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-3">{selectedSignDetails.title}</h3>
                  <p className="text-muted-foreground">{selectedSignDetails.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Health Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSignDetails.healthStrengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        Health Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSignDetails.healthChallenges.map((challenge, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Body Associations */}
            <div className="w-full md:w-80 bg-card rounded-lg border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Body Associations
              </h3>
              <ul className="space-y-3">
                {selectedSignDetails.bodyAssociations.map((part, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>{part}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Wellness Tabs */}
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
              <TabsTrigger value="recommendations">Wellness Recommendations</TabsTrigger>
              <TabsTrigger value="food">Ideal Foods</TabsTrigger>
              <TabsTrigger value="activities">Ideal Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Personalized Wellness Recommendations
                  </CardTitle>
                  <CardDescription>
                    Specific wellness strategies aligned with {selectedSignData.label}'s natural tendencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedSignDetails.wellnessRecommendations.map((rec, i) => (
                      <div key={i} className="bg-muted p-4 rounded-lg">
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="food" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Ideal Foods for {selectedSignData.label}
                  </CardTitle>
                  <CardDescription>
                    Nourishing foods that support {selectedSignData.label}'s natural constitution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {selectedSignDetails.idealFoods.map((food, i) => (
                      <div key={i} className="bg-muted p-4 rounded-lg text-center">
                        <p>{food}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    Ideal Activities for {selectedSignData.label}
                  </CardTitle>
                  <CardDescription>
                    Movement practices that align with {selectedSignData.label}'s energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedSignDetails.idealActivities.map((activity, i) => (
                      <div key={i} className="bg-muted p-4 rounded-lg text-center">
                        <p>{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Compatible Signs */}
      {selectedSignData && selectedSignDetails && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Compatible Signs for Wellness Support
          </h2>
          <p className="text-muted-foreground max-w-3xl mb-8">
            These zodiac signs have complementary energies that can support {selectedSignData.label}'s wellness journey. 
            Connecting with people of these signs for health activities can enhance balance and motivation.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {zodiacSignNames
              .filter(sign => 
                sign.value !== selectedSign && 
                zodiacDescriptions[selectedSign as keyof typeof zodiacDescriptions]
                  .healthStrengths.some(strength => 
                    !zodiacDescriptions[sign.value as keyof typeof zodiacDescriptions]
                      .healthChallenges.includes(strength as any)
                  )
              )
              .slice(0, 4)
              .map(sign => (
                <Button 
                  key={sign.value} 
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => setSelectedSign(sign.value)}
                >
                  <span className="text-2xl">{sign.symbol}</span>
                  <span className="font-bold">{sign.label}</span>
                  <span className="text-xs text-muted-foreground">{sign.dates}</span>
                </Button>
              ))
            }
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Get Personalized Daily Health Horoscopes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Sign up now to receive daily wellness insights tailored to your zodiac sign's unique constitution
        </p>
        <Button size="lg" asChild>
          <a href="/">Get Started</a>
        </Button>
      </div>
    </div>
  );
}