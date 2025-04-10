import { User } from "@shared/schema";
import { HoroscopeContent } from "@shared/types";

// This is a mock SMS service for demonstration
// In a real application, you would use a service like Twilio, Nexmo, etc.
export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    console.log(`Sending SMS to ${to}`);
    console.log(`Message: ${message}`);
    
    // In a real implementation, you'd connect to an SMS API
    // For now, we'll simulate success
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

// Create SMS content from horoscope data
export function createHoroscopeSMSContent(
  user: User,
  horoscope: HoroscopeContent
): string {
  const firstName = user.firstName || '';
  const sign = user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1);
  
  // Create a short version of the horoscope for SMS
  const greeting = firstName ? `Hi ${firstName}! ` : '';
  const message = `${greeting}${sign} health horoscope: ${horoscope.healthTip} ${horoscope.elementAlignment}`;
  
  // Ensure the message is not too long (SMS typically has 160 char limit)
  if (message.length <= 160) {
    return message;
  }
  
  // Truncate if necessary
  return message.substring(0, 156) + '...';
}

// Send daily horoscope SMS to a user
export async function sendHoroscopeSMS(
  user: User,
  horoscopeContent: HoroscopeContent
): Promise<boolean> {
  if (!user.phone || !user.smsOptIn) {
    return false;
  }
  
  try {
    const smsContent = createHoroscopeSMSContent(user, horoscopeContent);
    const result = await sendSMS(user.phone, smsContent);
    
    return result;
  } catch (error) {
    console.error("Error sending horoscope SMS:", error);
    return false;
  }
}
