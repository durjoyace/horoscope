import twilio from 'twilio';
import { User } from '@shared/schema';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  throw new Error("Missing required Twilio environment variables");
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

import { HoroscopeContent } from '@shared/types';

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    // Clean phone number format
    const cleanedNumber = to.replace(/[^\d+]/g, '');
    const formattedNumber = cleanedNumber.startsWith('+') ? cleanedNumber : `+1${cleanedNumber}`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formattedNumber,
    });

    console.log(`SMS sent successfully to ${formattedNumber}: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export function createHoroscopeSMSContent(
  user: User,
  horoscope: HoroscopeContent,
): string {
  const greeting = user.firstName 
    ? `Hi ${user.firstName}!` 
    : `Hello ${user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}!`;

  const signEmoji = getZodiacEmoji(user.zodiacSign);
  
  return `${greeting} ${signEmoji}

Your Daily ${user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)} Horoscope:

${horoscope.overview}

💚 Health Focus: ${horoscope.healthTip}

🍃 Nutrition: ${horoscope.nutritionFocus}

Stay cosmic! ✨
HoroscopeHealth.com`;
}

function getZodiacEmoji(sign: string): string {
  const emojiMap: Record<string, string> = {
    'aries': '♈',
    'taurus': '♉',
    'gemini': '♊',
    'cancer': '♋',
    'leo': '♌',
    'virgo': '♍',
    'libra': '♎',
    'scorpio': '♏',
    'sagittarius': '♐',
    'capricorn': '♑',
    'aquarius': '♒',
    'pisces': '♓'
  };
  return emojiMap[sign] || '✨';
}

export async function sendHoroscopeSMS(
  user: User,
  horoscopeContent: HoroscopeContent,
): Promise<boolean> {
  if (!user.phone || !user.smsOptIn) {
    console.log(`Skipping SMS for user ${user.id}: no phone or SMS opt-in disabled`);
    return false;
  }

  const smsContent = createHoroscopeSMSContent(user, horoscopeContent);
  return await sendSMS(user.phone, smsContent);
}

export async function sendWelcomeSMS(user: User): Promise<boolean> {
  if (!user.phone || !user.smsOptIn) {
    return false;
  }

  const message = `Welcome to HoroscopeHealth, ${user.firstName || 'cosmic soul'}! ✨

You'll receive your daily ${user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)} horoscope every morning.

Reply STOP to opt out anytime.

Stay aligned! 🌟`;

  return await sendSMS(user.phone, message);
}