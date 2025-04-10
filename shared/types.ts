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
