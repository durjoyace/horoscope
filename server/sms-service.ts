import { User } from '@shared/schema';
import { HoroscopeContent } from '@shared/types';

// Twilio is optional - only load if configured
const twilioEnabled = !!(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
);

// Lazy-load Twilio client only when needed
let twilioClient: any = null;

async function getTwilioClient() {
  if (!twilioEnabled) return null;

  if (!twilioClient) {
    const twilio = await import('twilio');
    twilioClient = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
}

if (!twilioEnabled) {
  console.log('Twilio not configured - SMS features disabled');
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!twilioEnabled) {
    console.log('SMS skipped - Twilio not configured');
    return false;
  }

  try {
    const client = await getTwilioClient();
    if (!client) return false;

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
  const zodiacSign = user.zodiacSign || 'aries';
  const greeting = user.firstName
    ? `Hi ${user.firstName}!`
    : `Hello ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}!`;

  const signEmoji = getZodiacEmoji(zodiacSign);

  return `${greeting} ${signEmoji}

Your Daily ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} Horoscope:

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

  const zodiacSign = user.zodiacSign || 'aries';
  const message = `Welcome to HoroscopeHealth, ${user.firstName || 'cosmic soul'}! ✨

You'll receive your daily ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} horoscope every morning.

Reply STOP to opt out anytime.

Stay aligned! 🌟`;

  return await sendSMS(user.phone, message);
}
