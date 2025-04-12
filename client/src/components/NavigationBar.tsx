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
  Star
} from 'lucide-react';
import { ZodiacSign } from '@shared/types';
import { zodiacSignNames } from '@/data/zodiacData';
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
    zodiacSignNames.find(sign => sign.value === userZodiacSign)?.element : null;
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
        <nav className="hidden md:flex gap-3 lg:gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/zodiac-library" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.zodiac')}
          </Link>
          <Link href="/elements" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.elements')}
          </Link>
          <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.marketplace')}
          </Link>
          <Link href="/science" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.science')}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.contact')}
          </Link>
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
                      <span>{t('user.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      <span>{t('user.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/settings" className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4" />
                      <span>{t('user.settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  {isPremium ? (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/premium" className="flex items-center gap-2 w-full">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>{t('premium.features')}</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/premium" className="flex items-center gap-2 w-full">
                        <Shield className="h-4 w-4" />
                        <span>{t('premium.upgrade')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
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
              
                <nav className="flex flex-col gap-1.5 mb-1">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.home')}</span>
                  </Link>
                  <Link href="/zodiac-library" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.zodiac')}</span>
                  </Link>
                  <Link href="/elements" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.elements')}</span>
                  </Link>
                  <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.marketplace')}</span>
                  </Link>
                  <Link href="/science" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.science')}</span>
                  </Link>
                  <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.about')}</span>
                  </Link>
                  <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center">
                    <span>{t('nav.contact')}</span>
                  </Link>
                </nav>
                
                {isLoggedIn && (
                  <>
                    <div className="h-px bg-border my-3"></div>
                    <nav className="flex flex-col gap-1.5">
                      <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span>{t('user.dashboard')}</span>
                      </Link>
                      <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{t('user.profile')}</span>
                      </Link>
                      {isPremium ? (
                        <Link href="/premium" className="text-sm font-medium text-amber-500 hover:text-amber-600 transition-colors py-2.5 px-2 rounded-md hover:bg-amber-500/10 flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span>{t('premium.features')}</span>
                        </Link>
                      ) : (
                        <Link href="/premium" className="text-sm font-medium hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-primary/10 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>{t('premium.upgrade')}</span>
                        </Link>
                      )}
                    </nav>
                  </>
                )}
                
                {!isLoggedIn && (
                  <>
                    <div className="h-px bg-border my-3"></div>
                    <div className="flex gap-2 mb-2">
                      <Link href="/auth" className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                        >
                          {t('nav.login')}
                        </Button>
                      </Link>
                      <Link href="/auth?signup=true" className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-[#8a00ff] to-[#5000ff] hover:from-[#9a00ff] hover:to-[#6000ff] text-white font-medium shadow-sm hover:shadow-md transition-all"
                        >
                          {t('nav.signup')}
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
                
                <div className="mt-auto pt-4">
                  {/* Language selector on mobile */}
                  <div className="mb-3 flex flex-col gap-2">
                    <p className="text-sm font-medium mb-1">{t('nav.language')}</p>
                    <MobileLanguageSelector />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 justify-center items-center gap-2 bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors"
                      onClick={toggleTheme}
                      aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4" />
                          <span className="text-sm">{t('theme.dark')}</span>
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4" />
                          <span className="text-sm">{t('theme.light')}</span>
                        </>
                      )}
                    </Button>
                    
                    {isLoggedIn && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 justify-center items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                        onClick={onLogout}
                        aria-label={t('nav.logout')}
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">{t('nav.logout')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}