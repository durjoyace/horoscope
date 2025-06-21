import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Check, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageOption {
  code: 'en' | 'es';
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="group h-8 w-8 rounded-full hover:bg-purple-500/10 hover:border-purple-400/30 transition-all duration-300 border border-transparent">
          <Globe className="h-4 w-4 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
          <span className="sr-only">{t('nav.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/20">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="group cursor-pointer flex items-center justify-between py-3 px-3 hover:bg-purple-500/10 hover:text-purple-200 transition-all duration-300 rounded-md mx-1"
            onClick={() => setLanguage(lang.code)}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
            </span>
            {language === lang.code && (
              <Check className="h-4 w-4 text-emerald-400 animate-pulse" style={{animationDuration: '2s'}} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}