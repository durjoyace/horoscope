/**
 * Ephemeris Service - Handles planetary position calculations
 * Uses astronomical algorithms for accurate celestial body positioning
 */

import { logger } from '../../logger';

// Zodiac signs in order
export const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

// Planet definitions
export const PLANETS = {
  sun: { symbol: '☉', name: 'Sun', color: '#FFD700' },
  moon: { symbol: '☽', name: 'Moon', color: '#C0C0C0' },
  mercury: { symbol: '☿', name: 'Mercury', color: '#B5B5B5' },
  venus: { symbol: '♀', name: 'Venus', color: '#FFB6C1' },
  mars: { symbol: '♂', name: 'Mars', color: '#FF4500' },
  jupiter: { symbol: '♃', name: 'Jupiter', color: '#FFA500' },
  saturn: { symbol: '♄', name: 'Saturn', color: '#8B8970' },
  uranus: { symbol: '♅', name: 'Uranus', color: '#40E0D0' },
  neptune: { symbol: '♆', name: 'Neptune', color: '#1E90FF' },
  pluto: { symbol: '♇', name: 'Pluto', color: '#8B0000' },
  northNode: { symbol: '☊', name: 'North Node', color: '#9370DB' },
  chiron: { symbol: '⚷', name: 'Chiron', color: '#808000' },
} as const;

export type PlanetKey = keyof typeof PLANETS;

// Aspect definitions with orbs
export const ASPECTS = {
  conjunction: { angle: 0, orb: 8, symbol: '☌', name: 'Conjunction', color: '#FFD700' },
  opposition: { angle: 180, orb: 8, symbol: '☍', name: 'Opposition', color: '#FF4500' },
  trine: { angle: 120, orb: 8, symbol: '△', name: 'Trine', color: '#32CD32' },
  square: { angle: 90, orb: 7, symbol: '□', name: 'Square', color: '#DC143C' },
  sextile: { angle: 60, orb: 6, symbol: '⚹', name: 'Sextile', color: '#4169E1' },
  quincunx: { angle: 150, orb: 3, symbol: '⚻', name: 'Quincunx', color: '#9370DB' },
  semisextile: { angle: 30, orb: 2, symbol: '⚺', name: 'Semi-sextile', color: '#20B2AA' },
} as const;

// House system types
export type HouseSystem = 'placidus' | 'koch' | 'whole-sign' | 'equal' | 'campanus';

// Position interface
export interface CelestialPosition {
  longitude: number; // 0-360 degrees
  latitude?: number;
  speed?: number; // degrees per day
  retrograde?: boolean;
  sign: ZodiacSign;
  signDegree: number; // 0-30 within sign
  house?: number;
}

// Aspect interface
export interface Aspect {
  planet1: PlanetKey;
  planet2: PlanetKey;
  type: keyof typeof ASPECTS;
  angle: number;
  orb: number;
  applying: boolean;
}

// Full chart data
export interface ChartData {
  dateTime: Date;
  latitude: number;
  longitude: number;
  timezone: string;
  planets: Record<PlanetKey, CelestialPosition>;
  houses: number[]; // 12 house cusps in degrees
  ascendant: number;
  midheaven: number;
  aspects: Aspect[];
}

/**
 * Convert decimal degrees to sign position
 */
export function degreesToSign(longitude: number): { sign: ZodiacSign; degree: number } {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degree = normalizedLong % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100,
  };
}

/**
 * Calculate Julian Day from date
 */
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd = Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day + hour / 24 + b - 1524.5;

  return jd;
}

/**
 * Calculate centuries from J2000.0
 */
function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/**
 * Calculate Sun position (simplified)
 */
function calculateSunPosition(jd: number): CelestialPosition {
  const T = julianCenturies(jd);

  // Mean longitude
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;

  // Mean anomaly
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
  const Mrad = M * Math.PI / 180;

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  // Sun's true longitude
  let longitude = (L0 + C) % 360;
  if (longitude < 0) longitude += 360;

  const { sign, degree } = degreesToSign(longitude);

  return {
    longitude,
    latitude: 0,
    speed: 0.9856, // approximate
    retrograde: false,
    sign,
    signDegree: degree,
  };
}

/**
 * Calculate Moon position (simplified)
 */
function calculateMoonPosition(jd: number): CelestialPosition {
  const T = julianCenturies(jd);

  // Moon's mean longitude
  const L = (218.3164477 + 481267.88123421 * T - 0.0015786 * T * T) % 360;

  // Moon's mean elongation
  const D = (297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) % 360;

  // Sun's mean anomaly
  const Ms = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) % 360;

  // Moon's mean anomaly
  const Mm = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) % 360;

  // Moon's argument of latitude
  const F = (93.272095 + 483202.0175233 * T - 0.0036539 * T * T) % 360;

  // Convert to radians
  const Drad = D * Math.PI / 180;
  const Msrad = Ms * Math.PI / 180;
  const Mmrad = Mm * Math.PI / 180;
  const Frad = F * Math.PI / 180;

  // Simplified longitude calculation
  let longitude = L +
    6.289 * Math.sin(Mmrad) +
    1.274 * Math.sin(2 * Drad - Mmrad) +
    0.658 * Math.sin(2 * Drad) +
    0.214 * Math.sin(2 * Mmrad) -
    0.186 * Math.sin(Msrad) -
    0.114 * Math.sin(2 * Frad);

  longitude = ((longitude % 360) + 360) % 360;

  const { sign, degree } = degreesToSign(longitude);

  return {
    longitude,
    latitude: 0,
    speed: 13.176, // approximate degrees per day
    retrograde: false,
    sign,
    signDegree: degree,
  };
}

/**
 * Calculate planetary position using simplified algorithm
 */
function calculatePlanetPosition(planet: string, jd: number): CelestialPosition {
  const T = julianCenturies(jd);

  // Orbital elements for planets (simplified J2000.0 values)
  const elements: Record<string, {
    a: number; // semi-major axis
    e: number; // eccentricity
    i: number; // inclination
    L: number[]; // mean longitude coefficients
    w: number[]; // longitude of perihelion coefficients
    period: number; // orbital period in days
  }> = {
    mercury: {
      a: 0.387, e: 0.206, i: 7.0,
      L: [252.25084, 149472.67411, 0],
      w: [77.45645, 0.15957, 0],
      period: 87.97,
    },
    venus: {
      a: 0.723, e: 0.007, i: 3.4,
      L: [181.97973, 58517.81539, 0],
      w: [131.60246, 0, 0],
      period: 224.7,
    },
    mars: {
      a: 1.524, e: 0.093, i: 1.9,
      L: [355.45332, 19140.30268, 0],
      w: [336.04084, 0.46002, 0],
      period: 686.98,
    },
    jupiter: {
      a: 5.203, e: 0.048, i: 1.3,
      L: [34.40438, 3034.74612, 0],
      w: [14.72847, 0.21253, 0],
      period: 4332.59,
    },
    saturn: {
      a: 9.537, e: 0.054, i: 2.5,
      L: [49.95424, 1222.11379, 0],
      w: [92.59887, 0.54626, 0],
      period: 10759.22,
    },
    uranus: {
      a: 19.19, e: 0.047, i: 0.8,
      L: [313.23218, 428.48202, 0],
      w: [170.95427, 0.40805, 0],
      period: 30688.5,
    },
    neptune: {
      a: 30.07, e: 0.009, i: 1.8,
      L: [304.88003, 218.45945, 0],
      w: [44.96476, 0.36659, 0],
      period: 60182,
    },
    pluto: {
      a: 39.48, e: 0.249, i: 17.2,
      L: [238.92881, 145.20780, 0],
      w: [224.06676, 0, 0],
      period: 90560,
    },
  };

  const el = elements[planet];
  if (!el) {
    // Return placeholder for unsupported bodies
    return {
      longitude: 0,
      sign: 'aries',
      signDegree: 0,
    };
  }

  // Calculate mean longitude
  const L = (el.L[0] + el.L[1] * T + el.L[2] * T * T) % 360;

  // Calculate mean anomaly (simplified)
  const w = (el.w[0] + el.w[1] * T + el.w[2] * T * T) % 360;
  const M = L - w;
  const Mrad = M * Math.PI / 180;

  // Solve Kepler's equation (simplified)
  const E = M + (180 / Math.PI) * el.e * Math.sin(Mrad) * (1 + el.e * Math.cos(Mrad));
  const Erad = E * Math.PI / 180;

  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1 + el.e) * Math.sin(Erad / 2),
    Math.sqrt(1 - el.e) * Math.cos(Erad / 2)
  ) * 180 / Math.PI;

  // Heliocentric longitude
  let longitude = (v + w) % 360;
  if (longitude < 0) longitude += 360;

  // Calculate daily motion (approximate)
  const speed = 360 / el.period;
  const retrograde = false; // Would need more complex calculation

  const { sign, degree } = degreesToSign(longitude);

  return {
    longitude,
    latitude: 0,
    speed,
    retrograde,
    sign,
    signDegree: degree,
  };
}

/**
 * Calculate North Node position
 */
function calculateNorthNode(jd: number): CelestialPosition {
  const T = julianCenturies(jd);

  // Mean longitude of ascending node
  let longitude = 125.04452 - 1934.136261 * T;
  longitude = ((longitude % 360) + 360) % 360;

  const { sign, degree } = degreesToSign(longitude);

  return {
    longitude,
    sign,
    signDegree: degree,
    retrograde: true, // Node always retrograde
    speed: -0.053,
  };
}

/**
 * Calculate Chiron position (simplified)
 */
function calculateChiron(jd: number): CelestialPosition {
  // Simplified Chiron calculation
  const T = julianCenturies(jd);

  // Approximate orbital elements
  const L = (209.39 + 7.1466 * T * 365.25) % 360;
  const longitude = ((L % 360) + 360) % 360;

  const { sign, degree } = degreesToSign(longitude);

  return {
    longitude,
    sign,
    signDegree: degree,
    speed: 0.02,
    retrograde: false,
  };
}

/**
 * Calculate all planetary positions
 */
export function calculatePlanetaryPositions(date: Date): Record<PlanetKey, CelestialPosition> {
  const jd = dateToJulianDay(date);

  return {
    sun: calculateSunPosition(jd),
    moon: calculateMoonPosition(jd),
    mercury: calculatePlanetPosition('mercury', jd),
    venus: calculatePlanetPosition('venus', jd),
    mars: calculatePlanetPosition('mars', jd),
    jupiter: calculatePlanetPosition('jupiter', jd),
    saturn: calculatePlanetPosition('saturn', jd),
    uranus: calculatePlanetPosition('uranus', jd),
    neptune: calculatePlanetPosition('neptune', jd),
    pluto: calculatePlanetPosition('pluto', jd),
    northNode: calculateNorthNode(jd),
    chiron: calculateChiron(jd),
  };
}

/**
 * Calculate house cusps (Placidus system)
 */
export function calculateHouses(
  date: Date,
  latitude: number,
  longitude: number
): { houses: number[]; ascendant: number; midheaven: number } {
  const jd = dateToJulianDay(date);
  const T = julianCenturies(jd);

  // Calculate Local Sidereal Time
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T - T * T * T / 38710000;
  const lst = ((gmst + longitude) % 360 + 360) % 360;

  // Calculate obliquity of ecliptic
  const eps = 23.439291 - 0.0130042 * T;
  const epsRad = eps * Math.PI / 180;

  // Calculate RAMC (Right Ascension of Medium Coeli)
  const ramcRad = lst * Math.PI / 180;

  // Calculate Midheaven (MC)
  let mc = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
  mc = (mc * 180 / Math.PI + 360) % 360;

  // Calculate Ascendant
  const latRad = latitude * Math.PI / 180;
  let asc = Math.atan2(
    -Math.cos(ramcRad),
    Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad)
  );
  asc = (asc * 180 / Math.PI + 360) % 360;

  // For whole-sign houses (simpler), use ascendant sign as 1st house
  // For Placidus, we'd need more complex calculations
  const houses: number[] = [];
  const ascSign = Math.floor(asc / 30) * 30;

  for (let i = 0; i < 12; i++) {
    houses.push((ascSign + i * 30) % 360);
  }

  return {
    houses,
    ascendant: asc,
    midheaven: mc,
  };
}

/**
 * Calculate aspects between planets
 */
export function calculateAspects(planets: Record<PlanetKey, CelestialPosition>): Aspect[] {
  const aspects: Aspect[] = [];
  const planetKeys = Object.keys(planets) as PlanetKey[];

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = planetKeys[i];
      const p2 = planetKeys[j];
      const pos1 = planets[p1];
      const pos2 = planets[p2];

      // Calculate angle between planets
      let angle = Math.abs(pos1.longitude - pos2.longitude);
      if (angle > 180) angle = 360 - angle;

      // Check each aspect type
      for (const [aspectType, aspectDef] of Object.entries(ASPECTS)) {
        const orb = Math.abs(angle - aspectDef.angle);
        if (orb <= aspectDef.orb) {
          // Determine if aspect is applying or separating
          const applying = pos1.speed && pos2.speed
            ? (pos1.speed > pos2.speed) === (pos1.longitude < pos2.longitude)
            : true;

          aspects.push({
            planet1: p1,
            planet2: p2,
            type: aspectType as keyof typeof ASPECTS,
            angle: Math.round(angle * 100) / 100,
            orb: Math.round(orb * 100) / 100,
            applying,
          });
          break; // Only one aspect per planet pair
        }
      }
    }
  }

  return aspects;
}

/**
 * Get zodiac sign from birthdate
 */
export function getZodiacSignFromDate(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

/**
 * Format degree as sign notation (e.g., "15° Aries 23'")
 */
export function formatDegreeAsSign(longitude: number): string {
  const { sign, degree } = degreesToSign(longitude);
  const wholeDegree = Math.floor(degree);
  const minutes = Math.round((degree - wholeDegree) * 60);
  return `${wholeDegree}° ${sign.charAt(0).toUpperCase() + sign.slice(1)} ${minutes}'`;
}

export default {
  ZODIAC_SIGNS,
  PLANETS,
  ASPECTS,
  calculatePlanetaryPositions,
  calculateHouses,
  calculateAspects,
  degreesToSign,
  dateToJulianDay,
  getZodiacSignFromDate,
  formatDegreeAsSign,
};
