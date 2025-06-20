import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CosmicBadge } from './CosmicBadge';
import { Trophy, Star, Sparkles, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  type: 'wellness' | 'element' | 'cosmic' | 'streak' | 'premium' | 'achievement';
  title: string;
  description: string;
  level: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CosmicBadgeSystemProps {
  achievements: Achievement[];
  showProgress?: boolean;
  showUnlocked?: boolean;
  showLocked?: boolean;
  animated?: boolean;
}

const rarityColors = {
  common: 'text-gray-600 bg-gray-100',
  rare: 'text-blue-600 bg-blue-100',
  epic: 'text-purple-600 bg-purple-100',
  legendary: 'text-yellow-600 bg-yellow-100'
};

const rarityNames = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
};

export const CosmicBadgeSystem: React.FC<CosmicBadgeSystemProps> = ({
  achievements,
  showProgress = true,
  showUnlocked = true,
  showLocked = true,
  animated = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  const categorizedAchievements = {
    all: achievements,
    wellness: achievements.filter(a => a.type === 'wellness'),
    element: achievements.filter(a => a.type === 'element'),
    cosmic: achievements.filter(a => a.type === 'cosmic'),
    streak: achievements.filter(a => a.type === 'streak'),
    premium: achievements.filter(a => a.type === 'premium'),
    achievement: achievements.filter(a => a.type === 'achievement')
  };

  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'wellness', name: 'Wellness', icon: Star },
    { id: 'element', name: 'Elements', icon: Sparkles },
    { id: 'cosmic', name: 'Cosmic', icon: Star },
    { id: 'streak', name: 'Streaks', icon: Trophy },
    { id: 'premium', name: 'Premium', icon: Star }
  ];

  const progressPercentage = achievements.length > 0 
    ? (unlockedAchievements.length / achievements.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cosmic Achievements
            </h2>
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          
          {showProgress && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{unlockedAchievements.length} / {achievements.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="text-center mt-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {Math.round(progressPercentage)}% Complete
                </Badge>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => {
            const count = categorizedAchievements[category.id as keyof typeof categorizedAchievements]?.length || 0;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 text-xs"
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <Badge variant="outline" className="text-xs px-1">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Unlocked Achievements */}
              {showUnlocked && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Unlocked ({categorizedAchievements[category.id as keyof typeof categorizedAchievements]?.filter(a => a.unlocked).length || 0})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categorizedAchievements[category.id as keyof typeof categorizedAchievements]
                      ?.filter(achievement => achievement.unlocked)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center space-y-2"
                        >
                          <CosmicBadge
                            type={achievement.type}
                            title={achievement.title}
                            description={achievement.description}
                            level={achievement.level}
                            unlocked={achievement.unlocked}
                            animated={animated}
                            size="md"
                          />
                          <div className="text-center">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${rarityColors[achievement.rarity]}`}
                            >
                              {rarityNames[achievement.rarity]}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Locked Achievements */}
              {showLocked && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-600">
                    <Lock className="h-5 w-5" />
                    Locked ({categorizedAchievements[category.id as keyof typeof categorizedAchievements]?.filter(a => !a.unlocked).length || 0})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categorizedAchievements[category.id as keyof typeof categorizedAchievements]
                      ?.filter(achievement => !achievement.unlocked)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center space-y-2 opacity-60"
                        >
                          <CosmicBadge
                            type={achievement.type}
                            title={achievement.title}
                            description={achievement.description}
                            level={achievement.level}
                            unlocked={achievement.unlocked}
                            animated={false}
                            size="md"
                          />
                          <div className="text-center space-y-1">
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                              {rarityNames[achievement.rarity]}
                            </Badge>
                            {achievement.progress !== undefined && achievement.maxProgress && (
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest cosmic accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unlockedAchievements
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 3)
                .map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                  >
                    <CosmicBadge
                      type={achievement.type}
                      title={achievement.title}
                      description={achievement.description}
                      level={achievement.level}
                      unlocked={achievement.unlocked}
                      animated={animated}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-purple-900">{achievement.title}</div>
                      <div className="text-sm text-purple-700">{achievement.description}</div>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-purple-600 mt-1">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Badge 
                      className={`${rarityColors[achievement.rarity]}`}
                    >
                      {rarityNames[achievement.rarity]}
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};