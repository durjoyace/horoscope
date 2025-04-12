import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodiacSignNames } from '@/data/zodiacData';

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
  const elementGroups = groupByElement();
  
  return (
    <footer className="bg-primary/5 text-foreground border-t border-primary/10 pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About Column */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Horoscope Health</h3>
            <p className="text-muted-foreground mb-4">
              Discover personalized wellness insights powered by the cosmos. 
              Our unique blend of astrological wisdom and modern health science 
              helps you align your wellness journey with the stars.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/zodiac-library">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Zodiac Library</span>
                </Link>
              </li>
              <li>
                <Link href="/marketplace">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Wellness Marketplace</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/science">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Our Science</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/premium">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Premium</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Elements Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">Elements</h3>
            <ul className="space-y-2">
              {Object.keys(elementGroups).map(element => (
                <li key={element}>
                  <Link href="/elements">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{element} Signs</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Zodiac Signs */}
          <div>
            <h3 className="text-lg font-bold mb-4">Zodiac Signs</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {zodiacSignNames.map((sign: any) => (
                <div key={sign.value}>
                  <Link href="/zodiac-library">
                    <span className="text-muted-foreground hover:text-primary transition-colors flex items-center cursor-pointer">
                      <span className="mr-1">{sign.symbol}</span> {sign.label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Credits */}
        <div className="border-t border-primary/10 pt-4 mt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Battle Green Consulting LLC. All rights reserved.</p>
          <p className="mt-2">
            For entertainment purposes only. The content provided does not constitute medical advice.
          </p>
          <p className="mt-2 flex justify-center items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 animate-pulse" fill="currentColor" /> for wellbeing
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;