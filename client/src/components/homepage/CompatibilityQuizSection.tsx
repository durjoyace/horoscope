import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'wouter';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
import { getCompatibility } from '@/data/compatibilityData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Users, 
  MessageSquare,
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';

export const CompatibilityQuizSection: React.FC = () => {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [sign1, setSign1] = useState<ZodiacSign | undefined>();
  const [sign2, setSign2] = useState<ZodiacSign | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  
  const calculateCompatibility = () => {
    if (!sign1 || !sign2) return null;
    return getCompatibility(sign1, sign2);
  };
  
  const result = calculateCompatibility();
  
  const handleSignSelection = (sign: ZodiacSign, position: 1 | 2) => {
    if (position === 1) {
      setSign1(sign);
    } else {
      setSign2(sign);
    }
    
    // Reset results when signs change
    setShowResults(false);
    setAnimateResult(false);
  };
  
  const handleCalculate = () => {
    if (!sign1 || !sign2) return;
    
    setShowResults(true);
    setTimeout(() => setAnimateResult(true), 600);
  };
  
  const handleReset = () => {
    setSign1(undefined);
    setSign2(undefined);
    setShowResults(false);
    setAnimateResult(false);
  };
  
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
    
  return (
    <section className="relative py-16 bg-black text-white overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
          <div className="absolute -top-20 right-40 transform w-96 h-96 rounded-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 blur-3xl opacity-40"></div>
          <div className="absolute bottom-10 left-20 transform w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-800 to-indigo-900 blur-3xl opacity-30"></div>
          <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-30"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-10 pb-16 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Discover Your Cosmic Compatibility
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore your astrological compatibility with our interactive quiz. Find out how well your stars align with friends, family, or romantic partners.
            </p>
          </motion.div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border border-purple-500/30 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
              <CardTitle className="text-2xl text-center text-white">
                Zodiac Compatibility Calculator
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Select two zodiac signs to see how compatible they are
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white text-center">First Person</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                          {zodiacSignNames.map((zodiacSign) => (
                            <Button
                              key={zodiacSign.value}
                              variant={sign1 === zodiacSign.value ? "default" : "outline"}
                              className={`flex flex-col items-center p-2 h-auto aspect-square ${
                                sign1 === zodiacSign.value 
                                  ? "bg-gradient-to-br from-purple-600 to-indigo-700 border-transparent" 
                                  : "hover:border-purple-500/50 hover:bg-black/30"
                              }`}
                              onClick={() => handleSignSelection(zodiacSign.value as ZodiacSign, 1)}
                            >
                              <span className="text-xl mb-1">{zodiacSign.symbol}</span>
                              <span className="text-xs font-medium">{zodiacSign.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white text-center">Second Person</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                          {zodiacSignNames.map((zodiacSign) => (
                            <Button
                              key={zodiacSign.value}
                              variant={sign2 === zodiacSign.value ? "default" : "outline"}
                              className={`flex flex-col items-center p-2 h-auto aspect-square ${
                                sign2 === zodiacSign.value 
                                  ? "bg-gradient-to-br from-indigo-600 to-blue-700 border-transparent" 
                                  : "hover:border-purple-500/50 hover:bg-black/30"
                              }`}
                              onClick={() => handleSignSelection(zodiacSign.value as ZodiacSign, 2)}
                            >
                              <span className="text-xl mb-1">{zodiacSign.symbol}</span>
                              <span className="text-xs font-medium">{zodiacSign.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleCalculate}
                        disabled={!sign1 || !sign2}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 h-auto text-lg rounded-lg shadow-lg shadow-purple-900/20"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Calculate Compatibility
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {result && (
                      <>
                        <div className="text-center space-y-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="flex flex-col items-center">
                              <span className="text-3xl">
                                {zodiacSignNames.find(s => s.value === sign1)?.symbol}
                              </span>
                              <span className="text-sm text-gray-300">
                                {zodiacSignNames.find(s => s.value === sign1)?.label}
                              </span>
                            </div>
                            
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <AnimatePresence>
                                {animateResult && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
                                  >
                                    <Heart className="h-8 w-8 text-pink-500" fill="rgba(236, 72, 153, 0.5)" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <span className="text-3xl">
                                {zodiacSignNames.find(s => s.value === sign2)?.symbol}
                              </span>
                              <span className="text-sm text-gray-300">
                                {zodiacSignNames.find(s => s.value === sign2)?.label}
                              </span>
                            </div>
                          </div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                              {result.score.overall}% Compatible
                            </h3>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-3 mt-4"
                          >
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
                          </motion.div>
                        </div>
                        
                        <div className="flex justify-center space-x-3">
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            className="border-purple-500/30 hover:bg-purple-900/20 hover:border-purple-500/50"
                          >
                            Try Different Signs
                          </Button>
                          
                          <Button
                            onClick={() => navigate('/zodiac-library')}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          >
                            <Star className="h-4 w-4 mr-2" /> Full Compatibility Details
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            
            <CardFooter className="text-center text-xs text-gray-400 border-t border-purple-900/30 py-4">
              For entertainment purposes only. Real relationships are complex and shaped by many factors beyond astrology.
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/zodiac-library')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 h-auto text-lg rounded-lg shadow-lg shadow-purple-900/20"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Try the Full Interactive Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};