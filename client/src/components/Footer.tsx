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
              Discover personalized wellness insights powered by the cosmos. 
              Our unique blend of astrological wisdom and modern health science 
              helps you align your wellness journey with the stars.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-purple-900/50 text-purple-400 hover:text-white hover:bg-purple-900/30" aria-label="Contact us by email">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Core Features */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/zodiac-library">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Your Sign</span>
                </Link>
              </li>
              <li>
                <Link href="/wellness-tips">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Wellness Tips</span>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Community</span>
                </Link>
              </li>
              <li>
                <Link href="/premium">
                  <span className="text-gray-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Premium
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Contact</span>
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
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</span>
              </Link>
              <Link href="/terms">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</span>
              </Link>
              <Link href="/accessibility">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">Accessibility</span>
              </Link>
              <Link href="/sitemap">
                <span className="text-xs text-gray-500 hover:text-purple-400 transition-colors cursor-pointer">Sitemap</span>
              </Link>
            </div>
            
            <div className="flex justify-center items-center gap-2 mb-3">
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-4 w-4 text-purple-300" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
              <Star className="h-3 w-3 text-purple-400" fill="currentColor" />
            </div>
            
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Battle Green Consulting LLC DBA Horoscope Health. All rights reserved.</p>
            
            <p className="mt-3 text-xs flex justify-center items-center gap-1 text-gray-500">
              Made with <Heart className="h-3 w-3 text-red-500 animate-pulse" fill="currentColor" /> for cosmic wellbeing
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;