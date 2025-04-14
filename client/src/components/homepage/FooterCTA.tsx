import React from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const FooterCTA: React.FC = () => {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-t from-slate-950 to-black">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-[2/1] rounded-full bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900 blur-3xl opacity-30"></div>
          <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-30"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('cta.heading')}
          </h2>
          <p className="text-lg md:text-xl text-purple-200/70 mb-8 max-w-3xl mx-auto">
            {t('cta.subheading')}
          </p>
          
          <Button
            onClick={() => navigate('/auth?signup=true')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-8 py-6 h-auto text-lg rounded-lg shadow-lg shadow-purple-900/20 flex items-center mx-auto"
          >
            {t('cta.button')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          

        </div>
      </div>
    </section>
  );
};