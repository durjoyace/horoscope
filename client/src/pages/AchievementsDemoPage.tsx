import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CosmicBadgeSystem } from '@/components/CosmicBadgeSystem';
import { AchievementUnlockModal } from '@/components/AchievementUnlockModal';
import { CosmicBadge } from '@/components/CosmicBadge';
import { Sparkles, Star, Trophy, Award } from 'lucide-react';

const sampleAchievements = [
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
    id: 'wellness-2',
    type: 'wellness' as const,
    title: 'Health Guru',
    description: 'Completed 30 days of wellness tracking with 90% accuracy.',
    level: 2,
    unlocked: true,
    unlockedAt: new Date('2024-01-20'),
    rarity: 'rare' as const,
    reward: 'Advanced health recommendations'
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
    unlocked: true,
    unlockedAt: new Date('2024-01-12'),
    rarity: 'rare' as const,
    reward: 'Streak bonus multiplier activated'
  },
  {
    id: 'premium-1',
    type: 'premium' as const,
    title: 'Premium Explorer',
    description: 'Unlocked premium features and started your enhanced wellness journey.',
    level: 1,
    unlocked: true,
    unlockedAt: new Date('2024-01-18'),
    rarity: 'epic' as const,
    reward: 'Access to exclusive premium content'
  },
  {
    id: 'achievement-1',
    type: 'achievement' as const,
    title: 'Cosmic Master',
    description: 'Achieved mastery in all aspects of cosmic wellness alignment.',
    level: 3,
    unlocked: true,
    unlockedAt: new Date('2024-01-25'),
    rarity: 'legendary' as const,
    reward: 'Legendary status and special recognition'
  },
  // Locked achievements
  {
    id: 'wellness-3',
    type: 'wellness' as const,
    title: 'Wellness Master',
    description: 'Complete 100 days of perfect wellness tracking.',
    level: 3,
    unlocked: false,
    progress: 45,
    maxProgress: 100,
    rarity: 'epic' as const,
    reward: 'Master level wellness insights'
  },
  {
    id: 'streak-2',
    type: 'streak' as const,
    title: 'Month Long Streak',
    description: 'Maintain a 30-day streak of daily engagement.',
    level: 2,
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    rarity: 'epic' as const,
    reward: 'Monthly streak rewards'
  },
  {
    id: 'cosmic-2',
    type: 'cosmic' as const,
    title: 'Cosmic Legend',
    description: 'Reach the highest level of cosmic wellness understanding.',
    level: 5,
    unlocked: false,
    progress: 2,
    maxProgress: 10,
    rarity: 'legendary' as const,
    reward: 'Ultimate cosmic wisdom'
  }
];

export default function AchievementsDemoPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<typeof sampleAchievements[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleTriggerModal = (achievement: typeof sampleAchievements[0]) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAchievement(null);
  };

  const handleShare = () => {
    if (selectedAchievement) {
      const text = `Just unlocked the "${selectedAchievement.title}" achievement on HoroscopeHealth! 🌟 ${selectedAchievement.description}`;
      if (navigator.share) {
        navigator.share({
          title: 'Achievement Unlocked!',
          text: text,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(text);
        alert('Achievement shared to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cosmic Achievement System
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and unlock beautiful animated badges as you progress through your cosmic wellness journey.
          </p>
        </motion.div>

        {/* Demo Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievement Demo Controls
            </CardTitle>
            <CardDescription>
              Click any unlocked achievement below to see the unlock animation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sampleAchievements
                .filter(a => a.unlocked)
                .slice(0, 8)
                .map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                    onClick={() => handleTriggerModal(achievement)}
                  >
                    <CosmicBadge
                      type={achievement.type}
                      title={achievement.title}
                      description={achievement.description}
                      level={achievement.level}
                      unlocked={achievement.unlocked}
                      animated={true}
                      size="md"
                    />
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Individual Badge Showcase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Badge Types & Animations
            </CardTitle>
            <CardDescription>
              See different badge types and their unique animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="wellness"
                  title="Wellness Badge"
                  description="Health and wellness achievements"
                  level={1}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-green-700">Wellness</div>
              </div>
              
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="element"
                  title="Element Badge"
                  description="Elemental alignment achievements"
                  level={2}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-purple-700">Element</div>
              </div>
              
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="cosmic"
                  title="Cosmic Badge"
                  description="Cosmic journey milestones"
                  level={1}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-blue-700">Cosmic</div>
              </div>
              
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="streak"
                  title="Streak Badge"
                  description="Consistency achievements"
                  level={3}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-orange-700">Streak</div>
              </div>
              
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="premium"
                  title="Premium Badge"
                  description="Premium member benefits"
                  level={1}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-yellow-700">Premium</div>
              </div>
              
              <div className="text-center space-y-2">
                <CosmicBadge
                  type="achievement"
                  title="Special Badge"
                  description="Special accomplishments"
                  level={5}
                  unlocked={true}
                  animated={true}
                  size="lg"
                />
                <div className="text-sm font-medium text-pink-700">Special</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Achievement System */}
        <CosmicBadgeSystem
          achievements={sampleAchievements}
          showProgress={true}
          showUnlocked={true}
          showLocked={true}
          animated={true}
        />

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
}