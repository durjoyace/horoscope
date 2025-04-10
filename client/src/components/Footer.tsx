import { Link } from 'wouter';
import { Star, Mail, Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodiacSignNames } from '@/data/zodiacData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, we would submit this to an API
    toast({
      title: 'Thanks for subscribing!',
      description: 'You\'ve been added to our newsletter.',
    });
    
    setEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">HoroscopeHealth</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Bridging the gap between ancient astrological wisdom and modern wellness science for personalized health insights.
            </p>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" aria-label="Instagram" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Twitter" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Facebook" className="h-8 w-8 rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Email" className="h-8 w-8 rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/science" className="text-muted-foreground hover:text-foreground transition-colors">
                  The Science
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wellness Marketplace
                </Link>
              </li>
              <li>
                <Link href="/zodiac-library" className="text-muted-foreground hover:text-foreground transition-colors">
                  Zodiac Library
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Zodiac Signs</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {zodiacSignNames.map((sign) => (
                <Link
                  key={sign.value}
                  href={`/zodiac-library?sign=${sign.value}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {sign.symbol} {sign.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to receive personalized horoscopes, wellness tips, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-xs"
              />
              <Button type="submit" className="w-fit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            © {currentYear} HoroscopeHealth. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}