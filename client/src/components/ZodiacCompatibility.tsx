import React, { useState } from 'react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
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
  Info
} from 'lucide-react';

interface ZodiacCompatibilityProps {
  initialSign1?: ZodiacSign;
  initialSign2?: ZodiacSign;
  showExplanation?: boolean;
}

// Simple compatibility algorithm
const calculateCompatibility = (sign1: ZodiacSign, sign2: ZodiacSign): {
  overall: number;
  romance: number;
  friendship: number;
  communication: number;
  categories: string[];
  description: string;
  advice: string;
  challenges: string[];
  strengths: string[];
} => {
  // Get sign info
  const sign1Data = zodiacSignNames.find(s => s.value === sign1);
  const sign2Data = zodiacSignNames.find(s => s.value === sign2);
  
  if (!sign1Data || !sign2Data) {
    return {
      overall: 0,
      romance: 0,
      friendship: 0,
      communication: 0,
      categories: [],
      description: '',
      advice: '',
      challenges: [],
      strengths: []
    };
  }
  
  // Element compatibility
  const elementCompatibility = (): number => {
    // Same element = high compatibility
    if (sign1Data.element === sign2Data.element) return 85;
    
    // Complementary elements
    const complementary: Record<string, string[]> = {
      'Fire': ['Air'],
      'Air': ['Fire'],
      'Earth': ['Water'],
      'Water': ['Earth']
    };
    
    if (complementary[sign1Data.element]?.includes(sign2Data.element)) return 80;
    
    // Challenging elements
    const challenging: Record<string, string[]> = {
      'Fire': ['Water'],
      'Water': ['Fire'],
      'Earth': ['Air'],
      'Air': ['Earth']
    };
    
    if (challenging[sign1Data.element]?.includes(sign2Data.element)) return 55;
    
    // Neutral
    return 70;
  };
  
  // Modality compatibility (Cardinal, Fixed, Mutable)
  const modalityCompatibility = (): number => {
    // Same modality - can be competitive or understading
    if (sign1Data.modality === sign2Data.modality) return 65;
    
    // Complementary (all 3 together work well)
    return 75;
  };

  // Calculate scores
  const elementScore = elementCompatibility();
  const modalityScore = modalityCompatibility();
  
  // Get some randomness but weighted toward the calculated values
  const getRandomizedScore = (baseScore: number): number => {
    const variance = 10; // +/- 10%
    return Math.min(100, Math.max(30, baseScore + (Math.random() * variance * 2 - variance)));
  };
  
  const romance = getRandomizedScore(elementScore);
  const friendship = getRandomizedScore((elementScore + modalityScore) / 2);
  const communication = getRandomizedScore(modalityScore);
  const overall = Math.round((romance + friendship + communication) / 3);
  
  // Categories based on the synergy
  const categories = [];
  if (overall >= 80) categories.push('Soulmates');
  else if (overall >= 70) categories.push('Great Match');
  else if (overall >= 60) categories.push('Compatible');
  else if (overall >= 45) categories.push('Needs Work');
  else categories.push('Challenging');
  
  if (elementScore > 70) categories.push('Elemental Harmony');
  if (romance > 75) categories.push('Romantic Connection');
  if (friendship > 75) categories.push('Strong Friendship');
  if (communication > 75) categories.push('Great Communication');
  
  // Description
  let description = '';
  if (overall >= 80) {
    description = `${sign1Data.label} and ${sign2Data.label} have exceptional compatibility! There's a natural flow of energy between these signs, creating a balanced and harmonious relationship.`;
  } else if (overall >= 65) {
    description = `${sign1Data.label} and ${sign2Data.label} have good compatibility with some complementary traits that can create a balanced relationship with effort.`;
  } else if (overall >= 50) {
    description = `${sign1Data.label} and ${sign2Data.label} have moderate compatibility. There are differences that may cause occasional friction, but also opportunities for growth.`;
  } else {
    description = `${sign1Data.label} and ${sign2Data.label} face compatibility challenges. This relationship will require understanding, patience, and compromise.`;
  }
  
  // Advice
  let advice = '';
  if (overall >= 80) {
    advice = "Celebrate your natural compatibility but don't take it for granted. Continue nurturing your strengths and be mindful of your few differences.";
  } else if (overall >= 65) {
    advice = "Focus on your complementary qualities and use them to strengthen your bond. Be patient with differences and see them as opportunities to learn.";
  } else if (overall >= 50) {
    advice = "Communication is essential in navigating your differences. Approach challenges with openness and a willingness to understand each other's perspectives.";
  } else {
    advice = "This relationship requires work but can be rewarding. Practice patience, open communication, and appreciate the growth that comes from navigating differences.";
  }
  
  // Generate some challenges and strengths
  const generateChallenges = (): string[] => {
    const challenges = [];
    if (sign1Data.element !== sign2Data.element) {
      challenges.push(`Balancing ${sign1Data.element} and ${sign2Data.element} energies`);
    }
    if (sign1Data.modality !== sign2Data.modality) {
      challenges.push('Different approaches to problem-solving');
    }
    if (communication < 70) {
      challenges.push('Potential communication misunderstandings');
    }
    if (challenges.length === 0) {
      challenges.push('Avoiding complacency in the relationship');
    }
    return challenges;
  };
  
  const generateStrengths = (): string[] => {
    const strengths = [];
    if (sign1Data.element === sign2Data.element) {
      strengths.push(`Shared ${sign1Data.element} element creates natural understanding`);
    }
    if (elementScore > 70) {
      strengths.push('Complementary energies that support growth');
    }
    if (friendship > 70) {
      strengths.push('Strong foundation of friendship');
    }
    if (communication > 70) {
      strengths.push('Effective communication patterns');
    }
    if (strengths.length === 0) {
      strengths.push('Opportunity for significant personal growth');
    }
    return strengths;
  };
  
  return {
    overall,
    romance: Math.round(romance),
    friendship: Math.round(friendship),
    communication: Math.round(communication),
    categories,
    description,
    advice,
    challenges: generateChallenges(),
    strengths: generateStrengths()
  };
};

export default function ZodiacCompatibility({
  initialSign1,
  initialSign2,
  showExplanation = true
}: ZodiacCompatibilityProps) {
  const [sign1, setSign1] = useState<ZodiacSign | undefined>(initialSign1);
  const [sign2, setSign2] = useState<ZodiacSign | undefined>(initialSign2);
  const [result, setResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null);
  
  const getCompatibilityLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Moderate';
    return 'Challenging';
  };
  
  const getCompatibilityColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
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
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 border border-purple-500/30">
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
              <div className="text-xs text-muted-foreground">
                {zodiacSignNames.find((s) => s.value === sign1)?.dates}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Second Zodiac Sign</label>
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
              <div className="text-xs text-muted-foreground">
                {zodiacSignNames.find((s) => s.value === sign2)?.dates}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCalculate}
            disabled={!sign1 || !sign2}
            className="w-full md:w-auto"
          >
            Calculate Compatibility
          </Button>
          {result && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full md:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
          )}
        </div>
        
        {result && (
          <div className="mt-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">{result.overall}% Compatible</div>
              <div className="flex justify-center flex-wrap gap-2">
                {result.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-500" /> Romance
                  </div>
                  <div>{getCompatibilityLabel(result.romance)}</div>
                </div>
                <Progress value={result.romance} className={getCompatibilityColor(result.romance)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" /> Friendship
                  </div>
                  <div>{getCompatibilityLabel(result.friendship)}</div>
                </div>
                <Progress value={result.friendship} className={getCompatibilityColor(result.friendship)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-purple-500" /> Communication
                  </div>
                  <div>{getCompatibilityLabel(result.communication)}</div>
                </div>
                <Progress value={result.communication} className={getCompatibilityColor(result.communication)} />
              </div>
            </div>
            
            {showExplanation && (
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <p>{result.description}</p>
                
                <div>
                  <h4 className="font-medium flex items-center mb-2">
                    <Activity className="h-4 w-4 mr-2" /> Relationship Dynamics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Strengths</h5>
                      <ul className="text-sm space-y-1">
                        {result.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span> {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Challenges</h5>
                      <ul className="text-sm space-y-1">
                        {result.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-amber-500 mr-2">!</span> {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2" /> Advice
                  </h4>
                  <p className="text-sm">{result.advice}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Note: This is a simplified compatibility analysis based on astrological principles. Real relationships are complex and influenced by many factors.
      </CardFooter>
    </Card>
  );
}