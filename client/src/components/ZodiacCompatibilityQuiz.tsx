import React, { useState, useEffect } from 'react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
import { getCompatibility, CompatibilityResult } from '@/data/compatibilityData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Users,
  MessageSquare,
  ShieldCheck,
  Star,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Moon,
  Sun,
  Flower
} from 'lucide-react';

interface ZodiacCompatibilityQuizProps {
  initialSign1?: ZodiacSign;
  initialSign2?: ZodiacSign;
  onComplete?: (result: CompatibilityResult) => void;
}

// Quiz questions about the relationship
interface QuizQuestion {
  id: string;
  text: string;
  options: {
    text: string;
    value: number; // Numeric value for scoring
    category: 'romance' | 'friendship' | 'communication' | 'trust';
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'How do you typically resolve conflicts together?',
    options: [
      { text: 'We communicate openly and find compromises quickly', value: 10, category: 'communication' },
      { text: 'We sometimes struggle but eventually work things out', value: 7, category: 'communication' },
      { text: 'We often have different approaches but respect each other', value: 5, category: 'communication' },
      { text: 'We find it challenging to see eye-to-eye during disagreements', value: 3, category: 'communication' }
    ]
  },
  {
    id: 'q2',
    text: 'How would you describe your emotional connection?',
    options: [
      { text: 'Deeply intuitive - we often know what the other is feeling', value: 10, category: 'romance' },
      { text: 'Strong and supportive, with good understanding', value: 8, category: 'romance' },
      { text: 'Caring but sometimes we misunderstand each other', value: 5, category: 'romance' },
      { text: 'We connect in different ways, emotions can be challenging', value: 3, category: 'romance' }
    ]
  },
  {
    id: 'q3',
    text: 'How do you feel about spending time together vs. apart?',
    options: [
      { text: 'We balance together-time and independence perfectly', value: 10, category: 'friendship' },
      { text: 'We enjoy our time together but appreciate space too', value: 8, category: 'friendship' },
      { text: 'One of us tends to need more space than the other', value: 5, category: 'friendship' },
      { text: 'We have different social needs that can create tension', value: 3, category: 'friendship' }
    ]
  },
  {
    id: 'q4',
    text: 'How aligned are your values and life goals?',
    options: [
      { text: 'Remarkably aligned in most important areas', value: 10, category: 'trust' },
      { text: 'Similar in core values with some differences', value: 7, category: 'trust' },
      { text: 'Different in some important ways but we respect that', value: 5, category: 'trust' },
      { text: 'We often see life from very different perspectives', value: 3, category: 'trust' }
    ]
  },
  {
    id: 'q5',
    text: 'How would you describe your communication style together?',
    options: [
      { text: 'Effortless - we understand each other easily', value: 10, category: 'communication' },
      { text: 'Generally good with occasional misunderstandings', value: 7, category: 'communication' },
      { text: 'Sometimes challenging but we make the effort', value: 5, category: 'communication' },
      { text: 'We often speak different languages, figuratively', value: 3, category: 'communication' }
    ]
  }
];

export default function ZodiacCompatibilityQuiz({
  initialSign1,
  initialSign2,
  onComplete
}: ZodiacCompatibilityQuizProps) {
  const { t } = useLanguage();
  const [sign1, setSign1] = useState<ZodiacSign | undefined>(initialSign1);
  const [sign2, setSign2] = useState<ZodiacSign | undefined>(initialSign2);
  const [step, setStep] = useState<'signs' | 'quiz' | 'result'>('signs');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: number, category: string }>>({});
  const [baseResult, setBaseResult] = useState<CompatibilityResult | null>(null);
  const [finalResult, setFinalResult] = useState<CompatibilityResult | null>(null);
  const [animation, setAnimation] = useState(false);

  // When both signs are selected, prep for quiz
  useEffect(() => {
    if (sign1 && sign2 && step === 'signs') {
      // Get base compatibility to adjust with quiz answers
      const result = getCompatibility(sign1, sign2);
      setBaseResult(result);
    }
  }, [sign1, sign2, step]);

  // Handle sign selection
  const handleSignsSubmit = () => {
    if (!sign1 || !sign2) return;
    setStep('quiz');
  };

  // Handle quiz answer
  const handleAnswer = (questionId: string, answer: { value: number, category: string }) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
    
    // Move to next question or results
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 400);
    } else {
      calculateResults();
    }
  };

  // Calculate final result based on base compatibility and quiz answers
  const calculateResults = () => {
    if (!baseResult) return;
    
    // Calculate adjustment factors from quiz
    const categoryScores: Record<string, { total: number, count: number }> = {
      romance: { total: 0, count: 0 },
      friendship: { total: 0, count: 0 },
      communication: { total: 0, count: 0 },
      trust: { total: 0, count: 0 }
    };
    
    // Aggregate answers by category
    Object.values(answers).forEach(answer => {
      const category = answer.category;
      if (categoryScores[category]) {
        categoryScores[category].total += answer.value;
        categoryScores[category].count += 1;
      }
    });
    
    // Calculate average score per category (normalized to 0-1 adjustment factor)
    const adjustmentFactors: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([category, { total, count }]) => {
      if (count > 0) {
        // Convert the 1-10 scale to adjustment factor centered around 0
        // 10 = +15% adjustment, 5 = 0% adjustment, 1 = -15% adjustment
        const avgScore = total / count;
        adjustmentFactors[category] = (avgScore - 5) / 20; // -0.2 to +0.25 adjustment
      } else {
        adjustmentFactors[category] = 0;
      }
    });
    
    // Apply adjustments to create the final result
    const adjusted = { ...baseResult };
    
    adjusted.score = {
      overall: Math.min(100, Math.max(30, Math.round(baseResult.score.overall * (1 + (adjustmentFactors.romance + adjustmentFactors.friendship + adjustmentFactors.communication + adjustmentFactors.trust) / 8)))),
      romance: Math.min(100, Math.max(30, Math.round(baseResult.score.romance * (1 + adjustmentFactors.romance)))),
      friendship: Math.min(100, Math.max(30, Math.round(baseResult.score.friendship * (1 + adjustmentFactors.friendship)))),
      communication: Math.min(100, Math.max(30, Math.round(baseResult.score.communication * (1 + adjustmentFactors.communication)))),
      trust: Math.min(100, Math.max(30, Math.round(baseResult.score.trust * (1 + adjustmentFactors.trust))))
    };
    
    setFinalResult(adjusted);
    setStep('result');
    setTimeout(() => setAnimation(true), 500);
    
    if (onComplete) {
      onComplete(adjusted);
    }
  };

  const handleReset = () => {
    setSign1(undefined);
    setSign2(undefined);
    setStep('signs');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setBaseResult(null);
    setFinalResult(null);
    setAnimation(false);
  };

  const getCompatibilityLabel = (score: number): string => {
    if (score >= 85) return 'Exceptional';
    if (score >= 75) return 'Excellent';
    if (score >= 65) return 'Very Good';
    if (score >= 55) return 'Good';
    if (score >= 45) return 'Moderate';
    if (score >= 35) return 'Challenging';
    return 'Difficult';
  };

  const getCompatibilityColor = (score: number): string => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 65) return 'bg-teal-500';
    if (score >= 55) return 'bg-green-500';
    if (score >= 45) return 'bg-yellow-500';
    if (score >= 35) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCurrentSign = (index: number): ZodiacSign | undefined => {
    return index === 1 ? sign1 : sign2;
  };

  const getSignData = (sign?: ZodiacSign) => {
    return sign ? zodiacSignNames.find(s => s.value === sign) : null;
  };

  // Render sign selection step
  const renderSignSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Cosmic Connection Quiz</h2>
          <p className="text-gray-300">
            Discover your unique compatibility profile by selecting two zodiac signs
            and answering a few questions about your relationship dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Sun className="h-5 w-5 mr-2 text-amber-400" />
              First Person
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {zodiacSignNames.map((sign) => (
                <Button
                  key={sign.value}
                  variant={sign1 === sign.value ? "default" : "outline"}
                  className={`flex flex-col items-center p-3 h-auto ${
                    sign1 === sign.value 
                      ? "bg-gradient-to-br from-purple-600 to-indigo-700 border-transparent" 
                      : "hover:border-purple-500/50 hover:bg-black/30"
                  }`}
                  onClick={() => setSign1(sign.value as ZodiacSign)}
                >
                  <span className="text-xl mb-1">{sign.symbol}</span>
                  <span className="text-xs font-medium">{sign.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Moon className="h-5 w-5 mr-2 text-blue-400" />
              Second Person
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {zodiacSignNames.map((sign) => (
                <Button
                  key={sign.value}
                  variant={sign2 === sign.value ? "default" : "outline"}
                  className={`flex flex-col items-center p-3 h-auto ${
                    sign2 === sign.value 
                      ? "bg-gradient-to-br from-indigo-600 to-blue-700 border-transparent" 
                      : "hover:border-purple-500/50 hover:bg-black/30"
                  }`}
                  onClick={() => setSign2(sign.value as ZodiacSign)}
                >
                  <span className="text-xl mb-1">{sign.symbol}</span>
                  <span className="text-xs font-medium">{sign.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-6 flex justify-center">
          <Button
            onClick={handleSignsSubmit}
            disabled={!sign1 || !sign2}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 h-auto text-lg rounded-lg shadow-lg shadow-purple-900/20"
          >
            Begin Compatibility Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Render quiz questions
  const renderQuiz = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm mb-4">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>
          <h2 className="text-xl font-bold text-white">{currentQuestion.text}</h2>
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full text-left justify-start p-4 h-auto text-gray-300 hover:text-white hover:bg-purple-900/20 hover:border-purple-500/50"
                onClick={() => handleAnswer(currentQuestion.id, { value: option.value, category: option.category })}
              >
                {option.text}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="pt-4">
          <div className="flex justify-between text-sm text-gray-400">
            <div>
              {sign1 && getSignData(sign1)?.symbol} {sign1} & {sign2 && getSignData(sign2)?.symbol} {sign2}
            </div>
            <div>
              {currentQuestionIndex + 1} / {quizQuestions.length}
            </div>
          </div>
          <Progress value={(currentQuestionIndex + 1) / quizQuestions.length * 100} className="h-1 mt-2 bg-gray-800" />
        </div>
      </motion.div>
    );
  };

  // Render results
  const renderResults = () => {
    if (!finalResult) return null;
    
    const sign1Data = getSignData(sign1);
    const sign2Data = getSignData(sign2);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="absolute w-60 h-60 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="mb-3 font-medium text-gray-300 flex justify-center gap-2">
              <span>{sign1Data?.symbol} {sign1Data?.label}</span>
              <span>&</span>
              <span>{sign2Data?.symbol} {sign2Data?.label}</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              {finalResult.score.overall}% Compatible
            </h2>

            <div className="relative mb-8">
              <AnimatePresence>
                {animation && (
                  <motion.div 
                    className="absolute -top-14 left-1/2 transform -translate-x-1/2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: -20, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Sparkles className="h-10 w-10 text-purple-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {animation && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.3,
                      duration: 0.8, 
                      type: "spring",
                      bounce: 0.4
                    }}
                    className="flex justify-center"
                  >
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
                      <div className="absolute inset-2 rounded-full border border-purple-500/50" />
                      <motion.div 
                        className="absolute top-0 right-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600" />
                      </motion.div>
                      <motion.div 
                        className="absolute bottom-4 left-2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600" />
                      </motion.div>
                      <div className="relative flex items-center">
                        <div className="text-lg text-white font-bold bg-gradient-to-br from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                          {sign1Data?.symbol}
                          <Heart className="inline h-4 w-4 mx-1 text-pink-500" />
                          {sign2Data?.symbol}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                {sign1Data?.element} + {sign2Data?.element}
              </Badge>
              {finalResult.score.overall >= 85 && (
                <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                  Soulmate Potential
                </Badge>
              )}
              {finalResult.score.overall >= 75 && (
                <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                  Strong Match
                </Badge>
              )}
              {finalResult.score.romance >= 80 && (
                <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                  Romantic Connection
                </Badge>
              )}
              {finalResult.score.friendship >= 80 && (
                <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                  Friendship Harmony
                </Badge>
              )}
              {finalResult.score.communication >= 80 && (
                <Badge variant="secondary" className="bg-purple-900/40 hover:bg-purple-900/60">
                  Communication Flow
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="bg-purple-900/30" />
        
        <div className="space-y-6">
          <div className="space-y-4">
            <AnimatePresence>
              {animation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-pink-400" /> Romance
                      </div>
                      <div>{getCompatibilityLabel(finalResult.score.romance)}</div>
                    </div>
                    <Progress value={finalResult.score.romance} className={getCompatibilityColor(finalResult.score.romance)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-400" /> Friendship
                      </div>
                      <div>{getCompatibilityLabel(finalResult.score.friendship)}</div>
                    </div>
                    <Progress value={finalResult.score.friendship} className={getCompatibilityColor(finalResult.score.friendship)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-purple-400" /> Communication
                      </div>
                      <div>{getCompatibilityLabel(finalResult.score.communication)}</div>
                    </div>
                    <Progress value={finalResult.score.communication} className={getCompatibilityColor(finalResult.score.communication)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-teal-400" /> Trust
                      </div>
                      <div>{getCompatibilityLabel(finalResult.score.trust)}</div>
                    </div>
                    <Progress value={finalResult.score.trust} className={getCompatibilityColor(finalResult.score.trust)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {animation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-lg space-y-4"
              >
                <p className="text-gray-300">{finalResult.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-white flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-400" /> Strengths
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {finalResult.strengths.map((strength, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5 + (index * 0.1), duration: 0.3 }}
                          className="flex items-start"
                        >
                          <span className="text-green-400 mr-2">✓</span> {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-white flex items-center">
                      <Flower className="h-4 w-4 mr-2 text-purple-400" /> Growth Areas
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {finalResult.challenges.map((challenge, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.7 + (index * 0.1), duration: 0.3 }}
                          className="flex items-start"
                        >
                          <span className="text-amber-400 mr-2">•</span> {challenge}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Separator className="bg-purple-900/30 my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-white">Cosmic Advice</h4>
                  <p className="text-sm text-gray-300">{finalResult.advice}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-purple-500/30 hover:bg-purple-900/20 hover:border-purple-500/50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Another Combination
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 bg-[url('/stars-bg.png')] bg-opacity-60 border border-purple-500/30 shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">
          Cosmic Compatibility Quiz
        </CardTitle>
        <CardDescription className="text-center text-gray-300">
          Discover your astrological compatibility through interactive insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {step === 'signs' && renderSignSelection()}
          {step === 'quiz' && renderQuiz()}
          {step === 'result' && renderResults()}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="text-xs text-gray-400 border-t border-purple-900/30 pt-4">
        <div className="text-center w-full">
          For entertainment purposes only. Real relationships are complex and shaped by many factors beyond astrology.
        </div>
      </CardFooter>
    </Card>
  );
}