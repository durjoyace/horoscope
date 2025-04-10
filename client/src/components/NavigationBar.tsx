import { useState } from 'react';
import { Link } from 'wouter';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  LogIn, 
  User, 
  LogOut, 
  ChevronDown, 
  Star, 
  Sparkles
} from 'lucide-react';
import { ZodiacSign } from '@shared/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavigationBarProps {
  isLoggedIn: boolean;
  userEmail: string;
  userZodiacSign?: ZodiacSign;
  isPremium?: boolean;
  onLogout?: () => void;
}

export function NavigationBar({
  isLoggedIn,
  userEmail,
  userZodiacSign,
  isPremium = false,
  onLogout,
}: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getZodiacEmoji = (sign?: ZodiacSign): string => {
    if (!sign) return '✨';
    
    const emojis: Record<ZodiacSign, string> = {
      aries: '♈',
      taurus: '♉',
      gemini: '♊',
      cancer: '♋',
      leo: '♌',
      virgo: '♍',
      libra: '♎',
      scorpio: '♏',
      sagittarius: '♐',
      capricorn: '♑',
      aquarius: '♒',
      pisces: '♓'
    };
    return emojis[sign] || '✨';
  };

  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'U';

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'The Science', path: '/science' },
    { title: 'Zodiac Library', path: '/zodiac-library' },
    { title: 'Wellness Marketplace', path: '/marketplace' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">HoroscopeHealth</span>
          {isPremium && (
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1 pr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs">{getZodiacEmoji(userZodiacSign)} {userZodiacSign}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/">
              <Button variant="default" size="sm" className="hidden md:flex">
                <LogIn className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-4 px-1 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={closeMenu}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="pt-4">
                  {!isLoggedIn && (
                    <Link href="/" onClick={closeMenu}>
                      <Button className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  )}
                  {isLoggedIn && (
                    <>
                      <Link href="/dashboard" onClick={closeMenu}>
                        <Button variant="outline" className="w-full mb-2">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          if (onLogout) onLogout();
                          closeMenu();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}