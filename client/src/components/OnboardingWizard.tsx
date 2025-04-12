import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ZodiacSign } from '@shared/types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  MoonIcon, 
  SunIcon, 
  FlameIcon, 
  Waves,
  Wind,
  Mountain,
  Sparkles,
  CalendarDays
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (userData: UserData) => void;
}

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  zodiacSign: ZodiacSign;
  referralCode?: string;
}

// Zodiac quiz questions and personality traits
const personalityQuestions = [
  {
    id: 'element',
    question: 'Which element do you feel most drawn to?',
    options: [
      { id: 'fire', label: 'Fire', icon: <FlameIcon className="mr-2 h-4 w-4" />, description: 'Passionate, dynamic, temperamental' },
      { id: 'earth', label: 'Earth', icon: <Mountain className="mr-2 h-4 w-4" />, description: 'Practical, loyal, stable' },
      { id: 'air', label: 'Air', icon: <Wind className="mr-2 h-4 w-4" />, description: 'Social, analytical, thoughtful' },
      { id: 'water', label: 'Water', icon: <Waves className="mr-2 h-4 w-4" />, description: 'Emotional, intuitive, deep' },
    ]
  },
  {
    id: 'time',
    question: 'Which time of day do you feel most energized?',
    options: [
      { id: 'morning', label: 'Morning', icon: <SunIcon className="mr-2 h-4 w-4" />, description: 'Early riser, productive in the AM' },
      { id: 'afternoon', label: 'Afternoon', icon: <SunIcon className="mr-2 h-4 w-4" />, description: 'Steady energy throughout the day' },
      { id: 'evening', label: 'Evening', icon: <MoonIcon className="mr-2 h-4 w-4" />, description: 'Social, creative in the PM' },
      { id: 'night', label: 'Night', icon: <MoonIcon className="mr-2 h-4 w-4" />, description: 'Night owl, introspective' },
    ]
  },
  {
    id: 'social',
    question: 'How would you describe your social style?',
    options: [
      { id: 'leader', label: 'I naturally take the lead', icon: <Star className="mr-2 h-4 w-4" />, description: 'Confident, assertive, ambitious' },
      { id: 'supportive', label: 'I like to support others', icon: <Sparkles className="mr-2 h-4 w-4" />, description: 'Caring, nurturing, empathetic' },
      { id: 'analyzer', label: 'I observe and analyze', icon: <Sparkles className="mr-2 h-4 w-4" />, description: 'Thoughtful, analytical, reserved' },
      { id: 'inspirer', label: 'I like to inspire others', icon: <Star className="mr-2 h-4 w-4" />, description: 'Creative, passionate, expressive' },
    ]
  },
  {
    id: 'challenge',
    question: 'How do you typically approach challenges?',
    options: [
      { id: 'head-on', label: 'Head-on, with confidence', icon: <FlameIcon className="mr-2 h-4 w-4" />, description: 'Direct, confident, decisive' },
      { id: 'methodical', label: 'Methodically, with planning', icon: <Mountain className="mr-2 h-4 w-4" />, description: 'Practical, organized, thorough' },
      { id: 'creative', label: 'Creatively, with flexibility', icon: <Wind className="mr-2 h-4 w-4" />, description: 'Adaptable, innovative, quick-thinking' },
      { id: 'intuitive', label: 'Intuitively, trusting feelings', icon: <Waves className="mr-2 h-4 w-4" />, description: 'Insightful, emotionally aware, perceptive' },
    ]
  },
  {
    id: 'priorities',
    question: 'What do you value most in your life?',
    options: [
      { id: 'freedom', label: 'Freedom and adventure', icon: <Wind className="mr-2 h-4 w-4" />, description: 'Independent, spontaneous, explorer' },
      { id: 'stability', label: 'Stability and security', icon: <Mountain className="mr-2 h-4 w-4" />, description: 'Loyal, consistent, reliable' },
      { id: 'relationships', label: 'Relationships and harmony', icon: <Waves className="mr-2 h-4 w-4" />, description: 'Connected, empathetic, diplomatic' },
      { id: 'achievement', label: 'Achievement and recognition', icon: <FlameIcon className="mr-2 h-4 w-4" />, description: 'Ambitious, driven, competitive' },
    ]
  },
];

// Map quiz answers to zodiac signs
const determineZodiacSign = (answers: Record<string, string>): ZodiacSign => {
  // This is a simplified algorithm - in a real app, this would be more sophisticated
  
  // Count element affinities
  const elementScores = {
    fire: 0,
    earth: 0,
    air: 0, 
    water: 0
  };
  
  // Element question
  if (answers.element === 'fire') elementScores.fire += 2;
  if (answers.element === 'earth') elementScores.earth += 2;
  if (answers.element === 'air') elementScores.air += 2;
  if (answers.element === 'water') elementScores.water += 2;
  
  // Time of day
  if (answers.time === 'morning') { elementScores.fire += 1; elementScores.earth += 1; }
  if (answers.time === 'afternoon') { elementScores.earth += 1; elementScores.air += 1; }
  if (answers.time === 'evening') { elementScores.air += 1; elementScores.fire += 1; }
  if (answers.time === 'night') { elementScores.water += 2; }
  
  // Social style
  if (answers.social === 'leader') { elementScores.fire += 2; }
  if (answers.social === 'supportive') { elementScores.water += 2; }
  if (answers.social === 'analyzer') { elementScores.earth += 1; elementScores.air += 1; }
  if (answers.social === 'inspirer') { elementScores.fire += 1; elementScores.air += 1; }
  
  // Challenge approach
  if (answers.challenge === 'head-on') { elementScores.fire += 2; }
  if (answers.challenge === 'methodical') { elementScores.earth += 2; }
  if (answers.challenge === 'creative') { elementScores.air += 2; }
  if (answers.challenge === 'intuitive') { elementScores.water += 2; }
  
  // Priorities
  if (answers.priorities === 'freedom') { elementScores.air += 2; elementScores.fire += 1; }
  if (answers.priorities === 'stability') { elementScores.earth += 2; }
  if (answers.priorities === 'relationships') { elementScores.water += 2; }
  if (answers.priorities === 'achievement') { elementScores.fire += 2; elementScores.earth += 1; }
  
  // Find dominant element
  const maxElement = Object.entries(elementScores).reduce((max, [element, score]) => 
    score > max[1] ? [element, score] : max, ['', 0])[0];
  
  // Assign a zodiac sign based on dominant element and some secondary factors
  if (maxElement === 'fire') {
    if (answers.social === 'leader' && answers.priorities === 'achievement') return 'aries';
    if (answers.social === 'leader' && answers.priorities === 'relationships') return 'leo';
    return 'sagittarius';
  }
  
  if (maxElement === 'earth') {
    if (answers.challenge === 'methodical' && answers.priorities === 'stability') return 'taurus';
    if (answers.social === 'analyzer' && answers.challenge === 'methodical') return 'virgo';
    return 'capricorn';
  }
  
  if (maxElement === 'air') {
    if (answers.challenge === 'creative' && answers.priorities === 'freedom') return 'gemini';
    if (answers.social === 'inspirer' && answers.priorities === 'relationships') return 'libra';
    return 'aquarius';
  }
  
  if (maxElement === 'water') {
    if (answers.social === 'supportive' && answers.priorities === 'relationships') return 'cancer';
    if (answers.challenge === 'intuitive' && answers.priorities === 'achievement') return 'scorpio';
    return 'pisces';
  }
  
  // Default fallback
  return 'libra';
};

// Zodiac sign data
const zodiacSigns = [
  { value: 'aries', label: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'fire' },
  { value: 'taurus', label: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'earth' },
  { value: 'gemini', label: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'air' },
  { value: 'cancer', label: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'water' },
  { value: 'leo', label: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'fire' },
  { value: 'virgo', label: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'earth' },
  { value: 'libra', label: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'air' },
  { value: 'scorpio', label: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'water' },
  { value: 'sagittarius', label: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'fire' },
  { value: 'capricorn', label: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'earth' },
  { value: 'aquarius', label: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'air' },
  { value: 'pisces', label: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'water' },
];

// Steps in the onboarding wizard
type Step = 'welcome' | 'personality-quiz' | 'result' | 'complete-profile' | 'finish';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestedSign, setSuggestedSign] = useState<ZodiacSign | null>(null);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [userData, setUserData] = useState<Partial<UserData>>({
    email: '',
    firstName: '',
    lastName: '',
    birthDate: ''
  });
  const [referralCode, setReferralCode] = useState<string>('');
  
  // Progress through the steps
  const totalSteps = personalityQuestions.length;
  const progress = Math.floor((quizStep / totalSteps) * 100);
  
  // Handle next button in quiz
  const handleNextQuestion = () => {
    if (quizStep < personalityQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate suggested zodiac sign
      const sign = determineZodiacSign(answers);
      setSuggestedSign(sign);
      setCurrentStep('result');
    }
  };
  
  // Handle back button in quiz
  const handlePreviousQuestion = () => {
    if (quizStep > 0) {
      setQuizStep(quizStep - 1);
    } else {
      setCurrentStep('welcome');
    }
  };
  
  // Option selection in quiz
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };
  
  // Zodiac sign selection
  const handleSignSelect = (sign: ZodiacSign) => {
    setSelectedSign(sign);
  };

  // Update user data fields
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Finish onboarding
  const handleFinish = () => {
    // Ensure we have a zodiac sign selected
    if (!selectedSign) return;
    
    // Combine all user data
    const completeUserData: UserData = {
      ...userData as UserData,
      zodiacSign: selectedSign,
      referralCode: referralCode || undefined
    };
    
    // Submit data to parent component
    onComplete(completeUserData);
  };
  
  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    return !!answers[personalityQuestions[quizStep]?.id];
  };
  
  // Check if user data form is complete
  const isUserDataComplete = () => {
    return !!userData.email && !!selectedSign;
  };
  
  // Animation variants for transitions
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/70 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  {t('onboarding.welcome.title')}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  {t('onboarding.welcome.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <Star className="h-16 w-16 text-white animate-pulse" />
                  </div>
                </div>
                
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <p>{t('onboarding.welcome.intro')}</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-background/50 border border-accent">
                      <p className="text-sm font-medium mb-1">{t('onboarding.welcome.feature1.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('onboarding.welcome.feature1.description')}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-accent">
                      <p className="text-sm font-medium mb-1">{t('onboarding.welcome.feature2.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('onboarding.welcome.feature2.description')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentStep('personality-quiz')}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {t('onboarding.welcome.start')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'personality-quiz' && (
          <motion.div
            key="quiz"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/70 border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-muted-foreground">
                    {t('onboarding.quiz.step')} {quizStep + 1} / {totalSteps}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.floor(((quizStep + 1) / totalSteps) * 100)}%
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <CardTitle className="mt-4 text-xl">
                  {personalityQuestions[quizStep]?.question}
                </CardTitle>
                <CardDescription>
                  {t('onboarding.quiz.instruction')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[personalityQuestions[quizStep]?.id] || ''}
                  onValueChange={(value) => handleAnswerChange(personalityQuestions[quizStep].id, value)}
                  className="space-y-3"
                >
                  {personalityQuestions[quizStep]?.options.map((option) => (
                    <div key={option.id} className="relative">
                      <div
                        className={`
                          flex items-center space-x-2 rounded-lg border p-4 transition-all
                          ${answers[personalityQuestions[quizStep]?.id] === option.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-accent'}
                        `}
                      >
                        <RadioGroupItem 
                          value={option.id} 
                          id={option.id} 
                          className="absolute left-4"
                        />
                        <Label 
                          htmlFor={option.id} 
                          className="flex flex-1 cursor-pointer items-center pl-6"
                        >
                          <div className="flex items-center space-x-2">
                            {option.icon}
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <div className="ml-auto text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousQuestion}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.quiz.back')}
                </Button>
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!isCurrentQuestionAnswered()}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {quizStep < personalityQuestions.length - 1 
                    ? t('onboarding.quiz.next') 
                    : t('onboarding.quiz.finish')
                  } <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'result' && suggestedSign && (
          <motion.div
            key="result"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/70 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {t('onboarding.result.title')}
                </CardTitle>
                <CardDescription>
                  {t('onboarding.result.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <span className="text-5xl text-white">
                      {zodiacSigns.find(sign => sign.value === suggestedSign)?.symbol}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-1">
                    {zodiacSigns.find(sign => sign.value === suggestedSign)?.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {zodiacSigns.find(sign => sign.value === suggestedSign)?.dates}
                  </p>
                  <div className="inline-flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    <p className="capitalize">
                      {zodiacSigns.find(sign => sign.value === suggestedSign)?.element} {t('onboarding.result.element')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-background/40 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium mb-4">{t('onboarding.result.question')}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2">
                    {zodiacSigns.map((sign) => (
                      <div 
                        key={sign.value}
                        className={`
                          p-3 rounded-lg text-center cursor-pointer transition-all
                          ${selectedSign === sign.value || (selectedSign === null && suggestedSign === sign.value)
                            ? 'bg-primary/20 border-2 border-primary/50' 
                            : 'bg-background/70 border border-border hover:border-primary/30'}
                        `}
                        onClick={() => handleSignSelect(sign.value as ZodiacSign)}
                      >
                        <div className="text-2xl mb-1">{sign.symbol}</div>
                        <div className="text-sm font-medium">{sign.label}</div>
                        <div className="text-xs text-muted-foreground">{sign.dates}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setQuizStep(personalityQuestions.length - 1);
                    setCurrentStep('personality-quiz');
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.result.back')}
                </Button>
                <Button 
                  onClick={() => {
                    if (!selectedSign) {
                      setSelectedSign(suggestedSign);
                    }
                    setCurrentStep('complete-profile');
                  }}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {t('onboarding.result.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'complete-profile' && (
          <motion.div
            key="profile"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-background/90 to-background/70 border-primary/20">
              <CardHeader>
                <CardTitle>{t('onboarding.profile.title')}</CardTitle>
                <CardDescription>{t('onboarding.profile.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('onboarding.profile.email')} <span className="text-destructive">*</span></Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="you@example.com" 
                    value={userData.email}
                    onChange={handleUserDataChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('onboarding.profile.firstName')}</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="First Name" 
                      value={userData.firstName || ''}
                      onChange={handleUserDataChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('onboarding.profile.lastName')}</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Last Name" 
                      value={userData.lastName || ''}
                      onChange={handleUserDataChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> {t('onboarding.profile.birthDate')}
                  </Label>
                  <Input 
                    id="birthDate" 
                    name="birthDate"
                    type="date"
                    value={userData.birthDate || ''}
                    onChange={handleUserDataChange}
                  />
                </div>
                
                <div className="pt-4 space-y-2">
                  <Label htmlFor="referralCode">{t('onboarding.profile.referralCode')}</Label>
                  <Input 
                    id="referralCode" 
                    placeholder="Optional: Enter a referral code" 
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('onboarding.profile.referralDescription')}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('result')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.profile.back')}
                </Button>
                <Button 
                  onClick={handleFinish}
                  disabled={!isUserDataComplete()}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {t('onboarding.profile.complete')} <Star className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};