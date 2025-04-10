import { useState, useEffect } from 'react';
import { Link, useRoute, useLocation } from 'wouter';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  Star, 
  Home, 
  Info, 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  MailIcon, 
  Heart, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { zodiacSignNames } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

interface NavigationBarProps {
  isLoggedIn: boolean;
  userEmail?: string;
  userZodiacSign?: ZodiacSign;
  isPremium?: boolean;
  onLogout?: () => void;
}

export function NavigationBar({ 
  isLoggedIn, 
  userEmail = "", 
  userZodiacSign, 
  isPremium = false,
  onLogout 
}: NavigationBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, navigate] = useLocation();

  // Navigation items
  const navItems = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'About', href: '/about', icon: <Info className="h-4 w-4" /> },
    { label: 'Science', href: '/science', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Zodiac Library', href: '/zodiac-library', icon: <Star className="h-4 w-4" /> },
    { label: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="h-4 w-4" /> },
    { label: 'Contact', href: '/contact', icon: <MailIcon className="h-4 w-4" /> }
  ];

  // Protected routes that require login
  const protectedNavItems = [
    { 
      label: 'Dashboard', 
      href: '/dashboard', 
      icon: <LayoutDashboard className="h-4 w-4" />,
      badge: isPremium ? 'Premium' : undefined
    }
  ];

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler for logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm border-b' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">HoroscopeHealth</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const [isActive] = useRoute(item.href);
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={`flex items-center gap-1 ${isActive ? 'font-medium' : ''}`}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
            
            {isLoggedIn && protectedNavItems.map((item) => {
              const [isActive] = useRoute(item.href);
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={`flex items-center gap-1 ${isActive ? 'font-medium' : ''}`}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Authentication & User Menu */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              /* Login / Sign up buttons */
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth?signup=true">Sign up</Link>
                </Button>
              </div>
            ) : (
              /* User dropdown menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 pr-2 hover:bg-primary/5"
                  >
                    <div className="flex flex-col items-end text-right">
                      <span className="text-sm font-medium truncate max-w-[100px]">
                        {userEmail}
                      </span>
                      {userZodiacSign && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {zodiacSignNames.find(s => s.value === userZodiacSign)?.symbol} 
                          {userZodiacSign}
                          {isPremium && (
                            <span className="ml-1 inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {isPremium ? (
                      <div className="flex items-center gap-1">
                        <span>Premium Member</span>
                        <Heart className="h-3 w-3 text-amber-500 fill-amber-500" />
                      </div>
                    ) : (
                      'Free Account'
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard?upgrade=true" className="flex items-center gap-2 cursor-pointer">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>Upgrade to Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-bold text-lg">HoroscopeHealth</span>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="py-4 flex-grow">
                    {/* User info (if logged in) */}
                    {isLoggedIn && (
                      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{userEmail}</p>
                            {userZodiacSign && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                {zodiacSignNames.find(s => s.value === userZodiacSign)?.symbol} 
                                {userZodiacSign}
                                {isPremium && (
                                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    Premium
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Main Navigation */}
                    <nav className="space-y-1">
                      {navItems.map((item) => {
                        const [isActive] = useRoute(item.href);
                        return (
                          <SheetClose key={item.href} asChild>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={`w-full justify-start ${isActive ? 'font-medium' : ''}`}
                              asChild
                            >
                              <Link href={item.href} className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                              </Link>
                            </Button>
                          </SheetClose>
                        );
                      })}
                    </nav>

                    {/* Protected Navigation */}
                    {isLoggedIn && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="px-3 text-sm font-medium text-muted-foreground mb-2">Account</h4>
                        <nav className="space-y-1">
                          {protectedNavItems.map((item) => {
                            const [isActive] = useRoute(item.href);
                            return (
                              <SheetClose key={item.href} asChild>
                                <Button
                                  variant={isActive ? "secondary" : "ghost"}
                                  className={`w-full justify-start ${isActive ? 'font-medium' : ''}`}
                                  asChild
                                >
                                  <Link href={item.href} className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {item.badge && (
                                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                </Button>
                              </SheetClose>
                            );
                          })}
                          
                          {!isPremium && isLoggedIn && (
                            <SheetClose asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start mt-2"
                                asChild
                              >
                                <Link href="/dashboard?upgrade=true" className="flex items-center gap-3">
                                  <Star className="h-4 w-4 text-amber-500" />
                                  <span>Upgrade to Premium</span>
                                </Link>
                              </Button>
                            </SheetClose>
                          )}
                        </nav>
                      </div>
                    )}
                  </div>

                  {/* Authentication buttons (if not logged in) */}
                  {!isLoggedIn ? (
                    <div className="pt-4 border-t flex flex-col gap-2">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/auth">Log in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full" asChild>
                          <Link href="/auth?signup=true">Sign up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <span>Log out</span>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}