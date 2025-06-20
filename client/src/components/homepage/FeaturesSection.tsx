import React from 'react';
import { Smartphone, Clock, Shield, Microscope, ShoppingBag, Brain } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Microscope className="w-8 h-8 text-purple-400" />,
      title: "Evidence-Based Approach",
      description: "Each recommendation is backed by scientific research and validated wellness practices, not generic horoscopes."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "AI-Powered Personalization",
      description: "Advanced algorithms analyze your astrological profile alongside proven health data to create truly personalized guidance."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-purple-400" />,
      title: "Curated Wellness Marketplace",
      description: "Access hand-picked supplements, wellness products, and health tools specifically recommended for your profile."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: "Convenient SMS Delivery",
      description: "Receive your daily insights directly via text message - no apps to download or remember to check."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      title: "Research-Backed Timing",
      description: "Recommendations are timed based on circadian science and astrological cycles for maximum effectiveness."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Medical Grade Privacy",
      description: "Your health data is protected with the same standards used by medical institutions."
    }
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose SMS Horoscopes?
          </h2>
          <p className="text-slate-300 text-lg">
            The most convenient way to receive personalized wellness guidance based on your zodiac sign.
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