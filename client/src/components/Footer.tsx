import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Mail, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodiacSignNames } from '@/data/zodiacData';
import { useLanguage } from '@/context/LanguageContext';

// Group zodiac signs by element
const groupByElement = () => {
  const groups: Record<string, any[]> = {};
  
  zodiacSignNames.forEach((sign: any) => {
    if (!groups[sign.element]) {
      groups[sign.element] = [];
    }
    groups[sign.element].push(sign);
  });
  
  return groups;
};

export function Footer() {
  const { t } = useLanguage();
  const elementGroups = groupByElement();
  
  return (
    <footer className="bg-black text-white border-t border-purple-900/40 pt-10 pb-6">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-purple-900/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-1/5 h-1/5 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Horoscope Health</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="group rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30 hover:border-purple-600/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
              <Button size="icon" variant="ghost" className="group rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30 hover:border-purple-600/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
              <Button size="icon" variant="ghost" className="group rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30 hover:border-purple-600/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
              <Button size="icon" variant="ghost" className="group rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30 hover:border-purple-600/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300" aria-label="Contact us by email">
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </div>
          </div>
          
          {/* Core Features */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.discover')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/zodiac-library">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.yourSign')}</span>
                </Link>
              </li>
              <li>
                <Link href="/wellness-tips">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.wellnessTips')}</span>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.community')}</span>
                </Link>
              </li>
              <li>
                <Link href="/premium">
                  <span className="text-gray-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {t('footer.premium')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.faq')}</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.about')}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.contact')}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Credits */}
        <div className="border-t border-purple-900/40 pt-6 mt-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-400 mb-3">{t('footer.disclaimer')}</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 mb-4">
              <Link href="/privacy">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.privacyPolicy')}</span>
              </Link>
              <Link href="/terms">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.termsOfService')}</span>
              </Link>
              <Link href="/accessibility">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.accessibility')}</span>
              </Link>
              <Link href="/sitemap">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">{t('footer.sitemap')}</span>
              </Link>
            </div>
            
            <div className="flex justify-center items-center gap-2 mb-3">
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-4 w-4 text-purple-300" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
            </div>
            
            <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
            
            <p className="mt-3 text-xs flex justify-center items-center gap-1 text-gray-500">
              {t('footer.madeWith')} <Heart className="h-3 w-3 text-red-500 animate-pulse" fill="currentColor" /> {t('footer.forCosmicWellbeing')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;