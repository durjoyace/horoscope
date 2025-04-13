import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, BookmarkMinus, MoreVertical, ArrowLeft } from 'lucide-react';
import { WellnessTip } from '@/data/wellnessTips';
import { useLanguage } from '@/context/LanguageContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useNavigate } from 'wouter';

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

const SavedTipsPage: React.FC = () => {
  const { t } = useLanguage();
  const [savedTips, setSavedTips] = useLocalStorage<WellnessTip[]>('saved-wellness-tips', []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const filteredTips = activeCategory 
    ? savedTips.filter(tip => tip.category === activeCategory)
    : savedTips;
    
  const uniqueCategories = Array.from(new Set(savedTips.map(tip => tip.category)));
  
  const handleRemoveTip = (tipId: number) => {
    const updatedTips = savedTips.filter(tip => tip.id !== tipId);
    setSavedTips(updatedTips);
    
    toast({
      title: t('tips.removedTitle') || "Tip Removed",
      description: t('tips.removedDescription') || "The wellness tip has been removed from your collection.",
    });
  };
  
  const handleShareTip = (tip: WellnessTip) => {
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
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('nav.back') || 'Back'}
        </Button>
        
        <h1 className="text-3xl font-bold">{t('tips.savedCollection') || 'Saved Wellness Tips'}</h1>
      </div>
      
      {savedTips.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-7xl mb-4">✨</div>
          <h2 className="text-2xl font-bold mb-2">{t('tips.noSavedTitle') || 'No Saved Tips Yet'}</h2>
          <p className="text-muted-foreground mb-6">
            {t('tips.noSavedDescription') || 'Your saved wellness tips will appear here.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {t('tips.goExplore') || 'Explore Wellness Tips'}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="rounded-full"
            >
              {t('tips.allCategories') || 'All'}
            </Button>
            
            {uniqueCategories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full",
                  activeCategory === category ? "" : categoryColors[category]
                )}
              >
                {t(`tips.category.${category}`) || category}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map(tip => (
              <Card key={tip.id} className="border border-purple-500/20 bg-black/40 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{tip.emoji}</span>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShareTip(tip)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('tips.share') || 'Share'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveTip(tip.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <BookmarkMinus className="h-4 w-4 mr-2" />
                          {t('tips.remove') || 'Remove'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className={cn("text-xs", categoryColors[tip.category])}>
                      {t(`tips.category.${tip.category}`) || tip.category}
                    </Badge>
                    
                    {tip.element && (
                      <Badge variant="outline" className={cn("text-xs", elementColors[tip.element])}>
                        {tip.element.charAt(0).toUpperCase() + tip.element.slice(1)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedTipsPage;