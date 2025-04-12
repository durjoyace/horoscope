import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZodiacSign } from '@shared/types';
import { useLanguage } from '@/context/LanguageContext';

interface WellnessQuoteWidgetProps {
  zodiacSign?: ZodiacSign;
  isPersonalized?: boolean;
}

type WellnessQuote = {
  text: string;
  author: string;
  element?: 'Fire' | 'Earth' | 'Air' | 'Water';
  tags: string[];
};

// Map zodiac signs to elements
const signToElement: Record<ZodiacSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  aries: 'Fire',
  leo: 'Fire',
  sagittarius: 'Fire',
  taurus: 'Earth',
  virgo: 'Earth',
  capricorn: 'Earth',
  gemini: 'Air',
  libra: 'Air',
  aquarius: 'Air',
  cancer: 'Water',
  scorpio: 'Water',
  pisces: 'Water'
};

// Collection of wellness quotes organized by elements
const wellnessQuotes: Record<'Fire' | 'Earth' | 'Air' | 'Water' | 'General', WellnessQuote[]> = {
  Fire: [
    {
      text: "Your energy is boundless today. Channel it into activities that spark your passion and revitalize your spirit.",
      author: "Fire Element Wisdom",
      element: 'Fire',
      tags: ['energy', 'passion', 'vitality']
    },
    {
      text: "Find strength in movement today. Your body craves dynamic expression and your mind benefits from active meditation.",
      author: "Fire Element Wisdom",
      element: 'Fire',
      tags: ['movement', 'strength', 'expression']
    },
    {
      text: "Today, be the flame that illuminates others. Your natural enthusiasm is contagious and healing.",
      author: "Fire Element Wisdom",
      element: 'Fire',
      tags: ['inspiration', 'enthusiasm', 'leadership']
    }
  ],
  Earth: [
    {
      text: "Ground yourself in nature's rhythm today. Place bare feet on soil to restore your energy and calm your mind.",
      author: "Earth Element Wisdom",
      element: 'Earth',
      tags: ['grounding', 'nature', 'stability']
    },
    {
      text: "Nurture your body with whole foods today. What you consume becomes the foundation of your physical temple.",
      author: "Earth Element Wisdom",
      element: 'Earth',
      tags: ['nutrition', 'sustenance', 'foundation']
    },
    {
      text: "Practice patience with yourself today. Like a seed becoming a tree, transformation happens in its own perfect time.",
      author: "Earth Element Wisdom",
      element: 'Earth',
      tags: ['patience', 'transformation', 'growth']
    }
  ],
  Air: [
    {
      text: "Your thoughts create your reality. Clear your mental space today through mindful breathing and conscious awareness.",
      author: "Air Element Wisdom",
      element: 'Air',
      tags: ['mindfulness', 'clarity', 'awareness']
    },
    {
      text: "Communication is your path to wellness today. Express what needs to be said with authenticity and compassion.",
      author: "Air Element Wisdom",
      element: 'Air',
      tags: ['communication', 'expression', 'clarity']
    },
    {
      text: "Let curiosity guide your wellness journey today. New knowledge expands your capacity for growth and healing.",
      author: "Air Element Wisdom",
      element: 'Air',
      tags: ['curiosity', 'learning', 'growth']
    }
  ],
  Water: [
    {
      text: "Your emotions are messengers of wisdom. Listen to their guidance without becoming submerged in their currents.",
      author: "Water Element Wisdom",
      element: 'Water',
      tags: ['emotions', 'intuition', 'flow']
    },
    {
      text: "Hydrate mindfully today. As you drink water, visualize it cleansing not just your body, but your emotional being.",
      author: "Water Element Wisdom",
      element: 'Water',
      tags: ['hydration', 'cleansing', 'purification']
    },
    {
      text: "Your intuition speaks clearly when you create stillness. Take time for quiet reflection or meditation today.",
      author: "Water Element Wisdom",
      element: 'Water',
      tags: ['intuition', 'stillness', 'reflection']
    }
  ],
  General: [
    {
      text: "The greatest wealth is health. Invest in your wellbeing today as your most valuable asset.",
      author: "Virgil",
      tags: ['health', 'wellbeing', 'investment']
    },
    {
      text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
      author: "Buddha",
      tags: ['mind-body', 'clarity', 'duty']
    },
    {
      text: "Take care of your body. It's the only place you have to live.",
      author: "Jim Rohn",
      tags: ['self-care', 'body', 'home']
    },
    {
      text: "Wellness is the complete integration of body, mind, and spirit - the realization that everything we do, think, feel, and believe has an effect on our state of well-being.",
      author: "Greg Anderson",
      tags: ['integration', 'wholeness', 'awareness']
    },
    {
      text: "The part can never be well unless the whole is well.",
      author: "Plato",
      tags: ['wholeness', 'balance', 'wellness']
    }
  ]
};

export function WellnessQuoteWidget({ zodiacSign, isPersonalized = false }: WellnessQuoteWidgetProps) {
  const [quote, setQuote] = useState<WellnessQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useLanguage();

  const getElementalColor = (element?: 'Fire' | 'Earth' | 'Air' | 'Water') => {
    switch (element) {
      case 'Fire': return 'from-orange-500 to-red-600';
      case 'Earth': return 'from-emerald-500 to-green-600';
      case 'Air': return 'from-sky-400 to-indigo-500';
      case 'Water': return 'from-blue-400 to-purple-600';
      default: return 'from-violet-500 to-purple-700';
    }
  };

  const fetchNewQuote = () => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      let selectedQuote: WellnessQuote;
      
      if (isPersonalized && zodiacSign) {
        // Get element based on zodiac sign
        const element = signToElement[zodiacSign];
        
        // Get quotes for that element
        const elementQuotes = wellnessQuotes[element];
        
        // Select random quote from element quotes
        selectedQuote = elementQuotes[Math.floor(Math.random() * elementQuotes.length)];
      } else {
        // Select from general quotes
        selectedQuote = wellnessQuotes.General[Math.floor(Math.random() * wellnessQuotes.General.length)];
      }
      
      setQuote(selectedQuote);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchNewQuote();
  }, [zodiacSign, isPersonalized]);

  if (!quote) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-purple-700/10 backdrop-blur-md border-primary/20">
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="rounded-full bg-primary/20 h-12 w-12 flex items-center justify-center">
              <Quote className="h-6 w-6 text-primary/40" />
            </div>
            <div className="h-4 bg-primary/20 rounded w-3/4"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2"></div>
            <div className="h-4 bg-primary/20 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getElementalColor(quote.element)} opacity-10`}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 opacity-20 text-6xl font-serif mr-4 mt-2">
        "
      </div>
      <div className="absolute bottom-0 left-0 opacity-20 text-6xl font-serif ml-4 mb-2 leading-none">
        "
      </div>
      
      <CardContent className="relative z-10 p-6 pt-8">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:bg-white/20"
            onClick={fetchNewQuote}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh quote</span>
          </Button>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-start space-x-3">
            <div className={`rounded-full p-1.5 bg-gradient-to-br ${getElementalColor(quote.element)} flex-shrink-0`}>
              <Quote className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {isPersonalized && zodiacSign ? t('quote.personal') : t('quote.daily')}
              </h3>
              {isPersonalized && zodiacSign && (
                <p className="text-xs text-muted-foreground">
                  <span className="capitalize">{zodiacSign}</span> • {t(`elements.${quote.element?.toLowerCase()}`)}
                </p>
              )}
            </div>
          </div>
          
          <blockquote className="text-base font-medium mt-2">
            "{quote.text}"
          </blockquote>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-muted-foreground italic">— {quote.author}</p>
            {quote.tags && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-xs text-primary/60">{quote.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}