import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AchievementGallery } from '@/components/AchievementBadgeContainer';
import { CosmicBadgeSystem } from '@/components/CosmicBadgeSystem';
import { AchievementUnlockModal } from '@/components/AchievementUnlockModal';
import { ChevronLeft, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';

// Sample cosmic achievements data (in real app, this would come from API)
const cosmicAchievements = [
  {
    id: 'wellness-1',
    type: 'wellness' as const,
    title: 'Wellness Beginner',
    description: 'Started tracking your first wellness metric aligned with your zodiac sign.',
    level: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
    rarity: 'common' as const,
    reward: 'Unlock detailed wellness insights'
  },
  {
    id: 'element-1',
    type: 'element' as const,
    title: 'Element Aligned',
    description: 'Discovered your elemental affinity and its impact on your health tendencies.',
    level: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-10'),
    rarity: 'common' as const,
    reward: 'Personalized element-based tips'
  },
  {
    id: 'cosmic-1',
    type: 'cosmic' as const,
    title: 'Cosmic Novice',
    description: 'Took your first steps into the world of astrological wellness.',
    level: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-05'),
    rarity: 'common' as const,
    reward: 'Welcome to the cosmic journey'
  },
  {
    id: 'streak-1',
    type: 'streak' as const,
    title: 'Seven Day Streak',
    description: 'Maintained a 7-day streak of daily horoscope engagement.',
    level: 1,
    unlocked: false,
    progress: 3,
    maxProgress: 7,
    rarity: 'rare' as const,
    reward: 'Streak bonus multiplier activated'
  },
  {
    id: 'wellness-2',
    type: 'wellness' as const,
    title: 'Health Guru',
    description: 'Complete 30 days of wellness tracking with 90% accuracy.',
    level: 2,
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    rarity: 'epic' as const,
    reward: 'Advanced health recommendations'
  }
];

const AchievementsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedAchievement, setSelectedAchievement] = useState<typeof cosmicAchievements[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAchievementClick = (achievement: typeof cosmicAchievements[0]) => {
    if (achievement.unlocked) {
      setSelectedAchievement(achievement);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAchievement(null);
  };

  const handleShare = () => {
    if (selectedAchievement) {
      const text = `Just unlocked the "${selectedAchievement.title}" achievement on HoroscopeHealth! ${selectedAchievement.description}`;
      if (navigator.share) {
        navigator.share({
          title: 'Achievement Unlocked!',
          text: text,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/dashboard" className="flex items-center hover:text-primary">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('dashboard.title')}
            </Link>
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cosmic Achievements
              </h1>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your astrological wellness journey with beautiful animated badges. 
              Each achievement represents a milestone in your cosmic health exploration.
            </p>
          </header>
          
          <Tabs defaultValue="cosmic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="cosmic" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Cosmic Badges
              </TabsTrigger>
              <TabsTrigger value="classic" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Classic View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cosmic">
              <CosmicBadgeSystem
                achievements={cosmicAchievements}
                showProgress={true}
                showUnlocked={true}
                showLocked={true}
                animated={true}
              />
            </TabsContent>
            
            <TabsContent value="classic">
              <div className="bg-gradient-to-br from-background/70 to-background/90 border border-primary/10 rounded-lg p-6 shadow-lg">
                <AchievementGallery />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Achievement Unlock Modal */}
        <AchievementUnlockModal
          achievement={selectedAchievement}
          isOpen={showModal}
          onClose={handleCloseModal}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default AchievementsPage;