// Zodiac Signs
export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

// Wellness Categories
export type WellnessCategory = 
  | 'nutrition'
  | 'sleep'
  | 'stress'
  | 'fitness'
  | 'mindfulness';

// Horoscope Content
export interface HoroscopeContent {
  overview: string;
  wellnessCategories: WellnessCategory[];
  healthTip: string;
  nutritionFocus: string;
  elementAlignment: string;
}

// Horoscope Response
export interface HoroscopeResponse {
  sign: ZodiacSign;
  date: string;
  content: HoroscopeContent;
}

// User Input for Signup
export interface UserSignupInput {
  email: string;
  zodiacSign: ZodiacSign;
  birthdate?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  smsOptIn: boolean;
  newsletterOptIn?: boolean;
  password?: string;
}

// Delivery Status
export type DeliveryStatus = 'success' | 'failed';

// Delivery Type
export type DeliveryType = 'email' | 'sms';

// Subscription Status
export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'none';

// Subscription Tier
export type SubscriptionTier = 'free' | 'premium' | 'pro';

// Premium Report Content
export interface PremiumReportContent {
  weeklyOverview: string;
  wellnessInsights: string;
  monthlyForecast: string;
  personalizedRecommendations: string[];
  compatibilityInsights: string;
  challengeAreas: string;
  growthOpportunities: string;
}

// Premium Report Response
export interface PremiumReportResponse {
  sign: ZodiacSign;
  weekStartDate: string;
  weekEndDate: string;
  content: PremiumReportContent;
}

// Pricing Plan
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  tier: SubscriptionTier;
}

// Subscription Input
export interface SubscriptionInput {
  userId: number;
  priceId: string;
  paymentMethodId?: string;
}
