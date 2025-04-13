import React, { useState, useEffect } from 'react';
import WellnessTipPopup from './WellnessTipPopup';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { ZodiacSign } from '@/data/wellnessTips';

interface WellnessTipManagerProps {
  userZodiacSign?: ZodiacSign;
  elementType?: string;
  autoShowDelay?: number;
  showButton?: boolean;
  buttonClassName?: string;
}

const WellnessTipManager: React.FC<WellnessTipManagerProps> = ({
  userZodiacSign,
  elementType,
  autoShowDelay = 30000, // 30 seconds default
  showButton = true,
  buttonClassName = '',
}) => {
  const [showTip, setShowTip] = useState(false);
  const [lastShown, setLastShown] = useLocalStorage<number>('wellness-tip-last-shown', 0);
  const [tipsCounter, setTipsCounter] = useLocalStorage<number>('wellness-tips-counter', 0);
  const { t } = useLanguage();
  
  // Auto-show the tip if enough time has passed since last shown
  useEffect(() => {
    const now = Date.now();
    const sixHoursInMillis = 6 * 60 * 60 * 1000;
    
    // Only auto-show if at least 6 hours have passed since last shown
    // and not showing immediately on page load (wait for delay)
    if (now - lastShown > sixHoursInMillis) {
      const timer = setTimeout(() => {
        setShowTip(true);
        setLastShown(now);
        setTipsCounter((prevCount: number) => prevCount + 1);
      }, autoShowDelay);
      
      return () => clearTimeout(timer);
    }
  }, [lastShown, setLastShown, autoShowDelay, setTipsCounter]);
  
  const handleShowTip = () => {
    setShowTip(true);
    setLastShown(Date.now());
    setTipsCounter((prevCount: number) => prevCount + 1);
  };
  
  const handleCloseTip = () => {
    setShowTip(false);
  };
  
  return (
    <>
      {showButton && (
        <Button
          onClick={handleShowTip}
          variant="ghost"
          size="sm"
          className={`transition-all hover:bg-purple-600/20 hover:text-purple-400 ${buttonClassName}`}
        >
          <Sparkles className="w-4 h-4 mr-1.5" /> 
          {t('tips.title') || 'Wellness Tip'}
        </Button>
      )}
      
      {showTip && (
        <WellnessTipPopup
          userZodiacSign={userZodiacSign}
          elementType={elementType}
          onClose={handleCloseTip}
        />
      )}
    </>
  );
};

export default WellnessTipManager;