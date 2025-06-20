import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Settings, 
  BarChart, 
  Shield, 
  Heart,
  Star,
  ArrowRight,
  ShoppingBag,
  Info,
  Gift
} from 'lucide-react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames, zodiacElements } from '@/data/zodiacData';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MobileLanguageSelector } from '@/components/MobileLanguageSelector';

interface NavBarProps {
  isLoggedIn: boolean;
  userEmail: string;
  userZodiacSign?: ZodiacSign;
  isPremium?: boolean;
  onLogout: () => void;
}



export function NavigationBar({ 
  isLoggedIn, 
  userEmail, 
  userZodiacSign, 
  isPremium = false,
  onLogout 
}: NavBarProps) {
  // This would normally come from a theme context
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t, language, setLanguage } = useLanguage();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Get the first letter of the email for the avatar fallback
  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';
  
  // Get user's element for styling if they have a zodiac sign
  const userElement = userZodiacSign ? 
    zodiacElements[userZodiacSign as ZodiacSign] : null;
  const getElementColor = (element: string | null | undefined) => {
    if (!element) return 'bg-primary';
    
    switch (element) {
      case 'Fire': return 'bg-red-600';
      case 'Earth': return 'bg-green-600';
      case 'Air': return 'bg-purple-600';
      case 'Water': return 'bg-blue-600';
      default: return 'bg-primary';
    }
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-3 sm:px-4 flex h-14 sm:h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">{t('hero.brand')}</span>
              <span className="xs:hidden">{t('hero.brand.abbr')}</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8">
          <Link href="/zodiac-library" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.zodiac')}
          </Link>
          
          <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.marketplace')}
          </Link>
          
          <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
            {t('community.title')}
          </Link>
          
          {!isPremium && (
            <Link href="/premium" className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors flex items-center gap-1">
              <Star className="h-3 w-3" />
              {t('nav.premium')}
            </Link>
          )}
        </nav>
        
        {/* User Menu and Mobile Nav */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Premium badge for premium users */}
              {isPremium && (
                <div className="hidden md:flex items-center mr-2">
                  <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{t('premium.label')}</span>
                  </div>
                </div>
              )}
              
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback className={`${getElementColor(userElement)} text-white`}>
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    {userZodiacSign && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-white dark:bg-background p-0.5 border-2 border-background">
                        <div className="text-xs">
                          {userZodiacSign === 'aries' && '♈'}
                          {userZodiacSign === 'taurus' && '♉'}
                          {userZodiacSign === 'gemini' && '♊'}
                          {userZodiacSign === 'cancer' && '♋'}
                          {userZodiacSign === 'leo' && '♌'}
                          {userZodiacSign === 'virgo' && '♍'}
                          {userZodiacSign === 'libra' && '♎'}
                          {userZodiacSign === 'scorpio' && '♏'}
                          {userZodiacSign === 'sagittarius' && '♐'}
                          {userZodiacSign === 'capricorn' && '♑'}
                          {userZodiacSign === 'aquarius' && '♒'}
                          {userZodiacSign === 'pisces' && '♓'}
                        </div>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{userEmail}</p>
                    {userZodiacSign && (
                      <p className="text-xs text-muted-foreground">
                        {userZodiacSign.charAt(0).toUpperCase() + userZodiacSign.slice(1)}
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 w-full">
                      <BarChart className="h-4 w-4" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/referrals" className="flex items-center gap-2 w-full text-purple-600">
                      <Gift className="h-4 w-4" />
                      <span>Share & Earn</span>
                    </Link>
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/premium" className="flex items-center gap-2 w-full text-amber-600">
                        <Star className="h-4 w-4" />
                        <span>Upgrade to Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/admin" className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4 text-purple-500" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2 text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                >
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/auth?signup=true">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-[#8a00ff] to-[#5000ff] hover:from-[#9a00ff] hover:to-[#6000ff] text-white font-medium shadow-sm hover:shadow-md transition-all"
                >
                  {t('nav.signup')}
                </Button>
              </Link>
            </div>
          )}
          
          {/* Language selector */}
          <div className="hidden md:flex">
            <LanguageSelector />
          </div>
          
          {/* Theme toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="hidden md:flex h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden h-9 w-9 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label={t('nav.menu')}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[300px] sm:max-w-[350px] p-4">
              <div className="flex flex-col h-full">
                {isLoggedIn && (
                  <div className="flex items-center gap-3 mb-4 mt-2 pb-4 border-b border-border">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback className={`${getElementColor(userElement)} text-white`}>
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{userEmail}</p>
                      {userZodiacSign && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{userZodiacSign.charAt(0).toUpperCase() + userZodiacSign.slice(1)}</span>
                          {isPremium && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full ml-1">
                              <Star className="h-2.5 w-2.5 mr-0.5" />{t('premium.label')}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              
                {/* Primary Navigation */}
                <nav className="flex flex-col gap-1 mb-6">
                  <Link href="/dashboard" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Today's Wellness</span>
                  </Link>
                  <Link href="/zodiac-library" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Your Sign</span>
                  </Link>
                  <Link href="/elements" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Elements Guide</span>
                  </Link>
                  <Link href="/marketplace" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Wellness Shop</span>
                  </Link>
                  <Link href="/community" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium">Community</span>
                  </Link>
                  <Link href="/referrals" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors text-purple-600">
                    <Gift className="h-4 w-4 mr-3" />
                    <span className="text-sm font-medium">Share & Earn</span>
                  </Link>
                </nav>
                
                {/* Premium Section */}
                {!isPremium && (
                  <div className="mb-6">
                    <Link href="/premium" className="block w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-200/30 hover:border-purple-300/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">Premium</span>
                          </div>
                          <p className="text-xs text-purple-600/80">Unlock personalized insights</p>
                        </div>
                        <div className="text-purple-600">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
                
                {/* Secondary Navigation */}
                <nav className="flex flex-col gap-1 mb-6">
                  <Link href="/about" className="flex w-full items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Info className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm font-medium">About</span>
                  </Link>
                </nav>
                
                {isLoggedIn && (
                  <div className="mt-auto pt-6 border-t border-border">
                    <nav className="flex flex-col gap-2">
                      <Link href="/referrals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Invite Friends</span>
                      </Link>
                      <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                      <button 
                        onClick={onLogout}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left w-full"
                      >
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </nav>
                  </div>
                )}
                
                {!isLoggedIn && (
                  <div className="mt-auto pt-6 border-t border-border">
                    <nav className="flex flex-col gap-2">
                      <Link href="/auth" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Login</span>
                      </Link>
                      <Link href="/signup" className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-200/30 transition-colors">
                        <Star className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Sign Up</span>
                      </Link>
                    </nav>
                  </div>
                )}
                

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}