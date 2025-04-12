import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AchievementGallery } from '@/components/AchievementBadgeContainer';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const AchievementsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/dashboard" className="flex items-center hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('dashboard.title')}
          </Link>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            {t('badge.gallery.title')}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Track your astrological wellness journey by collecting achievement badges. 
            Each badge represents a milestone in your cosmic health exploration.
          </p>
        </header>
        
        <div className="bg-gradient-to-br from-background/70 to-background/90 border border-primary/10 rounded-lg p-6 shadow-lg">
          <AchievementGallery />
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;