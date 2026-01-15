/**
 * Birth Chart Service - Full natal chart generation and analysis
 */

import { db } from '../../db';
import { birthLocations, birthCharts, users } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../../logger';
import {
  calculatePlanetaryPositions,
  calculateHouses,
  calculateAspects,
  degreesToSign,
  PLANETS,
  ASPECTS,
  ZODIAC_SIGNS,
  type CelestialPosition,
  type Aspect,
  type PlanetKey,
  type ZodiacSign,
} from './ephemeris.service';

// Planet interpretations for natal chart
const PLANET_MEANINGS: Record<PlanetKey, {
  represents: string;
  keywords: string[];
  signMeaning: (sign: ZodiacSign) => string;
}> = {
  sun: {
    represents: 'Your core identity, ego, and life purpose',
    keywords: ['identity', 'vitality', 'self-expression', 'will'],
    signMeaning: (sign) => `Your essential self expresses through ${sign} qualities`,
  },
  moon: {
    represents: 'Your emotions, instincts, and inner self',
    keywords: ['emotions', 'intuition', 'nurturing', 'habits'],
    signMeaning: (sign) => `You process emotions and find comfort through ${sign} energy`,
  },
  mercury: {
    represents: 'Your communication style and thought processes',
    keywords: ['communication', 'thinking', 'learning', 'curiosity'],
    signMeaning: (sign) => `Your mind works and communicates in a ${sign} manner`,
  },
  venus: {
    represents: 'Your love nature, values, and aesthetic sense',
    keywords: ['love', 'beauty', 'values', 'pleasure', 'attraction'],
    signMeaning: (sign) => `You express love and appreciate beauty through ${sign} ways`,
  },
  mars: {
    represents: 'Your drive, energy, and how you take action',
    keywords: ['action', 'desire', 'courage', 'assertion', 'energy'],
    signMeaning: (sign) => `You take action and assert yourself with ${sign} energy`,
  },
  jupiter: {
    represents: 'Your expansion, growth, and good fortune',
    keywords: ['growth', 'luck', 'wisdom', 'abundance', 'optimism'],
    signMeaning: (sign) => `You find expansion and meaning through ${sign} pursuits`,
  },
  saturn: {
    represents: 'Your discipline, challenges, and life lessons',
    keywords: ['discipline', 'responsibility', 'structure', 'karma'],
    signMeaning: (sign) => `Your lessons and mastery develop through ${sign} themes`,
  },
  uranus: {
    represents: 'Your individuality, innovation, and sudden change',
    keywords: ['revolution', 'freedom', 'originality', 'awakening'],
    signMeaning: (sign) => `You express uniqueness and rebel through ${sign} areas`,
  },
  neptune: {
    represents: 'Your imagination, spirituality, and transcendence',
    keywords: ['dreams', 'spirituality', 'illusion', 'compassion'],
    signMeaning: (sign) => `Your spiritual and creative nature flows through ${sign}`,
  },
  pluto: {
    represents: 'Your transformation, power, and deep psychology',
    keywords: ['transformation', 'power', 'rebirth', 'intensity'],
    signMeaning: (sign) => `Deep transformation occurs through ${sign} experiences`,
  },
  northNode: {
    represents: 'Your soul\'s purpose and life direction',
    keywords: ['destiny', 'growth direction', 'life purpose', 'evolution'],
    signMeaning: (sign) => `Your soul evolves by developing ${sign} qualities`,
  },
  chiron: {
    represents: 'Your deepest wound and healing gifts',
    keywords: ['wound', 'healing', 'teaching', 'wisdom through pain'],
    signMeaning: (sign) => `Healing and teaching come through ${sign} themes`,
  },
};

// House meanings
const HOUSE_MEANINGS = [
  { house: 1, name: 'Self', keywords: ['identity', 'appearance', 'first impressions', 'beginnings'] },
  { house: 2, name: 'Values', keywords: ['money', 'possessions', 'self-worth', 'resources'] },
  { house: 3, name: 'Communication', keywords: ['siblings', 'short trips', 'learning', 'neighborhood'] },
  { house: 4, name: 'Home', keywords: ['family', 'roots', 'mother', 'emotional foundation'] },
  { house: 5, name: 'Creativity', keywords: ['romance', 'children', 'pleasure', 'self-expression'] },
  { house: 6, name: 'Health', keywords: ['work', 'service', 'daily routines', 'wellness'] },
  { house: 7, name: 'Partnership', keywords: ['marriage', 'contracts', 'open enemies', 'others'] },
  { house: 8, name: 'Transformation', keywords: ['death', 'rebirth', 'shared resources', 'intimacy'] },
  { house: 9, name: 'Philosophy', keywords: ['travel', 'higher learning', 'beliefs', 'expansion'] },
  { house: 10, name: 'Career', keywords: ['public image', 'achievements', 'father', 'authority'] },
  { house: 11, name: 'Community', keywords: ['friends', 'groups', 'hopes', 'social causes'] },
  { house: 12, name: 'Spirituality', keywords: ['subconscious', 'secrets', 'karma', 'endings'] },
];

// Element and modality groupings
const ELEMENTS = {
  fire: ['aries', 'leo', 'sagittarius'] as ZodiacSign[],
  earth: ['taurus', 'virgo', 'capricorn'] as ZodiacSign[],
  air: ['gemini', 'libra', 'aquarius'] as ZodiacSign[],
  water: ['cancer', 'scorpio', 'pisces'] as ZodiacSign[],
};

const MODALITIES = {
  cardinal: ['aries', 'cancer', 'libra', 'capricorn'] as ZodiacSign[],
  fixed: ['taurus', 'leo', 'scorpio', 'aquarius'] as ZodiacSign[],
  mutable: ['gemini', 'virgo', 'sagittarius', 'pisces'] as ZodiacSign[],
};

export interface BirthChartInput {
  userId: number;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
  birthTimezone?: string;
  birthTimeAccuracy?: 'exact' | 'approximate' | 'unknown';
  birthCity: string;
  birthState?: string;
  birthCountry: string;
  latitude: string;
  longitude: string;
}

export interface BirthChartResult {
  id: number;
  userId: number;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  planets: Record<PlanetKey, CelestialPosition & { interpretation: string }>;
  houses: Array<{
    number: number;
    cusp: number;
    sign: ZodiacSign;
    meaning: typeof HOUSE_MEANINGS[number];
  }>;
  aspects: Array<Aspect & { interpretation: string }>;
  ascendant: number | null;
  midheaven: number | null;
  elementBalance: Record<keyof typeof ELEMENTS, number>;
  modalityBalance: Record<keyof typeof MODALITIES, number>;
  dominantPlanets: PlanetKey[];
  chartPattern?: string;
  calculatedAt: Date;
}

export interface TransitData {
  planet: PlanetKey;
  currentPosition: CelestialPosition;
  natalPosition: CelestialPosition;
  aspect?: {
    type: keyof typeof ASPECTS;
    orb: number;
    interpretation: string;
  };
}

/**
 * Parse birth datetime from string inputs
 */
function parseBirthDateTime(
  birthDate: string,
  birthTime?: string,
  timezone?: string
): Date {
  const [year, month, day] = birthDate.split('-').map(Number);

  if (birthTime) {
    const [hours, minutes] = birthTime.split(':').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  }

  // Default to noon if no time provided
  return new Date(Date.UTC(year, month - 1, day, 12, 0));
}

/**
 * Generate interpretation for aspect
 */
function interpretAspect(aspect: Aspect): string {
  const p1Info = PLANETS[aspect.planet1];
  const p2Info = PLANETS[aspect.planet2];
  const aspectInfo = ASPECTS[aspect.type];

  const harmonious = ['trine', 'sextile'].includes(aspect.type);
  const challenging = ['square', 'opposition'].includes(aspect.type);

  if (harmonious) {
    return `${p1Info.name} and ${p2Info.name} work together harmoniously through the ${aspectInfo.name}. ` +
      `This creates natural flow between your ${PLANET_MEANINGS[aspect.planet1].keywords[0]} ` +
      `and ${PLANET_MEANINGS[aspect.planet2].keywords[0]}.`;
  }

  if (challenging) {
    return `${p1Info.name} and ${p2Info.name} create tension through the ${aspectInfo.name}. ` +
      `This dynamic pushes growth between your ${PLANET_MEANINGS[aspect.planet1].keywords[0]} ` +
      `and ${PLANET_MEANINGS[aspect.planet2].keywords[0]}.`;
  }

  // Conjunction
  return `${p1Info.name} and ${p2Info.name} merge their energies in ${aspectInfo.name}. ` +
    `Your ${PLANET_MEANINGS[aspect.planet1].keywords[0]} and ` +
    `${PLANET_MEANINGS[aspect.planet2].keywords[0]} are deeply connected.`;
}

/**
 * Calculate element balance in chart
 */
function calculateElementBalance(
  planets: Record<PlanetKey, CelestialPosition>
): Record<keyof typeof ELEMENTS, number> {
  const balance = { fire: 0, earth: 0, air: 0, water: 0 };

  Object.values(planets).forEach((pos) => {
    for (const [element, signs] of Object.entries(ELEMENTS)) {
      if (signs.includes(pos.sign)) {
        balance[element as keyof typeof ELEMENTS]++;
      }
    }
  });

  return balance;
}

/**
 * Calculate modality balance in chart
 */
function calculateModalityBalance(
  planets: Record<PlanetKey, CelestialPosition>
): Record<keyof typeof MODALITIES, number> {
  const balance = { cardinal: 0, fixed: 0, mutable: 0 };

  Object.values(planets).forEach((pos) => {
    for (const [modality, signs] of Object.entries(MODALITIES)) {
      if (signs.includes(pos.sign)) {
        balance[modality as keyof typeof MODALITIES]++;
      }
    }
  });

  return balance;
}

/**
 * Identify dominant planets based on aspects and positions
 */
function findDominantPlanets(
  planets: Record<PlanetKey, CelestialPosition>,
  aspects: Aspect[]
): PlanetKey[] {
  const scores: Record<PlanetKey, number> = {} as Record<PlanetKey, number>;

  // Initialize scores
  Object.keys(planets).forEach((planet) => {
    scores[planet as PlanetKey] = 0;
  });

  // Count aspect connections
  aspects.forEach((aspect) => {
    scores[aspect.planet1] += 1;
    scores[aspect.planet2] += 1;

    // Bonus for exact aspects
    if (aspect.orb < 2) {
      scores[aspect.planet1] += 1;
      scores[aspect.planet2] += 1;
    }
  });

  // Sun and Moon get natural weight
  scores.sun += 3;
  scores.moon += 2;

  // Sort and return top 3
  return (Object.entries(scores) as [PlanetKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([planet]) => planet);
}

/**
 * Create or update birth chart for user
 */
export async function createBirthChart(input: BirthChartInput): Promise<BirthChartResult> {
  logger.info(`Creating birth chart for user ${input.userId}`);

  const birthDateTime = parseBirthDateTime(
    input.birthDate,
    input.birthTime,
    input.birthTimezone
  );

  const lat = parseFloat(input.latitude);
  const lon = parseFloat(input.longitude);

  // Calculate planetary positions
  const planets = calculatePlanetaryPositions(birthDateTime);

  // Calculate houses if we have accurate birth time
  let houseData: ReturnType<typeof calculateHouses> | null = null;
  if (input.birthTime && input.birthTimeAccuracy !== 'unknown') {
    houseData = calculateHouses(birthDateTime, lat, lon);
  }

  // Calculate aspects
  const aspects = calculateAspects(planets);

  // Save birth location
  const [location] = await db
    .insert(birthLocations)
    .values({
      userId: input.userId,
      birthTime: input.birthTime || null,
      birthTimezone: input.birthTimezone || null,
      birthTimeAccuracy: input.birthTimeAccuracy || 'unknown',
      birthCity: input.birthCity,
      birthState: input.birthState || null,
      birthCountry: input.birthCountry,
      latitude: input.latitude,
      longitude: input.longitude,
    })
    .onConflictDoUpdate({
      target: birthLocations.userId,
      set: {
        birthTime: input.birthTime || null,
        birthTimezone: input.birthTimezone || null,
        birthTimeAccuracy: input.birthTimeAccuracy || 'unknown',
        birthCity: input.birthCity,
        birthState: input.birthState || null,
        birthCountry: input.birthCountry,
        latitude: input.latitude,
        longitude: input.longitude,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Prepare chart data
  const risingSign = houseData
    ? degreesToSign(houseData.ascendant).sign
    : null;

  // Save birth chart
  const [chart] = await db
    .insert(birthCharts)
    .values({
      userId: input.userId,
      birthLocationId: location.id,
      sunSign: planets.sun.sign,
      moonSign: planets.moon.sign,
      risingSign,
      planets: planets,
      houses: houseData?.houses || null,
      aspects: aspects,
      calculatedAt: new Date(),
      calculationVersion: '2.0',
    })
    .onConflictDoUpdate({
      target: birthCharts.userId,
      set: {
        birthLocationId: location.id,
        sunSign: planets.sun.sign,
        moonSign: planets.moon.sign,
        risingSign,
        planets: planets,
        houses: houseData?.houses || null,
        aspects: aspects,
        calculatedAt: new Date(),
        calculationVersion: '2.0',
        updatedAt: new Date(),
      },
    })
    .returning();

  // Update user's zodiac sign
  await db
    .update(users)
    .set({
      zodiacSign: planets.sun.sign,
      birthdate: input.birthDate,
    })
    .where(eq(users.id, input.userId));

  // Build result with interpretations
  const planetsWithInterpretation: Record<PlanetKey, CelestialPosition & { interpretation: string }> = {} as any;
  for (const [key, pos] of Object.entries(planets)) {
    const planetKey = key as PlanetKey;
    planetsWithInterpretation[planetKey] = {
      ...pos,
      interpretation: PLANET_MEANINGS[planetKey].signMeaning(pos.sign),
    };
  }

  const aspectsWithInterpretation = aspects.map((aspect) => ({
    ...aspect,
    interpretation: interpretAspect(aspect),
  }));

  const housesResult = houseData?.houses.map((cusp, idx) => ({
    number: idx + 1,
    cusp,
    sign: degreesToSign(cusp).sign,
    meaning: HOUSE_MEANINGS[idx],
  })) || [];

  return {
    id: chart.id,
    userId: chart.userId,
    sunSign: chart.sunSign as ZodiacSign,
    moonSign: chart.moonSign as ZodiacSign | null,
    risingSign: chart.risingSign as ZodiacSign | null,
    planets: planetsWithInterpretation,
    houses: housesResult,
    aspects: aspectsWithInterpretation,
    ascendant: houseData?.ascendant || null,
    midheaven: houseData?.midheaven || null,
    elementBalance: calculateElementBalance(planets),
    modalityBalance: calculateModalityBalance(planets),
    dominantPlanets: findDominantPlanets(planets, aspects),
    calculatedAt: chart.calculatedAt || new Date(),
  };
}

/**
 * Get birth chart for user
 */
export async function getBirthChart(userId: number): Promise<BirthChartResult | null> {
  const [chart] = await db
    .select()
    .from(birthCharts)
    .where(eq(birthCharts.userId, userId))
    .limit(1);

  if (!chart) {
    return null;
  }

  const planets = chart.planets as Record<PlanetKey, CelestialPosition>;
  const aspects = chart.aspects as Aspect[];
  const houses = chart.houses as number[] | null;

  // Build result with interpretations
  const planetsWithInterpretation: Record<PlanetKey, CelestialPosition & { interpretation: string }> = {} as any;
  for (const [key, pos] of Object.entries(planets)) {
    const planetKey = key as PlanetKey;
    planetsWithInterpretation[planetKey] = {
      ...pos,
      interpretation: PLANET_MEANINGS[planetKey].signMeaning(pos.sign),
    };
  }

  const aspectsWithInterpretation = aspects.map((aspect) => ({
    ...aspect,
    interpretation: interpretAspect(aspect),
  }));

  const housesResult = houses?.map((cusp, idx) => ({
    number: idx + 1,
    cusp,
    sign: degreesToSign(cusp).sign,
    meaning: HOUSE_MEANINGS[idx],
  })) || [];

  // Calculate ascendant from first house cusp if available
  const ascendant = houses ? houses[0] : null;
  const midheaven = houses ? houses[9] : null;

  return {
    id: chart.id,
    userId: chart.userId,
    sunSign: chart.sunSign as ZodiacSign,
    moonSign: chart.moonSign as ZodiacSign | null,
    risingSign: chart.risingSign as ZodiacSign | null,
    planets: planetsWithInterpretation,
    houses: housesResult,
    aspects: aspectsWithInterpretation,
    ascendant,
    midheaven,
    elementBalance: calculateElementBalance(planets),
    modalityBalance: calculateModalityBalance(planets),
    dominantPlanets: findDominantPlanets(planets, aspects),
    calculatedAt: chart.calculatedAt || new Date(),
  };
}

/**
 * Get current transits relative to natal chart
 */
export async function getTransits(userId: number): Promise<TransitData[]> {
  const chart = await getBirthChart(userId);

  if (!chart) {
    throw new Error('Birth chart not found');
  }

  const currentPlanets = calculatePlanetaryPositions(new Date());
  const transits: TransitData[] = [];

  // Check each current planet against natal positions
  for (const [planetKey, currentPos] of Object.entries(currentPlanets)) {
    const key = planetKey as PlanetKey;
    const natalPos = chart.planets[key];

    // Calculate angle between current and natal
    let angle = Math.abs(currentPos.longitude - natalPos.longitude);
    if (angle > 180) angle = 360 - angle;

    // Check for aspects to natal position
    let foundAspect: TransitData['aspect'] | undefined;

    for (const [aspectType, aspectDef] of Object.entries(ASPECTS)) {
      const orb = Math.abs(angle - aspectDef.angle);
      if (orb <= aspectDef.orb) {
        foundAspect = {
          type: aspectType as keyof typeof ASPECTS,
          orb: Math.round(orb * 100) / 100,
          interpretation: `Transit ${PLANETS[key].name} ${aspectDef.name.toLowerCase()} your natal ${PLANETS[key].name}. ` +
            `This activates themes of ${PLANET_MEANINGS[key].keywords.slice(0, 2).join(' and ')}.`,
        };
        break;
      }
    }

    transits.push({
      planet: key,
      currentPosition: currentPos,
      natalPosition: natalPos,
      aspect: foundAspect,
    });
  }

  return transits;
}

/**
 * Get chart comparison between two users (synastry)
 */
export async function getChartComparison(
  userId1: number,
  userId2: number
): Promise<{
  aspects: Array<{
    person1Planet: PlanetKey;
    person2Planet: PlanetKey;
    aspect: keyof typeof ASPECTS;
    orb: number;
    interpretation: string;
  }>;
  compatibility: {
    overall: number;
    emotional: number;
    communication: number;
    passion: number;
  };
}> {
  const chart1 = await getBirthChart(userId1);
  const chart2 = await getBirthChart(userId2);

  if (!chart1 || !chart2) {
    throw new Error('One or both birth charts not found');
  }

  const synastryAspects: Array<{
    person1Planet: PlanetKey;
    person2Planet: PlanetKey;
    aspect: keyof typeof ASPECTS;
    orb: number;
    interpretation: string;
  }> = [];

  // Compare each planet combination
  for (const [p1Key, p1Pos] of Object.entries(chart1.planets)) {
    for (const [p2Key, p2Pos] of Object.entries(chart2.planets)) {
      let angle = Math.abs(p1Pos.longitude - p2Pos.longitude);
      if (angle > 180) angle = 360 - angle;

      for (const [aspectType, aspectDef] of Object.entries(ASPECTS)) {
        const orb = Math.abs(angle - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          synastryAspects.push({
            person1Planet: p1Key as PlanetKey,
            person2Planet: p2Key as PlanetKey,
            aspect: aspectType as keyof typeof ASPECTS,
            orb: Math.round(orb * 100) / 100,
            interpretation: `Person 1's ${PLANETS[p1Key as PlanetKey].name} ${aspectDef.name.toLowerCase()} ` +
              `Person 2's ${PLANETS[p2Key as PlanetKey].name}.`,
          });
          break;
        }
      }
    }
  }

  // Calculate compatibility scores (simplified)
  const harmoniousAspects = synastryAspects.filter(
    (a) => ['trine', 'sextile', 'conjunction'].includes(a.aspect)
  ).length;

  const challengingAspects = synastryAspects.filter(
    (a) => ['square', 'opposition'].includes(a.aspect)
  ).length;

  const overall = Math.min(100, Math.round((harmoniousAspects / (harmoniousAspects + challengingAspects + 1)) * 100));

  return {
    aspects: synastryAspects,
    compatibility: {
      overall,
      emotional: overall + (Math.random() - 0.5) * 20,
      communication: overall + (Math.random() - 0.5) * 20,
      passion: overall + (Math.random() - 0.5) * 20,
    },
  };
}

export default {
  createBirthChart,
  getBirthChart,
  getTransits,
  getChartComparison,
  PLANET_MEANINGS,
  HOUSE_MEANINGS,
};
