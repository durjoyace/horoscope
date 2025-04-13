import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, BookmarkPlus, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { WellnessTip, getRandomTip } from "@/data/wellnessTips";
import { Badge } from "@/components/ui/badge";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { ZodiacSign } from "@/data/wellnessTips";
import { cn } from "@/lib/utils";

// Map categories to colors
const categoryColors: Record<string, string> = {
  nutrition: "bg-green-500/10 text-green-500 border-green-500/20",
  exercise: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  mindfulness: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  sleep: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  hydration: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

// Map elements to colors
const elementColors: Record<string, string> = {
  fire: "bg-red-500/10 text-red-500 border-red-500/20",
  earth: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  air: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  water: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

interface WellnessTipPopupProps {
  initialTip?: WellnessTip;
  userZodiacSign?: ZodiacSign;
  elementType?: string;
  onClose?: () => void;
  autoShow?: boolean;
  autoShowDelay?: number;
}

const WellnessTipPopup: React.FC<WellnessTipPopupProps> = ({
  initialTip,
  userZodiacSign,
  elementType,
  onClose,
  autoShow = false,
  autoShowDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(!autoShow);
  const [tip, setTip] = useState<WellnessTip | null>(initialTip || null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const [savedTips, setSavedTips] = useLocalStorage<WellnessTip[]>("saved-wellness-tips", []);
  
  useEffect(() => {
    // If no initial tip is provided, get a random one
    if (!tip) {
      const newTip = getRandomTip(userZodiacSign, elementType);
      setTip(newTip);
    }
    
    // If autoShow is enabled, show the popup after the specified delay
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, autoShowDelay);
      
      return () => clearTimeout(timer);
    }
  }, [userZodiacSign, elementType, autoShow, autoShowDelay]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };
  
  const getNextTip = () => {
    const newTip = getRandomTip(userZodiacSign, elementType);
    setTip(newTip);
  };
  
  const saveTip = () => {
    if (tip) {
      // Check if the tip is already saved
      const isSaved = savedTips.some(savedTip => savedTip.id === tip.id);
      
      if (!isSaved) {
        const updatedSavedTips = [...savedTips, tip];
        setSavedTips(updatedSavedTips);
        
        toast({
          title: t('tips.savedTitle') || "Tip Saved",
          description: t('tips.savedDescription') || "This wellness tip has been saved to your collection.",
        });
      } else {
        toast({
          title: t('tips.alreadySavedTitle') || "Already Saved",
          description: t('tips.alreadySavedDescription') || "This wellness tip is already in your collection.",
        });
      }
    }
  };
  
  const shareTip = () => {
    if (tip) {
      if (navigator.share) {
        navigator.share({
          title: tip.title,
          text: tip.content,
          url: window.location.href,
        }).catch(error => {
          console.error('Error sharing:', error);
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(`${tip.title}: ${tip.content}`);
        
        toast({
          title: t('tips.copiedTitle') || "Copied to Clipboard",
          description: t('tips.copiedDescription') || "The wellness tip has been copied to clipboard.",
        });
      }
    }
  };
  
  if (!tip || !isVisible) {
    return null;
  }

  const getTipTypeLabel = () => {
    if (tip.zodiacSigns?.includes(userZodiacSign as ZodiacSign)) {
      return t('tips.zodiac') || 'Zodiac';
    } else if (tip.element) {
      return t('tips.element') || 'Element';
    } else {
      return t('tips.universal') || 'Universal';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }
            }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <Card className="border border-purple-500/30 bg-black/90 backdrop-blur-lg shadow-xl shadow-purple-800/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-purple-400 font-semibold">
                      {t('tips.daily') || 'Daily Tip'}
                    </span>
                    <CardTitle className="mt-1 text-xl font-bold flex items-center gap-2">
                      {tip.emoji} {tip.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {t('tips.personalized') || 'Personalized for your cosmic profile'}
                    </CardDescription>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleClose}
                    aria-label={t('tips.close') || 'Close'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={cn("text-xs", categoryColors[tip.category])}>
                    {t(`tips.category.${tip.category}`) || tip.category}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                    {getTipTypeLabel()}
                  </Badge>
                  
                  {tip.element && (
                    <Badge variant="outline" className={cn("text-xs", elementColors[tip.element])}>
                      {tip.element.charAt(0).toUpperCase() + tip.element.slice(1)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-base leading-relaxed">{tip.content}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={saveTip}
                    className="group"
                  >
                    <BookmarkPlus className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
                    {t('tips.save') || 'Save Tip'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareTip}
                    className="group"
                  >
                    <Share2 className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
                    {t('tips.share') || 'Share'}
                  </Button>
                </div>
                
                <Button
                  onClick={getNextTip}
                  size="sm"
                  className="group"
                >
                  {t('tips.next') || 'Next Tip'}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WellnessTipPopup;