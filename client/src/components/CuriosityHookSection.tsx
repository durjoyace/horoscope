import React, { useState } from 'react';
import { Brain, Clock, Zap, Eye, ArrowRight, ChevronDown } from 'lucide-react';

export const CuriosityHookSection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const zodiacInsights = {
    'aries': {
      emoji: '♈',
      peek: 'Your peak energy hits at 11 AM and 7 PM',
      detail: 'Aries bodies run on high-intensity cycles. Your cortisol spikes earlier than most people, making you naturally wired for morning workouts. But your real power hours are late morning and early evening when your Mars energy aligns with your circadian rhythm.'
    },
    'taurus': {
      emoji: '♉',
      peek: 'You digest food 40% better between 12-2 PM',
      detail: 'Taurus metabolisms are deeply connected to solar cycles. Your digestive fire peaks at midday, which is why you naturally crave hearty lunches. Evening meals should be lighter - your Venus-ruled system needs gentle winding down.'
    },
    'gemini': {
      emoji: '♊',
      peek: 'Your brain processes information fastest at 3 PM',
      detail: 'Gemini nervous systems have dual peaks. Your Mercury influence creates rapid-fire thinking in mid-afternoon when your neurotransmitters are perfectly balanced. Use this window for complex decisions and creative work.'
    },
    'cancer': {
      emoji: '♋',
      peek: 'Your sleep quality improves 200% with 9 PM bedtime',
      detail: 'Cancer biorhythms follow lunar patterns more than solar. Your melatonin production starts earlier than other signs, making you naturally suited for early bedtimes. Fighting this creates the mood swings you\'re known for.'
    },
    'leo': {
      emoji: '♌',
      peek: 'Your strength training results double at 2 PM',
      detail: 'Leo physiology peaks with the sun. Your testosterone and growth hormone surge in early afternoon, making this your golden hour for strength training. Morning workouts feel harder because you\'re fighting your natural cycle.'
    },
    'virgo': {
      emoji: '♍',
      peek: 'Your body detoxes most efficiently at 6 AM',
      detail: 'Virgo systems are naturally attuned to purification cycles. Your liver and kidneys work overtime in early morning hours. This is why you feel better with early morning water and light movement - you\'re working with your body\'s cleanup schedule.'
    }
  };

  const allSigns = Object.keys(zodiacInsights);
  const displaySigns = allSigns.slice(0, 6); // Show first 6 signs

  return (
    <section className="py-16 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-4">
              <Eye className="w-4 h-4" />
              <span>Sneak Peek</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Your Sign Reveals About Your Body
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Each zodiac sign has a unique biological signature. Here's what science has discovered about yours.
            </p>
          </div>

          {/* Interactive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {displaySigns.map((sign) => {
              const insight = zodiacInsights[sign as keyof typeof zodiacInsights];
              const isSelected = selectedSign === sign;
              
              return (
                <div
                  key={sign}
                  onClick={() => setSelectedSign(isSelected ? null : sign)}
                  className={`
                    cursor-pointer p-4 rounded-xl border transition-all duration-300
                    ${isSelected 
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{insight.emoji}</div>
                    <div className="text-white font-medium text-sm mb-2 capitalize">
                      {sign}
                    </div>
                    <div className="text-slate-300 text-xs leading-relaxed">
                      {insight.peek}
                    </div>
                    <ChevronDown className={`w-4 h-4 mx-auto mt-2 text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Insight */}
          {selectedSign && (
            <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-xl p-6 mb-8 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="text-3xl">
                  {zodiacInsights[selectedSign as keyof typeof zodiacInsights].emoji}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 capitalize">
                    {selectedSign} Deep Dive
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {zodiacInsights[selectedSign as keyof typeof zodiacInsights].detail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Teaser for more */}
          <div className="text-center bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">
              This Is Just the Beginning
            </h3>
            <p className="text-slate-300 mb-4 max-w-md mx-auto">
              Each sign has dozens of timing insights covering sleep, exercise, nutrition, focus, and more. 
              Discover your complete biological blueprint.
            </p>
            <div className="text-purple-400 font-medium text-sm">
              ↑ Enter your phone number above to unlock everything
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};