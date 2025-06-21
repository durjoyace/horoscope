import React from 'react';
import { Smartphone, Clock, Shield, Microscope, ShoppingBag, Brain } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Microscope className="w-8 h-8 text-purple-400" />,
      title: t('features.evidence.title'),
      description: t('features.evidence.description')
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: t('features.ai.title'),
      description: t('features.ai.description')
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-purple-400" />,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description')
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: t('features.sms.title'),
      description: t('features.sms.description')
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      title: t('features.timing.title'),
      description: t('features.timing.description')
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: t('features.privacy.title'),
      description: t('features.privacy.description')
    }
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('features.sms.heading')}
          </h2>
          <p className="text-slate-300 text-lg">
            {t('features.sms.subheading')}
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Sophisticated gradient overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Enhanced icon with glow effect */}
              <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {feature.icon}
                </div>
              </div>
              
              {/* Title with gradient hover effect */}
              <h3 className="relative text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-violet-200 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              
              {/* Description with enhanced readability */}
              <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};