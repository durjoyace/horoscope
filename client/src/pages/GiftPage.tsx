import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Package, Heart } from 'lucide-react';

const GiftPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-800 blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
            <Gift className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('gift.title')}</h1>
          <p className="text-lg text-slate-300">{t('gift.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm text-white overflow-hidden relative">
            <CardHeader>
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('gift.monthly.title')}</CardTitle>
              <CardDescription className="text-slate-300">{t('gift.monthly.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">{t('gift.monthly.price')}</span>
                <span className="text-sm text-slate-400 ml-2">{t('gift.monthly.period')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.monthly.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.monthly.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.monthly.feature3')}</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
                {t('gift.monthly.button')}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm text-white overflow-hidden relative">
            <CardHeader>
              <div className="absolute top-0 right-0 p-4">
                <Heart className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('gift.annual.title')}</CardTitle>
              <CardDescription className="text-slate-300">{t('gift.annual.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">{t('gift.annual.price')}</span>
                <span className="text-sm text-slate-400 ml-2">{t('gift.annual.period')}</span>
              </div>
              <div className="bg-purple-500/10 text-purple-300 text-sm rounded px-3 py-1.5 inline-block mb-4">
                {t('gift.annual.saving')}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.annual.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.annual.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <Package className="h-5 w-5 text-purple-400 mr-2 shrink-0 mt-0.5" />
                  <span>{t('gift.annual.feature3')}</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
                {t('gift.annual.button')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-3">{t('gift.how.title')}</h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="bg-purple-500/20 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">1</span>
              <span>{t('gift.how.step1')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500/20 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">2</span>
              <span>{t('gift.how.step2')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500/20 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">3</span>
              <span>{t('gift.how.step3')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-500/20 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">4</span>
              <span>{t('gift.how.step4')}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GiftPage;