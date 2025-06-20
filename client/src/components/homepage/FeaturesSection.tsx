import React from 'react';
import { Smartphone, Clock, Shield, Zap, Heart, Star } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: "SMS Delivery",
      description: "Get your horoscope directly on your phone every morning - no app downloads needed."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      title: "Daily Routine",
      description: "Consistent morning wellness insights to help you start each day with purpose and clarity."
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-400" />,
      title: "Health Focused",
      description: "Personalized wellness guidance combining astrological wisdom with practical health advice."
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Instant Access",
      description: "No login required, no apps to remember - your guidance arrives when you need it most."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Privacy First",
      description: "Your personal information stays secure. Unsubscribe anytime with a simple reply."
    },
    {
      icon: <Star className="w-8 h-8 text-purple-400" />,
      title: "Expert Insights",
      description: "AI-powered astrological guidance tailored specifically to your zodiac sign and wellness goals."
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