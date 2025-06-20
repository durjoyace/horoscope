import React from 'react';
import { Smartphone, Clock, Shield, Microscope, ShoppingBag, Brain } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      title: "Perfect Timing, Every Day",
      description: "Discover the exact hours when your body is primed for exercise, optimal for eating, and ready for deep rest."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "Your Body's Secret Schedule",
      description: "Most people fight their natural rhythms. We reveal when your zodiac sign's biology works best."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: "Arrives When You Need It",
      description: "Daily insights texted to your phone at the perfect moment. No apps, no notifications to ignore."
    },
    {
      icon: <Microscope className="w-8 h-8 text-purple-400" />,
      title: "Science + Ancient Wisdom",
      description: "Chronobiology research proves your birth sign affects your circadian patterns. We just tell you how to use it."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-purple-400" />,
      title: "Recommendations That Work",
      description: "Skip the guesswork. Get specific product suggestions that align with your body's natural cycles."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Your Data Stays Private",
      description: "Medical-grade security protects your personal information. We help you, not harvest your data."
    }
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop Guessing When Your Body Works Best
          </h2>
          <p className="text-slate-300 text-lg">
            Most wellness advice ignores your natural timing. We tell you exactly when to act for maximum results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};