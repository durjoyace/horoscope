/**
 * Birth Chart Types
 */

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type PlanetKey =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'northNode' | 'chiron';

export interface CelestialPosition {
  longitude: number;
  latitude?: number;
  speed?: number;
  retrograde?: boolean;
  sign: ZodiacSign;
  signDegree: number;
  house?: number;
  interpretation?: string;
}

export interface Aspect {
  planet1: PlanetKey;
  planet2: PlanetKey;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx' | 'semisextile';
  angle: number;
  orb: number;
  applying: boolean;
  interpretation?: string;
}

export interface HouseData {
  number: number;
  cusp: number;
  sign: ZodiacSign;
  meaning: {
    house: number;
    name: string;
    keywords: string[];
  };
}

export interface BirthChartData {
  id: number;
  userId: number;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  planets: Record<PlanetKey, CelestialPosition>;
  houses: HouseData[];
  aspects: Aspect[];
  ascendant: number | null;
  midheaven: number | null;
  elementBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalityBalance: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  dominantPlanets: PlanetKey[];
  chartPattern?: string;
  calculatedAt: Date;
}

export interface TransitData {
  planet: PlanetKey;
  currentPosition: CelestialPosition;
  natalPosition: CelestialPosition;
  aspect?: {
    type: string;
    orb: number;
    interpretation: string;
  };
}

export interface LunarPhaseData {
  date: string;
  phase: string;
  phaseName: string;
  symbol: string;
  illumination: number;
  moonSign: ZodiacSign;
  moonLongitude: number;
  wellness: {
    energy: string;
    fitness: string;
    nutrition: string;
    mindfulness: string;
    sleep: string;
  };
  signInfluence: {
    element: string;
    quality: string;
    bodyPart: string;
    wellness: string;
    avoid: string;
  };
}

// Planet visual data
export const PLANET_INFO: Record<PlanetKey, {
  name: string;
  symbol: string;
  color: string;
}> = {
  sun: { name: 'Sun', symbol: '☉', color: '#FFD700' },
  moon: { name: 'Moon', symbol: '☽', color: '#C0C0C0' },
  mercury: { name: 'Mercury', symbol: '☿', color: '#B5B5B5' },
  venus: { name: 'Venus', symbol: '♀', color: '#FFB6C1' },
  mars: { name: 'Mars', symbol: '♂', color: '#FF4500' },
  jupiter: { name: 'Jupiter', symbol: '♃', color: '#FFA500' },
  saturn: { name: 'Saturn', symbol: '♄', color: '#8B8970' },
  uranus: { name: 'Uranus', symbol: '♅', color: '#40E0D0' },
  neptune: { name: 'Neptune', symbol: '♆', color: '#1E90FF' },
  pluto: { name: 'Pluto', symbol: '♇', color: '#8B0000' },
  northNode: { name: 'North Node', symbol: '☊', color: '#9370DB' },
  chiron: { name: 'Chiron', symbol: '⚷', color: '#808000' },
};

// Zodiac sign visual data
export const ZODIAC_INFO: Record<ZodiacSign, {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  color: string;
}> = {
  aries: { name: 'Aries', symbol: '♈', element: 'fire', color: '#FF4136' },
  taurus: { name: 'Taurus', symbol: '♉', element: 'earth', color: '#2ECC40' },
  gemini: { name: 'Gemini', symbol: '♊', element: 'air', color: '#FFDC00' },
  cancer: { name: 'Cancer', symbol: '♋', element: 'water', color: '#7FDBFF' },
  leo: { name: 'Leo', symbol: '♌', element: 'fire', color: '#FF851B' },
  virgo: { name: 'Virgo', symbol: '♍', element: 'earth', color: '#3D9970' },
  libra: { name: 'Libra', symbol: '♎', element: 'air', color: '#F012BE' },
  scorpio: { name: 'Scorpio', symbol: '♏', element: 'water', color: '#85144b' },
  sagittarius: { name: 'Sagittarius', symbol: '♐', element: 'fire', color: '#B10DC9' },
  capricorn: { name: 'Capricorn', symbol: '♑', element: 'earth', color: '#111111' },
  aquarius: { name: 'Aquarius', symbol: '♒', element: 'air', color: '#0074D9' },
  pisces: { name: 'Pisces', symbol: '♓', element: 'water', color: '#39CCCC' },
};

// Aspect visual data
export const ASPECT_INFO: Record<string, {
  name: string;
  symbol: string;
  color: string;
  nature: 'harmonious' | 'challenging' | 'neutral';
}> = {
  conjunction: { name: 'Conjunction', symbol: '☌', color: '#FFD700', nature: 'neutral' },
  opposition: { name: 'Opposition', symbol: '☍', color: '#FF4500', nature: 'challenging' },
  trine: { name: 'Trine', symbol: '△', color: '#32CD32', nature: 'harmonious' },
  square: { name: 'Square', symbol: '□', color: '#DC143C', nature: 'challenging' },
  sextile: { name: 'Sextile', symbol: '⚹', color: '#4169E1', nature: 'harmonious' },
  quincunx: { name: 'Quincunx', symbol: '⚻', color: '#9370DB', nature: 'challenging' },
  semisextile: { name: 'Semi-sextile', symbol: '⚺', color: '#20B2AA', nature: 'neutral' },
};
