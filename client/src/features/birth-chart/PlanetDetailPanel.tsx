/**
 * Planet Detail Panel - Shows detailed information about a selected planet
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CelestialPosition,
  PlanetKey,
  Aspect,
  PLANET_INFO,
  ZODIAC_INFO,
  ASPECT_INFO,
} from './types';

interface PlanetDetailPanelProps {
  planet: PlanetKey | null;
  position: CelestialPosition | null;
  aspects: Aspect[];
  onClose: () => void;
}

// Planet interpretations
const PLANET_MEANINGS: Record<PlanetKey, {
  represents: string;
  keywords: string[];
  questions: string[];
}> = {
  sun: {
    represents: 'Your core identity, ego, and life purpose',
    keywords: ['identity', 'vitality', 'self-expression', 'will', 'purpose'],
    questions: ['Who am I at my core?', 'What drives my self-expression?'],
  },
  moon: {
    represents: 'Your emotions, instincts, and inner self',
    keywords: ['emotions', 'intuition', 'nurturing', 'habits', 'comfort'],
    questions: ['What makes me feel safe?', 'How do I process emotions?'],
  },
  mercury: {
    represents: 'Your communication style and thought processes',
    keywords: ['communication', 'thinking', 'learning', 'curiosity', 'analysis'],
    questions: ['How do I learn best?', 'How do I express my thoughts?'],
  },
  venus: {
    represents: 'Your love nature, values, and aesthetic sense',
    keywords: ['love', 'beauty', 'values', 'pleasure', 'attraction', 'harmony'],
    questions: ['What do I value most?', 'How do I express love?'],
  },
  mars: {
    represents: 'Your drive, energy, and how you take action',
    keywords: ['action', 'desire', 'courage', 'assertion', 'energy', 'passion'],
    questions: ['What motivates me to act?', 'How do I handle conflict?'],
  },
  jupiter: {
    represents: 'Your expansion, growth, and good fortune',
    keywords: ['growth', 'luck', 'wisdom', 'abundance', 'optimism', 'expansion'],
    questions: ['Where do I find meaning?', 'How do I grow and expand?'],
  },
  saturn: {
    represents: 'Your discipline, challenges, and life lessons',
    keywords: ['discipline', 'responsibility', 'structure', 'karma', 'mastery'],
    questions: ['What are my life lessons?', 'Where do I need to mature?'],
  },
  uranus: {
    represents: 'Your individuality, innovation, and sudden change',
    keywords: ['revolution', 'freedom', 'originality', 'awakening', 'rebellion'],
    questions: ['How am I unique?', 'Where do I seek freedom?'],
  },
  neptune: {
    represents: 'Your imagination, spirituality, and transcendence',
    keywords: ['dreams', 'spirituality', 'illusion', 'compassion', 'creativity'],
    questions: ['What inspires me spiritually?', 'Where do I seek transcendence?'],
  },
  pluto: {
    represents: 'Your transformation, power, and deep psychology',
    keywords: ['transformation', 'power', 'rebirth', 'intensity', 'depth'],
    questions: ['What needs to transform?', 'Where is my hidden power?'],
  },
  northNode: {
    represents: "Your soul's purpose and life direction",
    keywords: ['destiny', 'growth direction', 'life purpose', 'evolution', 'calling'],
    questions: ['What is my soul evolving toward?', 'What qualities should I develop?'],
  },
  chiron: {
    represents: 'Your deepest wound and healing gifts',
    keywords: ['wound', 'healing', 'teaching', 'wisdom through pain', 'mentor'],
    questions: ['What is my core wound?', 'How can I help others heal?'],
  },
};

export function PlanetDetailPanel({
  planet,
  position,
  aspects,
  onClose,
}: PlanetDetailPanelProps) {
  if (!planet || !position) return null;

  const info = PLANET_INFO[planet];
  const meaning = PLANET_MEANINGS[planet];
  const zodiacInfo = ZODIAC_INFO[position.sign];

  // Filter aspects for this planet
  const planetAspects = aspects.filter(
    (a) => a.planet1 === planet || a.planet2 === planet
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute right-0 top-0 w-80 max-h-full overflow-y-auto"
      >
        <Card className="bg-card/95 backdrop-blur-sm border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${info.color}20`, border: `2px solid ${info.color}` }}
                >
                  {info.symbol}
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {info.name}
                    {position.retrograde && (
                      <Badge variant="destructive" className="text-xs">
                        Retrograde
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(position.signDegree)}° {zodiacInfo.name}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Position details */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <span
                className="text-xl"
                style={{ color: zodiacInfo.color }}
              >
                {zodiacInfo.symbol}
              </span>
              <div className="text-sm">
                <p className="font-medium" style={{ color: zodiacInfo.color }}>
                  {zodiacInfo.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {zodiacInfo.element.charAt(0).toUpperCase() + zodiacInfo.element.slice(1)} sign
                </p>
              </div>
            </div>

            {/* What it represents */}
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-500" />
                Represents
              </h4>
              <p className="text-sm text-muted-foreground">
                {meaning.represents}
              </p>
            </div>

            {/* Interpretation */}
            {position.interpretation && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Your {info.name} in {zodiacInfo.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {position.interpretation}
                </p>
              </div>
            )}

            {/* Keywords */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {meaning.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reflection questions */}
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Reflect On
              </h4>
              <ul className="space-y-1">
                {meaning.questions.map((question, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aspects */}
            {planetAspects.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Aspects ({planetAspects.length})
                </h4>
                <div className="space-y-2">
                  {planetAspects.slice(0, 5).map((aspect, idx) => {
                    const otherPlanet = aspect.planet1 === planet ? aspect.planet2 : aspect.planet1;
                    const otherInfo = PLANET_INFO[otherPlanet];
                    const aspectInfo = ASPECT_INFO[aspect.type];

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                      >
                        <span style={{ color: aspectInfo.color }}>
                          {aspectInfo.symbol}
                        </span>
                        <span className="text-sm">{aspectInfo.name}</span>
                        <span style={{ color: otherInfo.color }}>
                          {otherInfo.symbol}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {otherInfo.name}
                        </span>
                        <Badge
                          variant={aspectInfo.nature === 'harmonious' ? 'default' : 'secondary'}
                          className="text-xs ml-auto"
                        >
                          {aspect.orb.toFixed(1)}°
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Retrograde info */}
            {position.retrograde && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <h4 className="font-semibold text-sm text-red-400 mb-1">
                  Retrograde Motion
                </h4>
                <p className="text-xs text-muted-foreground">
                  {info.name} appears to move backward in the sky. This indicates
                  internalized or revisited themes related to{' '}
                  {meaning.keywords.slice(0, 2).join(' and ')}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default PlanetDetailPanel;
