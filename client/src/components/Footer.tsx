import { Link } from 'wouter';
import { Star, Mail, Instagram, Twitter, Facebook, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodiacSignNames } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';

export function Footer() {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Footer navigation
  const footerNav = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Science', href: '/science' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Zodiac Library', href: '/zodiac-library' },
        { label: 'Wellness Marketplace', href: '/marketplace' },
        { label: 'Premium Reports', href: '/dashboard' },
        { label: 'Health Compatibility', href: '/compatibility' },
        { label: 'Horoscope Archive', href: '/archive' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Billing FAQ', href: '/billing-faq' },
        { label: 'Accessibility', href: '/accessibility' },
      ]
    }
  ];
  
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-primary/10 p-1">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">HoroscopeHealth</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your personalized cosmic wellness guide, bridging ancient astrological wisdom with modern health science for holistic wellbeing.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Your email address" 
                  className="bg-background"
                  type="email"
                />
                <Button>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
          
          {/* Navigation Sections */}
          {footerNav.map((section) => (
            <div key={section.title} className="md:col-span-1">
              <h4 className="font-medium text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Zodiac Signs */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-lg mb-4">Zodiac Signs</h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-3">
              {zodiacSignNames.map((sign: any) => (
                <li key={sign.value}>
                  <Link 
                    href={`/zodiac-library?sign=${sign.value}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <span>{sign.symbol}</span>
                    <span>{sign.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Lower Footer */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground order-2 md:order-1">
            &copy; {currentYear} HoroscopeHealth. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:hello@horoscopehealth.com" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        
        {/* Made with Love Banner */}
        <div className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>and cosmic energy</span>
        </div>
      </div>
    </footer>
  );
}