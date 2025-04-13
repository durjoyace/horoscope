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
          <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
            Community
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
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/admin" className="flex items-center gap-2 w-full">
                      <BarChart className="h-4 w-4 text-purple-500" />
                      <span>Admin Dashboard</span>
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
              
                <nav className="flex flex-col gap-2 mb-2">
                  <Link href="/" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.home')}</span>
                  </Link>
                  <Link href="/zodiac-library" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.zodiac')}</span>
                  </Link>
                  <Link href="/elements" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.elements')}</span>
                  </Link>
                  <Link href="/marketplace" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.marketplace')}</span>
                  </Link>
                  <Link href="/community" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">Community</span>
                  </Link>
                  <Link href="/science" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.science')}</span>
                  </Link>
                  <Link href="/about" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.about')}</span>
                  </Link>
                  <Link href="/contact" className="flex w-full items-center p-2.5 rounded-md bg-background hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{t('nav.contact')}</span>
                  </Link>
                </nav>
                
                {isLoggedIn && (
                  <>
                    <div className="h-px bg-border my-3"></div>
                    <nav className="flex flex-col gap-2.5">
                      <Link href="/dashboard" className="flex items-center gap-3 p-2.5 rounded-md bg-muted/70 hover:bg-muted transition-colors">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BarChart className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{t('user.dashboard')}</span>
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-md bg-muted/70 hover:bg-muted transition-colors">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{t('user.profile')}</span>
                      </Link>
                      <Link href="/admin" className="flex items-center gap-3 p-2.5 rounded-md bg-muted/70 hover:bg-muted transition-colors">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <BarChart className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Admin Dashboard</span>
                      </Link>
                      {isPremium ? (
                        <Link href="/premium" className="flex items-center gap-3 p-2.5 rounded-md bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Star className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-amber-700">{t('premium.features')}</span>
                        </Link>
                      ) : (
                        <Link href="/premium" className="flex items-center gap-3 p-2.5 rounded-md bg-gradient-to-r from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-white">
                            <Shield className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-primary">{t('premium.upgrade')}</span>
                        </Link>
                      )}
                    </nav>
                  </>
                )}
                
                {!isLoggedIn && (
                  <>
                    <div className="h-px bg-border my-3"></div>
                    <div className="flex flex-col gap-2.5 mb-2">
                      <p className="text-sm text-muted-foreground px-1">{t('nav.account')}</p>
                      <Link href="/auth" className="flex items-center gap-3 p-2.5 rounded-md bg-muted/70 hover:bg-muted transition-colors">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{t('nav.login')}</span>
                      </Link>
                      <Link href="/auth?signup=true" className="flex items-center gap-3 p-2.5 rounded-md bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 hover:from-purple-600/20 hover:to-fuchsia-500/20 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-white">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{t('nav.signup')}</span>
                      </Link>
                    </div>
                  </>
                )}
                
                <div className="mt-auto pt-4">
                  {/* Language selector on mobile */}
                  <div className="mb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      <p className="text-sm font-medium text-muted-foreground">{t('nav.language')}</p>
                    </div>
                    <MobileLanguageSelector />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      <p className="text-sm font-medium text-muted-foreground">{t('theme.title')}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant={theme === 'light' ? "outline" : "default"}
                        size="lg"
                        className={`
                          flex-1 justify-center items-center gap-2 py-5 rounded-md
                          ${theme !== 'light' ? 
                            'bg-primary/90 hover:bg-primary text-white' : 
                            'bg-muted/50 hover:bg-muted border-primary/10'
                          }
                          transition-all duration-200
                        `}
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        aria-label={t('theme.dark')}
                      >
                        <Moon className="h-5 w-5" />
                        <span className="font-medium">{t('theme.dark')}</span>
                      </Button>
                      
                      <Button 
                        variant={theme === 'dark' ? "outline" : "default"}
                        size="lg"
                        className={`
                          flex-1 justify-center items-center gap-2 py-5 rounded-md
                          ${theme !== 'dark' ? 
                            'bg-primary/90 hover:bg-primary text-white' : 
                            'bg-muted/50 hover:bg-muted border-primary/10'
                          }
                          transition-all duration-200
                        `}
                        onClick={() => theme !== 'light' && toggleTheme()}
                        aria-label={t('theme.light')}
                      >
                        <Sun className="h-5 w-5" />
                        <span className="font-medium">{t('theme.light')}</span>
                      </Button>
                    </div>
                    
                    {isLoggedIn && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2 w-full justify-center items-center gap-2 py-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                        onClick={onLogout}
                        aria-label={t('nav.logout')}
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">{t('nav.logout')}</span>
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