import React, { useState } from 'react';
import { AchievementBadge, AchievementBadgeProps, AchievementTooltip } from './AchievementBadge';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogDescription
} from '@/components/ui/dialog';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AchievementBadgeContainerProps {
  badges: AchievementBadgeProps[];
  className?: string;
  title?: string;
}

export const AchievementBadgeContainer: React.FC<AchievementBadgeContainerProps> = ({
  badges,
  className = "",
  title
}) => {
  const { t } = useLanguage();
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadgeProps | null>(null);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="flex flex-wrap gap-4">
        {badges.map((badge, index) => (
          <HoverCard key={`${badge.type}-${badge.level}-${index}`}>
            <HoverCardTrigger asChild>
              <div>
                <AchievementBadge
                  {...badge}
                  onClick={() => setSelectedBadge(badge)}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <AchievementTooltip badge={badge} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBadge?.name}</DialogTitle>
            <DialogDescription>{selectedBadge?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            {selectedBadge && (
              <AchievementBadge
                {...selectedBadge}
                isNew={false} // Don't show new indicator in the dialog
              />
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {selectedBadge?.earnedDate && (
              <p className="mb-2">
                <span className="font-semibold">{t('badge.earned')}:</span> {selectedBadge.earnedDate}
              </p>
            )}
            <p className="italic">
              {t('badge.dialog.description')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AchievementGallery: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Sample data for achievement badges
  const allBadges: AchievementBadgeProps[] = [
    {
      type: 'streak',
      level: 1,
      name: t('badge.streak.1.name'),
      description: t('badge.streak.1.description'),
      earnedDate: '2023-12-10',
    },
    {
      type: 'streak',
      level: 2,
      name: t('badge.streak.2.name'),
      description: t('badge.streak.2.description'),
      earnedDate: '2024-01-15',
    },
    {
      type: 'streak',
      level: 3,
      name: t('badge.streak.3.name'),
      description: t('badge.streak.3.description'),
      isNew: true,
      earnedDate: '2024-02-20',
    },
    {
      type: 'zodiac',
      level: 1,
      name: t('badge.zodiac.1.name'),
      description: t('badge.zodiac.1.description'),
      earnedDate: '2023-11-05',
    },
    {
      type: 'zodiac',
      level: 2,
      name: t('badge.zodiac.2.name'),
      description: t('badge.zodiac.2.description'),
      earnedDate: '2024-01-20',
    },
    {
      type: 'wellness',
      level: 1,
      name: t('badge.wellness.1.name'),
      description: t('badge.wellness.1.description'),
      earnedDate: '2023-10-15',
    },
    {
      type: 'element',
      level: 1,
      name: t('badge.element.1.name'),
      description: t('badge.element.1.description'),
      earnedDate: '2023-12-22',
    },
    {
      type: 'cosmic',
      level: 1,
      name: t('badge.cosmic.1.name'),
      description: t('badge.cosmic.1.description'),
      earnedDate: '2024-02-01',
    },
  ];
  
  // Filter badges based on selected category
  const filteredBadges = selectedCategory === 'all' 
    ? allBadges 
    : allBadges.filter(badge => badge.type === selectedCategory);
    
  // Group badges by category for display
  const groupedBadges = {
    streak: allBadges.filter(badge => badge.type === 'streak'),
    zodiac: allBadges.filter(badge => badge.type === 'zodiac'),
    wellness: allBadges.filter(badge => badge.type === 'wellness'),
    element: allBadges.filter(badge => badge.type === 'element'),
    cosmic: allBadges.filter(badge => badge.type === 'cosmic'),
  };
  
  // Find badges that are marked as new
  const newBadges = allBadges.filter(badge => badge.isNew);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('badge.gallery.title')}</h2>
      
      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          {t('badge.category.all')}
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'streak' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('streak')}
        >
          {t('badge.category.streak')}
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'zodiac' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('zodiac')}
        >
          {t('badge.category.zodiac')}
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'wellness' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('wellness')}
        >
          {t('badge.category.wellness')}
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'element' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('element')}
        >
          {t('badge.category.element')}
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === 'cosmic' ? 'bg-primary text-white' : 'bg-secondary'
          }`}
          onClick={() => setSelectedCategory('cosmic')}
        >
          {t('badge.category.cosmic')}
        </button>
      </div>
      
      {/* New Achievements */}
      {newBadges.length > 0 && selectedCategory === 'all' && (
        <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
          <AchievementBadgeContainer 
            badges={newBadges} 
            title={t('badge.section.new')}
          />
        </div>
      )}
      
      {/* All Achievements or Filtered by Category */}
      {selectedCategory === 'all' ? (
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <div className="space-y-8">
            {Object.entries(groupedBadges).map(([category, badges]) => 
              badges.length > 0 && (
                <AchievementBadgeContainer 
                  key={category}
                  badges={badges}
                  title={t(`badge.category.${category}`)}
                />
              )
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border">
          <AchievementBadgeContainer 
            badges={filteredBadges} 
            title={t(`badge.category.${selectedCategory}`)}
          />
        </div>
      )}
    </div>
  );
};