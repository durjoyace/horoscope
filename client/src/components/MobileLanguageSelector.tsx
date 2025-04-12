import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
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

export function MobileLanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      {languages.map((lang) => {
        const isActive = language === lang.code;
        
        return (
          <Button
            key={lang.code}
            variant={isActive ? "default" : "outline"} 
            size="sm"
            className={`
              flex-1 justify-center items-center gap-2 py-5
              ${isActive ? 
                'bg-primary/90 hover:bg-primary shadow-sm' : 
                'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
              }
              transition-all duration-200
            `}
            onClick={() => setLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="font-medium">{lang.label}</span>
            {isActive && (
              <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
            )}
          </Button>
        );
      })}
    </div>
  );
}