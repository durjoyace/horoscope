/**
 * Lunar Service - Moon phase calculations and lunar wellness correlations
 */

import { dateToJulianDay, calculatePlanetaryPositions, degreesToSign } from './ephemeris.service';
import type { ZodiacSign } from './ephemeris.service';

// Moon phase definitions
export const MOON_PHASES = {
  new_moon: {
    name: 'New Moon',
    symbol: '🌑',
    icon: 'new-moon',
    illuminationRange: [0, 0.5],
    keywords: ['new beginnings', 'intentions', 'planting seeds'],
  },
  waxing_crescent: {
    name: 'Waxing Crescent',
    symbol: '🌒',
    icon: 'waxing-crescent',
    illuminationRange: [0.5, 25],
    keywords: ['hope', 'intention', 'wishes'],
  },
  first_quarter: {
    name: 'First Quarter',
    symbol: '🌓',
    icon: 'first-quarter',
    illuminationRange: [25, 50],
    keywords: ['challenges', 'decision', 'action'],
  },
  waxing_gibbous: {
    name: 'Waxing Gibbous',
    symbol: '🌔',
    icon: 'waxing-gibbous',
    illuminationRange: [50, 75],
    keywords: ['refine', 'adjust', 'patience'],
  },
  full_moon: {
    name: 'Full Moon',
    symbol: '🌕',
    icon: 'full-moon',
    illuminationRange: [75, 100],
    keywords: ['culmination', 'harvest', 'illumination'],
  },
  waning_gibbous: {
    name: 'Waning Gibbous',
    symbol: '🌖',
    icon: 'waning-gibbous',
    illuminationRange: [50, 75],
    keywords: ['gratitude', 'sharing', 'teaching'],
  },
  last_quarter: {
    name: 'Last Quarter',
    symbol: '🌗',
    icon: 'last-quarter',
    illuminationRange: [25, 50],
    keywords: ['release', 'forgiveness', 'letting go'],
  },
  waning_crescent: {
    name: 'Waning Crescent',
    symbol: '🌘',
    icon: 'waning-crescent',
    illuminationRange: [0.5, 25],
    keywords: ['rest', 'surrender', 'healing'],
  },
} as const;

export type MoonPhase = keyof typeof MOON_PHASES;

// Wellness tips by moon phase
export const PHASE_WELLNESS: Record<MoonPhase, {
  energy: string;
  fitness: string;
  nutrition: string;
  mindfulness: string;
  sleep: string;
}> = {
  new_moon: {
    energy: 'Low to moderate. Honor your body\'s need for rest and introspection.',
    fitness: 'Gentle movement like yoga, stretching, or walking. Set fitness intentions.',
    nutrition: 'Light, cleansing foods. Good time to start a new eating plan.',
    mindfulness: 'Meditation, journaling intentions, visualizing goals.',
    sleep: 'Extra rest is beneficial. Go to bed early.',
  },
  waxing_crescent: {
    energy: 'Building slowly. Energy begins to increase.',
    fitness: 'Light cardio, begin new exercise routines gradually.',
    nutrition: 'Nourishing foods that support growth and building.',
    mindfulness: 'Affirmations, hope-focused meditation, wish lists.',
    sleep: 'Maintain regular schedule. Dreams may be vivid.',
  },
  first_quarter: {
    energy: 'Active energy. Time for decisive action.',
    fitness: 'Push through challenges. Strength training is favored.',
    nutrition: 'Protein-rich foods for muscle building and energy.',
    mindfulness: 'Problem-solving meditation, addressing obstacles.',
    sleep: 'May experience some restlessness. Stay active during day.',
  },
  waxing_gibbous: {
    energy: 'High and building. Fine-tune your approach.',
    fitness: 'Refine techniques, adjust workout intensity.',
    nutrition: 'Balanced meals, adjust portions as needed.',
    mindfulness: 'Review progress, patience practices.',
    sleep: 'Energy may run high. Ensure adequate wind-down time.',
  },
  full_moon: {
    energy: 'Peak energy. Emotions may run high.',
    fitness: 'High-intensity workouts, dance, celebration movement.',
    nutrition: 'Hydration is key. Watch for emotional eating.',
    mindfulness: 'Gratitude practices, celebration of achievements.',
    sleep: 'May be harder to sleep. Avoid screens before bed.',
  },
  waning_gibbous: {
    energy: 'Beginning to decrease. Time for gratitude.',
    fitness: 'Maintain routine, start reducing intensity.',
    nutrition: 'Sharing meals, comfort foods in moderation.',
    mindfulness: 'Gratitude journaling, teaching others.',
    sleep: 'Sleep begins to deepen. Honor tiredness.',
  },
  last_quarter: {
    energy: 'Decreasing. Focus on release and letting go.',
    fitness: 'Restorative exercises, release tension through movement.',
    nutrition: 'Detox-supporting foods, reduce heavy foods.',
    mindfulness: 'Forgiveness meditation, releasing what doesn\'t serve you.',
    sleep: 'Deeper sleep cycles. Process and release through dreams.',
  },
  waning_crescent: {
    energy: 'Lowest point. Honor the need for rest.',
    fitness: 'Gentle stretching, restorative yoga, rest days.',
    nutrition: 'Light, easy-to-digest foods. Fasting may feel natural.',
    mindfulness: 'Quiet contemplation, surrender practices, healing.',
    sleep: 'Maximum rest. Prepare for the new cycle.',
  },
};

// Moon sign wellness influences
export const MOON_SIGN_INFLUENCES: Record<ZodiacSign, {
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: string;
  bodyPart: string;
  wellness: string;
  avoid: string;
}> = {
  aries: {
    element: 'fire',
    quality: 'Action-oriented, impulsive, energetic',
    bodyPart: 'Head, face',
    wellness: 'Channel energy into vigorous exercise. Address headaches proactively.',
    avoid: 'Rushing, skipping warm-ups, aggressive behavior',
  },
  taurus: {
    element: 'earth',
    quality: 'Stable, sensual, grounded',
    bodyPart: 'Throat, neck',
    wellness: 'Indulge in healthy comfort foods. Massage is beneficial.',
    avoid: 'Overindulgence, stubbornness about health changes',
  },
  gemini: {
    element: 'air',
    quality: 'Curious, communicative, adaptable',
    bodyPart: 'Hands, arms, lungs',
    wellness: 'Vary your routine. Breathing exercises are powerful.',
    avoid: 'Nervous energy, scattered focus, shallow breathing',
  },
  cancer: {
    element: 'water',
    quality: 'Nurturing, intuitive, protective',
    bodyPart: 'Chest, stomach',
    wellness: 'Honor emotional needs. Soothing teas and home cooking.',
    avoid: 'Emotional eating, isolation, ignoring gut feelings',
  },
  leo: {
    element: 'fire',
    quality: 'Confident, creative, generous',
    bodyPart: 'Heart, spine',
    wellness: 'Heart-healthy activities. Express creativity through movement.',
    avoid: 'Ego-driven decisions, overexertion, ignoring back pain',
  },
  virgo: {
    element: 'earth',
    quality: 'Analytical, helpful, detail-oriented',
    bodyPart: 'Digestive system',
    wellness: 'Clean eating, organized routines. Probiotics beneficial.',
    avoid: 'Perfectionism, criticism, neglecting mental health',
  },
  libra: {
    element: 'air',
    quality: 'Harmonious, diplomatic, aesthetic',
    bodyPart: 'Kidneys, lower back',
    wellness: 'Partner workouts, balanced meals. Hydration important.',
    avoid: 'Indecision about health choices, people-pleasing',
  },
  scorpio: {
    element: 'water',
    quality: 'Intense, transformative, powerful',
    bodyPart: 'Reproductive organs',
    wellness: 'Deep emotional work, intense workouts. Detox beneficial.',
    avoid: 'Holding onto emotional toxicity, obsessive behaviors',
  },
  sagittarius: {
    element: 'fire',
    quality: 'Adventurous, optimistic, philosophical',
    bodyPart: 'Hips, thighs, liver',
    wellness: 'Outdoor activities, exploring new fitness. Moderation in indulgence.',
    avoid: 'Overcommitting, excess, ignoring limits',
  },
  capricorn: {
    element: 'earth',
    quality: 'Disciplined, ambitious, practical',
    bodyPart: 'Bones, knees, skin',
    wellness: 'Structured routines, strength building. Calcium important.',
    avoid: 'Overworking, ignoring joint health, rigidity',
  },
  aquarius: {
    element: 'air',
    quality: 'Innovative, humanitarian, independent',
    bodyPart: 'Ankles, circulation',
    wellness: 'Group fitness, unique approaches. Elevate legs regularly.',
    avoid: 'Detachment from body, irregular schedules, isolation',
  },
  pisces: {
    element: 'water',
    quality: 'Intuitive, compassionate, dreamy',
    bodyPart: 'Feet, lymphatic system',
    wellness: 'Swimming, foot care, energy healing. Honor sensitivity.',
    avoid: 'Escapism, ignoring boundaries, absorbing others\' energy',
  },
};

export interface LunarPhaseData {
  date: string;
  phase: MoonPhase;
  phaseName: string;
  symbol: string;
  illumination: number;
  moonSign: ZodiacSign;
  moonLongitude: number;
  wellness: typeof PHASE_WELLNESS[MoonPhase];
  signInfluence: typeof MOON_SIGN_INFLUENCES[ZodiacSign];
  isSupermoon?: boolean;
  isBloodMoon?: boolean;
}

/**
 * Calculate moon illumination percentage
 */
export function calculateMoonIllumination(date: Date): number {
  const jd = dateToJulianDay(date);

  // Synodic month (new moon to new moon)
  const synodicMonth = 29.530588853;

  // Known new moon date (Jan 6, 2000)
  const knownNewMoon = 2451550.1;

  // Days since known new moon
  const daysSinceNew = jd - knownNewMoon;

  // Position in current cycle (0-1)
  const position = (daysSinceNew % synodicMonth) / synodicMonth;

  // Convert to illumination (0 at new/full, 100 at quarters)
  // Actually we want 0 at new, 100 at full
  const illumination = Math.round((1 - Math.cos(position * 2 * Math.PI)) * 50);

  return illumination;
}

/**
 * Get moon phase from illumination and position in cycle
 */
export function getMoonPhase(date: Date): MoonPhase {
  const jd = dateToJulianDay(date);
  const synodicMonth = 29.530588853;
  const knownNewMoon = 2451550.1;

  const daysSinceNew = jd - knownNewMoon;
  const position = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;

  // Divide lunation into 8 phases
  const phaseDay = position / synodicMonth;

  if (phaseDay < 0.0625) return 'new_moon';
  if (phaseDay < 0.1875) return 'waxing_crescent';
  if (phaseDay < 0.3125) return 'first_quarter';
  if (phaseDay < 0.4375) return 'waxing_gibbous';
  if (phaseDay < 0.5625) return 'full_moon';
  if (phaseDay < 0.6875) return 'waning_gibbous';
  if (phaseDay < 0.8125) return 'last_quarter';
  if (phaseDay < 0.9375) return 'waning_crescent';
  return 'new_moon';
}

/**
 * Get complete lunar data for a date
 */
export function getLunarData(date: Date): LunarPhaseData {
  const planets = calculatePlanetaryPositions(date);
  const moonPos = planets.moon;
  const illumination = calculateMoonIllumination(date);
  const phase = getMoonPhase(date);

  const phaseInfo = MOON_PHASES[phase];
  const signInfluence = MOON_SIGN_INFLUENCES[moonPos.sign];

  return {
    date: date.toISOString().split('T')[0],
    phase,
    phaseName: phaseInfo.name,
    symbol: phaseInfo.symbol,
    illumination,
    moonSign: moonPos.sign,
    moonLongitude: moonPos.longitude,
    wellness: PHASE_WELLNESS[phase],
    signInfluence,
  };
}

/**
 * Get lunar data for a date range
 */
export function getLunarCalendar(startDate: Date, days: number): LunarPhaseData[] {
  const calendar: LunarPhaseData[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    calendar.push(getLunarData(date));
  }

  return calendar;
}

/**
 * Find next occurrence of a specific moon phase
 */
export function findNextPhase(targetPhase: MoonPhase, fromDate: Date = new Date()): Date {
  const maxDays = 30;
  const date = new Date(fromDate);

  for (let i = 0; i < maxDays; i++) {
    date.setDate(date.getDate() + 1);
    if (getMoonPhase(date) === targetPhase) {
      return date;
    }
  }

  return date;
}

/**
 * Get personalized lunar wellness recommendation
 */
export function getLunarWellnessRecommendation(
  date: Date,
  userSign: ZodiacSign
): {
  lunarData: LunarPhaseData;
  personalizedTip: string;
  compatibility: 'high' | 'medium' | 'low';
  focusArea: string;
} {
  const lunarData = getLunarData(date);

  // Determine element compatibility
  const userElement = MOON_SIGN_INFLUENCES[userSign].element;
  const moonElement = MOON_SIGN_INFLUENCES[lunarData.moonSign].element;

  let compatibility: 'high' | 'medium' | 'low';
  if (userElement === moonElement) {
    compatibility = 'high';
  } else if (
    (userElement === 'fire' && moonElement === 'air') ||
    (userElement === 'air' && moonElement === 'fire') ||
    (userElement === 'earth' && moonElement === 'water') ||
    (userElement === 'water' && moonElement === 'earth')
  ) {
    compatibility = 'medium';
  } else {
    compatibility = 'low';
  }

  // Generate personalized tip
  const phaseKeyword = MOON_PHASES[lunarData.phase].keywords[0];
  const signQuality = MOON_SIGN_INFLUENCES[lunarData.moonSign].quality.split(',')[0];

  const personalizedTip = `With the Moon in ${lunarData.moonSign.charAt(0).toUpperCase() + lunarData.moonSign.slice(1)}, ` +
    `embrace ${signQuality.toLowerCase()} energy. As a ${userSign.charAt(0).toUpperCase() + userSign.slice(1)}, ` +
    `focus on ${phaseKeyword} while honoring your ${userElement} nature.`;

  // Determine focus area based on phase and compatibility
  let focusArea: string;
  if (compatibility === 'high') {
    focusArea = lunarData.wellness.fitness;
  } else if (compatibility === 'medium') {
    focusArea = lunarData.wellness.mindfulness;
  } else {
    focusArea = lunarData.wellness.sleep;
  }

  return {
    lunarData,
    personalizedTip,
    compatibility,
    focusArea,
  };
}

/**
 * Calculate void-of-course Moon periods
 * (Moon makes no more aspects before changing signs)
 */
export function isVoidOfCourseMoon(date: Date): boolean {
  // Simplified: just check if moon is in last 2 degrees of sign
  const planets = calculatePlanetaryPositions(date);
  const moonDegree = planets.moon.signDegree;

  return moonDegree >= 28;
}

export default {
  MOON_PHASES,
  PHASE_WELLNESS,
  MOON_SIGN_INFLUENCES,
  calculateMoonIllumination,
  getMoonPhase,
  getLunarData,
  getLunarCalendar,
  findNextPhase,
  getLunarWellnessRecommendation,
  isVoidOfCourseMoon,
};
