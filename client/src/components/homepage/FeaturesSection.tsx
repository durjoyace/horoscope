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