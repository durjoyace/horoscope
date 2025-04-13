import { db } from './db';
import { storage } from './storage';
import { User } from '@shared/schema';

/**
 * Service for collecting and analyzing user engagement data
 */

// Define analytics data types
export interface UserEngagementStats {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  signupsByZodiacSign: Record<string, number>;
  engagementRate: number;
  premiumConversion: number;
  growthRate: number;
  deliveryStats: {
    emailDeliveryRate: number;
    smsDeliveryRate: number;
    totalDeliveries: number;
  };
  userActivity: {
    newUsers: number[];
    returningUsers: number[];
    labels: string[];
  };
}

export interface ContentPerformanceMetrics {
  topPerformingHoroscopes: Array<{
    date: string;
    sign: string;
    openRate: number;
    clickRate: number;
  }>;
  mostEngagedZodiacSigns: Array<{
    sign: string;
    engagementScore: number;
  }>;
  categoryEngagement: Record<string, number>;
  contentTrends: {
    dates: string[];
    engagementScores: number[];
  };
}

export interface UserRetentionData {
  retentionRate: number;
  retentionByZodiacSign: Record<string, number>;
  churnRate: number;
  averageSessionDuration: number;
  retentionTrend: {
    dates: string[];
    rates: number[];
  };
  userFeedback: {
    category: string;
    score: number;
    count: number;
  }[];
}

export interface DeviceAndLocationData {
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topLocations: {
    region: string;
    users: number;
  }[];
  activeHours: {
    hour: number;
    users: number;
  }[];
}

export interface AnalyticsDashboardData {
  userEngagement: UserEngagementStats;
  contentPerformance: ContentPerformanceMetrics;
  userRetention: UserRetentionData;
  deviceAndLocation: DeviceAndLocationData;
  lastUpdated: string;
}

/**
 * Get dashboard data for analytics
 */
export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  // In a real implementation, this would query the database for actual metrics
  // For now, we'll generate realistic-looking demo data
  const totalUsers = await getTotalUserCount();
  const premiumUsers = await getPremiumUserCount();
  const usersBySign = await getUserCountByZodiacSign();
  const deliveryLogs = await getDeliveryStats();
  
  const premiumConversion = premiumUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;
  
  // Calculate sign distribution for engagement metrics
  const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 
                     'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  const mostEngagedSigns = zodiacSigns.map(sign => {
    // Calculate an engagement score based on user count and delivery stats
    const userCount = usersBySign[sign] || 0;
    const baseEngagementScore = userCount > 0 ? (userCount / totalUsers) * 100 : 0;
    
    return {
      sign,
      engagementScore: parseFloat(baseEngagementScore.toFixed(1))
    };
  }).sort((a, b) => b.engagementScore - a.engagementScore);
  
  // Generate dates for the last 30 days for trend data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Generate hours for activity tracking
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return {
    userEngagement: {
      totalUsers,
      activeUsers: {
        daily: Math.floor(totalUsers * 0.35),
        weekly: Math.floor(totalUsers * 0.65),
        monthly: Math.floor(totalUsers * 0.85),
      },
      signupsByZodiacSign: usersBySign,
      engagementRate: 76.5,
      premiumConversion: parseFloat(premiumConversion.toFixed(1)),
      growthRate: 8.5, // Weekly growth rate
      deliveryStats: {
        emailDeliveryRate: 98.2,
        smsDeliveryRate: 95.7,
        totalDeliveries: deliveryLogs
      },
      userActivity: {
        // Last 7 days of new vs returning users
        labels: last30Days.slice(-7),
        newUsers: [12, 15, 10, 18, 14, 20, 16],
        returningUsers: [42, 38, 45, 40, 36, 41, 52]
      }
    },
    contentPerformance: {
      topPerformingHoroscopes: [
        { date: new Date().toISOString().split('T')[0], sign: 'leo', openRate: 87, clickRate: 42 },
        { date: new Date().toISOString().split('T')[0], sign: 'scorpio', openRate: 85, clickRate: 41 },
        { date: new Date().toISOString().split('T')[0], sign: 'aquarius', openRate: 83, clickRate: 39 },
        { date: new Date().toISOString().split('T')[0], sign: 'taurus', openRate: 80, clickRate: 38 },
        { date: new Date().toISOString().split('T')[0], sign: 'gemini', openRate: 78, clickRate: 37 }
      ],
      mostEngagedZodiacSigns: mostEngagedSigns.slice(0, 5),
      categoryEngagement: {
        'nutrition': 32,
        'sleep': 23,
        'stress': 18,
        'fitness': 17,
        'mindfulness': 10
      },
      contentTrends: {
        dates: last30Days,
        engagementScores: last30Days.map(() => Math.floor(65 + Math.random() * 25))
      }
    },
    userRetention: {
      retentionRate: 72.4,
      retentionByZodiacSign: zodiacSigns.reduce((acc, sign) => {
        // Generate realistic retention rates, slightly different for each sign
        acc[sign] = parseFloat((65 + Math.random() * 15).toFixed(1));
        return acc;
      }, {} as Record<string, number>),
      churnRate: 27.6,
      averageSessionDuration: 3.2,
      retentionTrend: {
        dates: last30Days,
        rates: last30Days.map(() => parseFloat((68 + Math.random() * 10).toFixed(1)))
      },
      userFeedback: [
        { category: 'Content Quality', score: 4.6, count: 128 },
        { category: 'Personalization', score: 4.2, count: 115 },
        { category: 'Usability', score: 4.8, count: 142 },
        { category: 'Recommendations', score: 4.1, count: 89 },
        { category: 'Premium Value', score: 3.9, count: 76 }
      ]
    },
    deviceAndLocation: {
      deviceBreakdown: {
        mobile: 65,
        desktop: 28,
        tablet: 7
      },
      topLocations: [
        { region: 'United States', users: 34 },
        { region: 'United Kingdom', users: 12 },
        { region: 'Canada', users: 8 },
        { region: 'Australia', users: 7 },
        { region: 'Germany', users: 6 },
        { region: 'France', users: 5 },
        { region: 'India', users: 4 },
        { region: 'Spain', users: 3 }
      ],
      activeHours: hours.map(hour => ({
        hour,
        users: Math.floor(
          // Create a realistic curve peaking in the morning and evening
          (hour === 7 || hour === 20) ? 120 + Math.random() * 50 :
          (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22) ? 80 + Math.random() * 40 :
          (hour >= 1 && hour <= 5) ? 10 + Math.random() * 20 : 
          30 + Math.random() * 30
        )
      }))
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get total number of users
 */
async function getTotalUserCount(): Promise<number> {
  try {
    // In a real implementation, this would be a database query
    const users = await storage.getAllUsers();
    return users.length;
  } catch (error) {
    console.error('Error getting total user count:', error);
    return 0;
  }
}

/**
 * Get count of premium users
 */
async function getPremiumUserCount(): Promise<number> {
  try {
    // In a real implementation, this would query the database
    const premiumUsers = await storage.getPremiumUsers();
    return premiumUsers.length;
  } catch (error) {
    console.error('Error getting premium user count:', error);
    return 0;
  }
}

/**
 * Get user count by zodiac sign
 */
async function getUserCountByZodiacSign(): Promise<Record<string, number>> {
  try {
    const users = await storage.getAllUsers();
    const countBySign: Record<string, number> = {};
    
    // Count users by zodiac sign
    users.forEach(user => {
      if (user.zodiacSign) {
        countBySign[user.zodiacSign] = (countBySign[user.zodiacSign] || 0) + 1;
      }
    });
    
    return countBySign;
  } catch (error) {
    console.error('Error getting user count by zodiac sign:', error);
    return {};
  }
}

/**
 * Get delivery statistics
 */
async function getDeliveryStats(): Promise<number> {
  try {
    // In a real implementation, this would query the delivery logs
    const logs = await storage.getAllDeliveryLogs();
    return logs.length;
  } catch (error) {
    console.error('Error getting delivery stats:', error);
    return 0;
  }
}