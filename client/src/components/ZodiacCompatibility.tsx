import React, { useState } from 'react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  MessageSquare, 
  Activity,
  RefreshCw,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ZodiacCompatibilityQuiz from './ZodiacCompatibilityQuiz';
import { getCompatibility } from '@/data/compatibilityData';

interface ZodiacCompatibilityProps {
  initialSign1?: ZodiacSign;
  initialSign2?: ZodiacSign;
  showExplanation?: boolean;
}

// Simple compatibility algorithm using our more sophisticated data
const calculateCompatibility = (sign1: ZodiacSign, sign2: ZodiacSign) => {
  const compatData = getCompatibility(sign1, sign2);
  
  // Add categories based on scores
  const categories: string[] = [];
  if (compatData.score.overall >= 85) categories.push('Soulmates');
  else if (compatData.score.overall >= 75) categories.push('Great Match');
  else if (compatData.score.overall >= 65) categories.push('Compatible');
  else if (compatData.score.overall >= 50) categories.push('Needs Work');
  else categories.push('Challenging');
  
  if (compatData.score.romance >= 80) categories.push('Romantic Connection');
  if (compatData.score.friendship >= 80) categories.push('Strong Friendship');
  if (compatData.score.communication >= 80) categories.push('Great Communication');
  
  return {
    ...compatData,
    categories
  };
};

export default function ZodiacCompatibility({
  initialSign1,
  initialSign2,
  showExplanation = true
}: ZodiacCompatibilityProps) {
  const [activeTab, setActiveTab] = useState('calculator');
  const [sign1, setSign1] = useState<ZodiacSign | undefined>(initialSign1);
  const [sign2, setSign2] = useState<ZodiacSign | undefined>(initialSign2);
  const [result, setResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null);
  
  const getCompatibilityLabel = (score: number): string => {
    if (score >= 85) return 'Exceptional';
    if (score >= 75) return 'Excellent';
    if (score >= 65) return 'Very Good';
    if (score >= 55) return 'Good';
    if (score >= 45) return 'Moderate';
    return 'Challenging';
  };
  
  const getCompatibilityColor = (score: number): string => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 65) return 'bg-teal-500';
    if (score >= 55) return 'bg-green-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const handleCalculate = () => {
    if (!sign1 || !sign2) return;
    setResult(calculateCompatibility(sign1, sign2));
  };
  
  const handleReset = () => {
    setSign1(undefined);
    setSign2(undefined);
    setResult(null);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-900 border border-purple-900/50">
            <TabsTrigger 
              value="calculator" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
            >
              Quick Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" /> 
              Interactive Quiz
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calculator">
          <Card className="bg-gray-900 border border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 text-pink-400" /> Zodiac Compatibility Calculator
              </CardTitle>
              <CardDescription className="text-gray-300">
                Discover how well your signs align in romance, friendship, and communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">First Zodiac Sign</label>
                  <Select
                    value={sign1}
                    onValueChange={(value) => setSign1(value as ZodiacSign)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSignNames.map((sign) => (
                        <SelectItem key={sign.value} value={sign.value}>
                          {sign.symbol} {sign.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {sign1 && (
                    <div className="text-xs text-gray-300">
                      {zodiacSignNames.find((s) => s.value === sign1)?.dates}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Second Zodiac Sign</label>
                  <Select
                    value={sign2}
                    onValueChange={(value) => setSign2(value as ZodiacSign)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSignNames.map((sign) => (
                        <SelectItem key={sign.value} value={sign.value}>
                          {sign.symbol} {sign.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {sign2 && (
                    <div className="text-xs text-gray-300">
                      {zodiacSignNames.find((s) => s.value === sign2)?.dates}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleCalculate}
                  disabled={!sign1 || !sign2}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Calculate Compatibility
                </Button>
                {result && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full md:w-auto border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-900/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                )}
              </div>
              
              {!result && !sign1 && !sign2 && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('quiz')} 
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> 
                    Try our interactive compatibility quiz
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
              
              {result && (
                <div className="mt-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 text-transparent bg-clip-text">
                      {result.score.overall}% Compatible
                    </div>
                    <div className="flex justify-center flex-wrap gap-2 mt-1">
                      {result.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-pink-400" /> Romance
                        </div>
                        <div>{getCompatibilityLabel(result.score.romance)}</div>
                      </div>
                      <Progress value={result.score.romance} className={getCompatibilityColor(result.score.romance)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-400" /> Friendship
                        </div>
                        <div>{getCompatibilityLabel(result.score.friendship)}</div>
                      </div>
                      <Progress value={result.score.friendship} className={getCompatibilityColor(result.score.friendship)} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-purple-400" /> Communication
                        </div>
                        <div>{getCompatibilityLabel(result.score.communication)}</div>
                      </div>
                      <Progress value={result.score.communication} className={getCompatibilityColor(result.score.communication)} />
                    </div>
                  </div>
                  
                  {showExplanation && (
                    <div className="bg-gray-800 border border-purple-500/20 p-4 rounded-lg space-y-4">
                      <p className="text-gray-300">{result.description}</p>
                      
                      <div>
                        <h4 className="font-medium flex items-center mb-2 text-white">
                          <Activity className="h-4 w-4 mr-2 text-purple-400" /> Relationship Dynamics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1 text-white">Strengths</h5>
                            <ul className="text-sm space-y-1 text-gray-300">
                              {result.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-400 mr-2">✓</span> {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1 text-white">Challenges</h5>
                            <ul className="text-sm space-y-1 text-gray-300">
                              {result.challenges.map((challenge, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-amber-400 mr-2">!</span> {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center mb-2 text-white">
                          <Info className="h-4 w-4 mr-2 text-blue-400" /> Advice
                        </h4>
                        <p className="text-sm text-gray-300">{result.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-gray-400 border-t border-purple-500/20">
              Note: This is a compatibility analysis based on astrological principles. Real relationships are complex and influenced by many factors.
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="quiz">
          <ZodiacCompatibilityQuiz 
            initialSign1={sign1} 
            initialSign2={sign2} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}