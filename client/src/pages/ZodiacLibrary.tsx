import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { zodiacSignNames, elementCharacteristics } from '@/data/zodiacData';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Flame, Droplets, Wind, Leaf, Star, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ZodiacSign } from '@shared/types';

export default function ZodiacLibrary() {
  const [location, setLocation] = useLocation();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<string | null>(null);
  
  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const signParam = params.get('sign');
    if (signParam && zodiacSignNames.some(sign => sign.value === signParam)) {
      setSelectedSign(signParam);
    }
  }, []);

  // Update URL when sign changes
  useEffect(() => {
    if (selectedSign) {
      const params = new URLSearchParams(window.location.search);
      params.set('sign', selectedSign);
      setLocation(`/zodiac-library?${params.toString()}`, { replace: true });
    }
  }, [selectedSign, setLocation]);
  
  // Filter signs based on search query and element filter
  const filteredSigns = zodiacSignNames.filter(sign => {
    const matchesSearch = searchQuery === '' ||
      sign.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.element.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesElement = elementFilter === null || sign.element === elementFilter;
    
    return matchesSearch && matchesElement;
  });
  
  // Get the selected sign data
  const selectedSignData = selectedSign 
    ? zodiacSignNames.find(sign => sign.value === selectedSign) 
    : null;
    
  // Element color mapping
  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire': return 'text-red-600';
      case 'Earth': return 'text-green-600';
      case 'Air': return 'text-purple-600';
      case 'Water': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };
  
  // Element icon mapping with improved styling
  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire': 
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-1.5">
            <Flame className="h-4 w-4 text-red-600" />
          </div>
        );
      case 'Earth': 
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-1.5">
            <Leaf className="h-4 w-4 text-green-700" />
          </div>
        );
      case 'Air': 
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-1.5">
            <Wind className="h-4 w-4 text-purple-700" />
          </div>
        );
      case 'Water': 
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-1.5">
            <Droplets className="h-4 w-4 text-blue-700" />
          </div>
        );
      default: 
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1.5">
            <Star className="h-4 w-4 text-primary" />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Zodiac Health Library</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the health tendencies and wellness recommendations for each zodiac sign, based on astrological elements and cosmic influences.
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by sign or element..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={elementFilter === null ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setElementFilter(null)}
            className="gap-2 rounded-full"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
              <Star className="h-3.5 w-3.5 text-primary" />
            </div>
            <span>All</span>
          </Button>
          <Button 
            variant={elementFilter === 'Fire' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setElementFilter('Fire')}
            className="gap-2 rounded-full"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-1">
              <Flame className="h-3.5 w-3.5 text-red-600" />
            </div>
            <span>Fire</span>
          </Button>
          <Button 
            variant={elementFilter === 'Earth' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setElementFilter('Earth')}
            className="gap-2 rounded-full"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-1">
              <Leaf className="h-3.5 w-3.5 text-green-700" />
            </div>
            <span>Earth</span>
          </Button>
          <Button 
            variant={elementFilter === 'Air' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setElementFilter('Air')}
            className="gap-2 rounded-full"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-1">
              <Wind className="h-3.5 w-3.5 text-purple-700" />
            </div>
            <span>Air</span>
          </Button>
          <Button 
            variant={elementFilter === 'Water' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setElementFilter('Water')}
            className="gap-2 rounded-full"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-1">
              <Droplets className="h-3.5 w-3.5 text-blue-700" />
            </div>
            <span>Water</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sign List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Zodiac Signs</CardTitle>
              <CardDescription>
                {filteredSigns.length} signs found
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {filteredSigns.map((sign) => (
                <Button
                  key={sign.value}
                  variant={selectedSign === sign.value ? "default" : "outline"}
                  onClick={() => setSelectedSign(sign.value)}
                  className="justify-start gap-2 h-auto py-3"
                >
                  <span className="text-xl">{sign.symbol}</span>
                  <div className="text-left">
                    <div>{sign.label}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {getElementIcon(sign.element)}
                      <span>{sign.element} • {sign.dates}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Sign Details */}
        <div className="lg:col-span-2">
          {selectedSignData ? (
            <div className="space-y-8">
              {/* Sign Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-5xl">{selectedSignData.symbol}</div>
                      <div>
                        <CardTitle className="text-3xl">{selectedSignData.label}</CardTitle>
                        <CardDescription>{selectedSignData.dates}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getElementColor(selectedSignData.element)} bg-opacity-10 text-sm px-3 py-1 flex items-center gap-1`}>
                      {getElementIcon(selectedSignData.element)}
                      <span>{selectedSignData.element} Element</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Health Overview</h3>
                    <p className="text-muted-foreground">
                      {selectedSignData.label} is a {selectedSignData.element.toLowerCase()} sign, characterized by {
                        elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].personality.toLowerCase()
                      }. Their primary wellness focus involves {selectedSignData.wellnessFocus.toLowerCase()}.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Health Strengths</h4>
                      <ul className="space-y-2.5">
                        {selectedSignData.healthTraits.map((strength: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Wellness Recommendations</h4>
                      <ul className="space-y-2.5">
                        {selectedSignData.wellnessRecommendations.map((recommendation: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Element Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    {getElementIcon(selectedSignData.element)}
                    <span>{selectedSignData.element} Element Profile</span>
                  </CardTitle>
                  <CardDescription>
                    Astrological element influences on health and wellness
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="personality">
                      <AccordionTrigger>Personality Traits</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].personality}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="strengths">
                      <AccordionTrigger>Element Strengths</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].strengths}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="challenges">
                      <AccordionTrigger>Element Challenges</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].challenges}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="nutrition">
                      <AccordionTrigger>Nutrition Guidelines</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].nutrition}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="movement">
                      <AccordionTrigger>Movement Recommendations</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].movement}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mindfulness">
                      <AccordionTrigger>Mindfulness Practices</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          {elementCharacteristics[selectedSignData.element as keyof typeof elementCharacteristics].mindfulness}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              {/* Compatibility */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Health Compatibility</CardTitle>
                  <CardDescription>
                    Signs that complement {selectedSignData.label}'s wellness journey
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(selectedSignData.compatibility as string[]).map((compatSign: string) => {
                      const signData = zodiacSignNames.find(s => s.value === compatSign);
                      if (!signData) return null;
                      
                      return (
                        <Button
                          key={compatSign}
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-3"
                          onClick={() => setSelectedSign(compatSign)}
                        >
                          <span className="text-xl">{signData.symbol}</span>
                          <span>{signData.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    These signs share complementary elements or qualities that enhance {selectedSignData.label}'s wellness journey, creating balanced energy for optimal health support.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <Star className="h-16 w-16 text-muted stroke-[1.5px] mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a Zodiac Sign</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Choose a sign from the list to view detailed health insights, element characteristics, and wellness recommendations.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}