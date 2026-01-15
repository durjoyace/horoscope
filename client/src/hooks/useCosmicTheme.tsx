/**
 * Cosmic Theme Hook
 * Manages theme switching and persistence
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'cosmic-dark' | 'cosmic-light' | 'system';
type ResolvedTheme = 'cosmic-dark' | 'cosmic-light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'astral-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'cosmic-dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'cosmic-dark'
    : 'cosmic-light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function CosmicThemeProvider({
  children,
  defaultTheme = 'cosmic-dark',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme)
  );

  // Apply theme to document
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);

    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);

    // Also set class for compatibility
    root.classList.remove('cosmic-dark', 'cosmic-light');
    root.classList.add(resolved);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolved === 'cosmic-dark' ? '#0A0A1A' : '#F5F3FF'
      );
    }

    // Store preference
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      if (current === 'cosmic-dark') return 'cosmic-light';
      if (current === 'cosmic-light') return 'cosmic-dark';
      // If system, toggle to opposite of current resolved
      return resolvedTheme === 'cosmic-dark' ? 'cosmic-light' : 'cosmic-dark';
    });
  };

  const isDark = resolvedTheme === 'cosmic-dark';

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useCosmicTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCosmicTheme must be used within a CosmicThemeProvider');
  }
  return context;
}

// Theme toggle button component
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({
  className,
  showLabel = false,
  size = 'md',
}: ThemeToggleProps) {
  const { theme, setTheme, isDark } = useCosmicTheme();

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.button
      className={cn(
        'relative flex items-center justify-center rounded-full',
        'bg-cosmic-surface border border-cosmic-border',
        'hover:bg-cosmic-surface-light hover:border-cosmic-border-light',
        'transition-colors duration-200',
        sizeClasses[size],
        className
      )}
      onClick={() => setTheme(isDark ? 'cosmic-light' : 'cosmic-dark')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon size={iconSizes[size]} className="text-purple-400" />
        ) : (
          <Sun size={iconSizes[size]} className="text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}

// Full theme selector with system option
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme, isDark } = useCosmicTheme();

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'cosmic-light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'cosmic-dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <div
      className={cn(
        'inline-flex rounded-full p-1',
        'bg-cosmic-surface border border-cosmic-border',
        className
      )}
    >
      {options.map((option) => {
        const isActive = theme === option.value;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value}
            className={cn(
              'relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
              'transition-colors duration-200',
              isActive
                ? 'text-cosmic-text-primary'
                : 'text-cosmic-text-tertiary hover:text-cosmic-text-secondary'
            )}
            onClick={() => setTheme(option.value)}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-cosmic-surface-light border border-cosmic-border-light rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              <Icon size={16} />
            </span>
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default useCosmicTheme;
