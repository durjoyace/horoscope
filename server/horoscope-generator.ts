import { format } from 'date-fns';
import { storage } from './storage';
import { generateHealthHoroscope } from './openai';
import { ZodiacSign, HoroscopeContent, WellnessCategory } from '@shared/types';

// Generate horoscopes for all zodiac signs for a specific date
export async function generateDailyHoroscopes(date?: string): Promise<void> {
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  console.log(`Generating horoscopes for ${targetDate}`);
  
  const zodiacSigns: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  for (const sign of zodiacSigns) {
    try {
      // Check if horoscope already exists
      const existingHoroscope = await storage.getHoroscopeBySignAndDate(sign, targetDate);
      
      if (existingHoroscope) {
        console.log(`Horoscope already exists for ${sign} on ${targetDate}`);
        continue;
      }
      
      // Generate new horoscope
      const horoscopeContent = await generateHealthHoroscope(sign, targetDate);

      // Save to storage with properly mapped fields
      await storage.createHoroscope({
        zodiacSign: sign,
        date: targetDate,
        title: `Daily ${sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope`,
        content: horoscopeContent.overview,
        wellness: horoscopeContent.healthTip,
        nutrition: horoscopeContent.nutritionFocus,
        mindfulness: horoscopeContent.elementAlignment,
        isAiGenerated: true,
      });
      
      console.log(`Generated horoscope for ${sign} on ${targetDate}`);
      
      // Add a small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error generating horoscope for ${sign}:`, error);
    }
  }
}

// Get a horoscope for a specific sign and date
export async function getHoroscopeForSign(sign: ZodiacSign, date?: string): Promise<HoroscopeContent> {
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  
  // Check if horoscope exists in storage
  let horoscope = await storage.getHoroscopeBySignAndDate(sign, targetDate);
  
  // If not found, generate it
  if (!horoscope) {
    const content = await generateHealthHoroscope(sign, targetDate);
    horoscope = await storage.createHoroscope({
      zodiacSign: sign,
      date: targetDate,
      title: `Daily ${sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope`,
      content: content.overview,
      wellness: content.healthTip,
      nutrition: content.nutritionFocus,
      mindfulness: content.elementAlignment,
      isAiGenerated: true,
    });
  }

  // Reconstruct HoroscopeContent from database fields
  return {
    overview: horoscope.content,
    wellnessCategories: ['nutrition', 'mindfulness'] as WellnessCategory[],
    healthTip: horoscope.wellness,
    nutritionFocus: horoscope.nutrition || '',
    elementAlignment: horoscope.mindfulness || '',
  };
}
