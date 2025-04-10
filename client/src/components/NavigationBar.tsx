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
import { zodiacElements } from '@/data/zodiacData';

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
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Get the first letter of the email for the avatar fallback
  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';
  
  // Get user's element for styling if they have a zodiac sign
  const userElement = userZodiacSign ? zodiacElements[userZodiacSign] : null;
  const getElementColor = (element: string | null) => {
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
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                HoroscopeHealth
              </div>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/">
            <a className="text-sm font-medium hover:text-primary transition-colors">Home</a>
          </Link>
          <Link href="/zodiac-library">
            <a className="text-sm font-medium hover:text-primary transition-colors">Zodiac Library</a>
          </Link>
          <Link href="/marketplace">
            <a className="text-sm font-medium hover:text-primary transition-colors">Marketplace</a>
          </Link>
          <Link href="/science">
            <a className="text-sm font-medium hover:text-primary transition-colors">Our Science</a>
          </Link>
          <Link href="/about">
            <a className="text-sm font-medium hover:text-primary transition-colors">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
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
                    <span>Premium</span>
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
                    <Link href="/dashboard">
                      <a className="flex items-center gap-2 w-full">
                        <BarChart className="h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile">
                      <a className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/settings">
                      <a className="flex items-center gap-2 w-full">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {isPremium ? (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/premium">
                        <a className="flex items-center gap-2 w-full">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span>Premium Features</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/pricing">
                        <a className="flex items-center gap-2 w-full">
                          <Shield className="h-4 w-4" />
                          <span>Upgrade to Premium</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2 text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth">
                <a>
                  <Button variant="outline" size="sm">Log In</Button>
                </a>
              </Link>
              <Link href="/auth?signup=true">
                <a>
                  <Button size="sm">Sign Up</Button>
                </a>
              </Link>
            </div>
          )}
          
          {/* Theme toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="hidden md:flex"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">Home</a>
                </Link>
                <Link href="/zodiac-library">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">Zodiac Library</a>
                </Link>
                <Link href="/marketplace">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">Marketplace</a>
                </Link>
                <Link href="/science">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">Our Science</a>
                </Link>
                <Link href="/about">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">About</a>
                </Link>
                <Link href="/contact">
                  <a className="text-lg font-medium hover:text-primary transition-colors py-2">Contact</a>
                </Link>
                {!isLoggedIn && (
                  <>
                    <div className="h-px bg-border my-2"></div>
                    <Link href="/auth">
                      <a className="text-lg font-medium hover:text-primary transition-colors py-2">Log In</a>
                    </Link>
                    <Link href="/auth?signup=true">
                      <a className="text-lg font-medium hover:text-primary transition-colors py-2">Sign Up</a>
                    </Link>
                  </>
                )}
                <div className="h-px bg-border my-2"></div>
                <Button 
                  variant="outline" 
                  className="flex justify-start items-center gap-2"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>
                {isLoggedIn && (
                  <Button 
                    variant="outline" 
                    className="flex justify-start items-center gap-2 text-red-600 border-red-200"
                    onClick={onLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}