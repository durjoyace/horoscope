/**
 * Birth Chart API Routes
 * Handles natal chart creation, retrieval, and transit calculations
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../logger';
import {
  createBirthChart,
  getBirthChart,
  getTransits,
  getChartComparison,
} from '../services/astrology/birth-chart.service';
import {
  getLunarData,
  getLunarCalendar,
  getLunarWellnessRecommendation,
  findNextPhase,
  type MoonPhase,
} from '../services/astrology/lunar.service';
import {
  calculatePlanetaryPositions,
  ZODIAC_SIGNS,
  PLANETS,
  type ZodiacSign,
} from '../services/astrology/ephemeris.service';

const router = Router();

// Validation schemas
const birthChartInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Birth time must be in HH:MM format').optional(),
  birthTimezone: z.string().optional(),
  birthTimeAccuracy: z.enum(['exact', 'approximate', 'unknown']).default('unknown'),
  birthCity: z.string().min(1, 'Birth city is required'),
  birthState: z.string().optional(),
  birthCountry: z.string().min(1, 'Birth country is required'),
  latitude: z.string(),
  longitude: z.string(),
});

/**
 * POST /api/v2/birth-charts
 * Create or update birth chart for authenticated user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const validatedInput = birthChartInputSchema.parse(req.body);

    const chart = await createBirthChart({
      userId: req.user.id,
      ...validatedInput,
    });

    logger.info(`Birth chart created for user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Birth chart created successfully',
      data: chart,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating birth chart');

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not create birth chart. Please try again later.',
    });
  }
});

/**
 * GET /api/v2/birth-charts/me
 * Get birth chart for authenticated user
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const chart = await getBirthChart(req.user.id);

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Birth chart not found. Please create one first.',
      });
    }

    res.status(200).json({
      success: true,
      data: chart,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching birth chart');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve birth chart. Please try again later.',
    });
  }
});

/**
 * GET /api/v2/birth-charts/transits
 * Get current transits relative to user's natal chart
 */
router.get('/transits', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const transits = await getTransits(req.user.id);

    // Filter to show only significant transits (with aspects to natal)
    const significantTransits = transits.filter((t) => t.aspect);

    res.status(200).json({
      success: true,
      data: {
        transits,
        significantTransits,
        currentDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching transits');

    if ((error as Error).message === 'Birth chart not found') {
      return res.status(404).json({
        success: false,
        message: 'Birth chart required to calculate transits.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not calculate transits. Please try again later.',
    });
  }
});

/**
 * GET /api/v2/birth-charts/synastry/:userId
 * Get synastry (compatibility) between authenticated user and another user
 */
router.get('/synastry/:userId', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const comparison = await getChartComparison(req.user.id, otherUserId);

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error calculating synastry');

    if ((error as Error).message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Birth chart not found for one or both users.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Could not calculate compatibility. Please try again later.',
    });
  }
});

/**
 * GET /api/v2/ephemeris/current
 * Get current planetary positions
 */
router.get('/ephemeris/current', async (_req: Request, res: Response) => {
  try {
    const date = new Date();
    const positions = calculatePlanetaryPositions(date);

    res.status(200).json({
      success: true,
      data: {
        date: date.toISOString(),
        planets: positions,
        planetInfo: PLANETS,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error calculating current positions');
    res.status(500).json({
      success: false,
      message: 'Could not calculate planetary positions.',
    });
  }
});

/**
 * GET /api/v2/ephemeris/positions/:date
 * Get planetary positions for a specific date
 */
router.get('/ephemeris/positions/:date', async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    const positions = calculatePlanetaryPositions(date);

    res.status(200).json({
      success: true,
      data: {
        date: date.toISOString(),
        planets: positions,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error calculating positions for date');
    res.status(500).json({
      success: false,
      message: 'Could not calculate planetary positions.',
    });
  }
});

/**
 * GET /api/v2/lunar/current
 * Get current moon phase and lunar data
 */
router.get('/lunar/current', async (_req: Request, res: Response) => {
  try {
    const lunarData = getLunarData(new Date());

    res.status(200).json({
      success: true,
      data: lunarData,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching lunar data');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve lunar data.',
    });
  }
});

/**
 * GET /api/v2/lunar/phase/:date
 * Get moon phase for a specific date
 */
router.get('/lunar/phase/:date', async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    const lunarData = getLunarData(date);

    res.status(200).json({
      success: true,
      data: lunarData,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching lunar phase');
    res.status(500).json({
      success: false,
      message: 'Could not retrieve lunar data.',
    });
  }
});

/**
 * GET /api/v2/lunar/calendar
 * Get lunar calendar for a date range
 */
router.get('/lunar/calendar', async (req: Request, res: Response) => {
  try {
    const startDateStr = req.query.start as string || new Date().toISOString().split('T')[0];
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start date format. Use YYYY-MM-DD.',
      });
    }

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 365.',
      });
    }

    const calendar = getLunarCalendar(startDate, days);

    res.status(200).json({
      success: true,
      data: {
        startDate: startDate.toISOString().split('T')[0],
        days,
        phases: calendar,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error generating lunar calendar');
    res.status(500).json({
      success: false,
      message: 'Could not generate lunar calendar.',
    });
  }
});

/**
 * GET /api/v2/lunar/next/:phase
 * Find the next occurrence of a specific moon phase
 */
router.get('/lunar/next/:phase', async (req: Request, res: Response) => {
  try {
    const phase = req.params.phase as MoonPhase;

    const validPhases = [
      'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'
    ];

    if (!validPhases.includes(phase)) {
      return res.status(400).json({
        success: false,
        message: `Invalid phase. Valid phases are: ${validPhases.join(', ')}`,
      });
    }

    const nextDate = findNextPhase(phase);
    const lunarData = getLunarData(nextDate);

    res.status(200).json({
      success: true,
      data: {
        phase,
        date: nextDate.toISOString().split('T')[0],
        details: lunarData,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error finding next phase');
    res.status(500).json({
      success: false,
      message: 'Could not find next moon phase.',
    });
  }
});

/**
 * GET /api/v2/lunar/wellness
 * Get personalized lunar wellness recommendation
 */
router.get('/lunar/wellness', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const userSign = (req.user.zodiacSign || 'aries').toLowerCase() as ZodiacSign;

    if (!ZODIAC_SIGNS.includes(userSign)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid zodiac sign in user profile',
      });
    }

    const recommendation = getLunarWellnessRecommendation(new Date(), userSign);

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error generating lunar wellness');
    res.status(500).json({
      success: false,
      message: 'Could not generate wellness recommendation.',
    });
  }
});

/**
 * GET /api/v2/zodiac/signs
 * Get list of all zodiac signs with details
 */
router.get('/zodiac/signs', (_req: Request, res: Response) => {
  const signs = ZODIAC_SIGNS.map((sign, index) => ({
    name: sign,
    displayName: sign.charAt(0).toUpperCase() + sign.slice(1),
    number: index + 1,
    startDegree: index * 30,
    endDegree: (index + 1) * 30 - 1,
    element: ['fire', 'earth', 'air', 'water'][index % 4],
    modality: ['cardinal', 'fixed', 'mutable'][index % 3],
    symbol: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][index],
  }));

  res.status(200).json({
    success: true,
    data: signs,
  });
});

/**
 * GET /api/v2/planets
 * Get list of all planets with details
 */
router.get('/planets', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: PLANETS,
  });
});

export default router;
