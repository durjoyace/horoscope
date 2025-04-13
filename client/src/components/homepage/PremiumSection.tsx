import React from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, MoveRight, Gift } from 'lucide-react';

export const PremiumSection: React.FC = () => {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  
  const premiumFeatures = [
    t('premium.features.weekly'),
    t('premium.features.compatibility'),
    t('premium.features.career'),
    t('premium.features.health'),
    t('premium.features.rituals'),
    t('premium.features.support')
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-slate-950 to-black">
      {/* Premium cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600 via-purple-900 to-indigo-900 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-900 blur-3xl"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
                <Star className="h-3.5 w-3.5 mr-1" />
                <span>{t('premium.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('premium.heading')}
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                {t('premium.description')}
              </p>
              
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg flex items-center"
                >
                  {t('premium.button')}
                  <MoveRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => navigate('/gift')}
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  {t('premium.gift')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <div className="relative bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 md:p-8 overflow-hidden shadow-xl shadow-purple-500/5">
                <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 opacity-20 blur-3xl"></div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-1">{t('premium.preview.title')}</h3>
                  <p className="text-purple-300/70 text-sm">{t('premium.preview.subtitle')}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-white/90">{t('premium.preview.section1.title')}</h4>
                    <p className="text-white/70">{t('premium.preview.section1.content')}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-white/90">{t('premium.preview.section2.title')}</h4>
                    <p className="text-white/70">{t('premium.preview.section2.content')}</p>
                  </div>
                  
                  <div className="pt-4 text-center">
                    <p className="text-sm text-purple-300/70">{t('premium.preview.note')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};