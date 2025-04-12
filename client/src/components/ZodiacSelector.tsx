import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZodiacSign } from '@shared/types';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface ZodiacSelectorProps {
  onSelect: (sign: ZodiacSign) => void;
  className?: string;
  selectedSign?: ZodiacSign;
  compact?: boolean;
}

const zodiacSigns: Array<{
  sign: ZodiacSign;
  icon: string;
  dates: string;
}> = [
  { sign: 'aries', icon: '♈', dates: 'Mar 21 - Apr 19' },
  { sign: 'taurus', icon: '♉', dates: 'Apr 20 - May 20' },
  { sign: 'gemini', icon: '♊', dates: 'May 21 - Jun 20' },
  { sign: 'cancer', icon: '♋', dates: 'Jun 21 - Jul 22' },
  { sign: 'leo', icon: '♌', dates: 'Jul 23 - Aug 22' },
  { sign: 'virgo', icon: '♍', dates: 'Aug 23 - Sep 22' },
  { sign: 'libra', icon: '♎', dates: 'Sep 23 - Oct 22' },
  { sign: 'scorpio', icon: '♏', dates: 'Oct 23 - Nov 21' },
  { sign: 'sagittarius', icon: '♐', dates: 'Nov 22 - Dec 21' },
  { sign: 'capricorn', icon: '♑', dates: 'Dec 22 - Jan 19' },
  { sign: 'aquarius', icon: '♒', dates: 'Jan 20 - Feb 18' },
  { sign: 'pisces', icon: '♓', dates: 'Feb 19 - Mar 20' },
];

export function ZodiacSelector({ 
  onSelect, 
  className, 
  selectedSign,
  compact = false
}: ZodiacSelectorProps) {
  const { t } = useLanguage();
  const [selectedZodiacSign, setSelectedZodiacSign] = useState<ZodiacSign | undefined>(selectedSign);
  
  const handleSelect = (sign: ZodiacSign) => {
    setSelectedZodiacSign(sign);
    onSelect(sign);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <h2 className="text-2xl font-bold text-center mb-4">
        {t('zodiac.selectTitle')}
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        {t('zodiac.selectDescription')}
      </p>
      
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {zodiacSigns.map(({ sign, icon, dates }) => (
          <motion.div
            key={sign}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center p-3 h-auto w-full aspect-square rounded-lg border-2 gap-1 hover:bg-primary/5",
                selectedZodiacSign === sign && "border-primary bg-primary/10 hover:bg-primary/15"
              )}
              onClick={() => handleSelect(sign)}
              aria-label={t(`zodiac.signs.${sign}`)}
            >
              <span className="text-3xl">{icon}</span>
              <span className="font-medium capitalize text-sm">
                {t(`zodiac.signs.${sign}`)}
              </span>
              {!compact && (
                <span className="text-xs text-muted-foreground mt-1">
                  {dates}
                </span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
      
      {selectedZodiacSign && (
        <div className="text-center mt-8 mb-4">
          <h3 className="text-xl font-semibold capitalize">
            {t(`zodiac.signs.${selectedZodiacSign}`)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {zodiacSigns.find(s => s.sign === selectedZodiacSign)?.dates}
          </p>
        </div>
      )}
    </div>
  );
}