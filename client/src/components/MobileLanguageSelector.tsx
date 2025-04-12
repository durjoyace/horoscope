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
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"} 
          size="sm"
          className="flex-1 justify-center items-center gap-1"
          onClick={() => setLanguage(lang.code)}
        >
          <span className="mr-1">{lang.flag}</span>
          <span>{lang.label}</span>
        </Button>
      ))}
    </div>
  );
}