import { format } from 'date-fns';
import { storage } from './storage';
import { generateDailyHoroscopes, getHoroscopeForSign } from './horoscope-generator';
import { sendHoroscopeEmail } from './email-service';
import { sendHoroscopeSMS } from './sms-service';
import { User } from '@shared/schema';

// Initialize the scheduler
export function initializeScheduler(): void {
  console.log('Initializing scheduler for daily horoscope delivery');
  
  // Schedule daily horoscope generation (e.g., every day at 1 AM)
  scheduleHoroscopeGeneration();
  
  // Schedule daily horoscope delivery (e.g., every day at 6 AM)
  scheduleHoroscopeDelivery();
}

// Schedule the generation of horoscopes
function scheduleHoroscopeGeneration(): void {
  // In a real application, you would use something like node-cron
  // For now, we'll set up a simple daily timer
  
  const now = new Date();
  const oneAM = new Date(now);
  oneAM.setHours(1, 0, 0, 0);
  
  // If it's past 1 AM, schedule for tomorrow
  if (now > oneAM) {
    oneAM.setDate(oneAM.getDate() + 1);
  }
  
  const timeUntilOneAM = oneAM.getTime() - now.getTime();
  
  setTimeout(() => {
    generateDailyHoroscopes();
    
    // Schedule again for the next day
    setInterval(generateDailyHoroscopes, 24 * 60 * 60 * 1000);
  }, timeUntilOneAM);
  
  console.log(`Scheduled first horoscope generation in ${Math.round(timeUntilOneAM / (60 * 60 * 1000))} hours`);
}

// Schedule the delivery of horoscopes
function scheduleHoroscopeDelivery(): void {
  const now = new Date();
  const sixAM = new Date(now);
  sixAM.setHours(6, 0, 0, 0);
  
  // If it's past 6 AM, schedule for tomorrow
  if (now > sixAM) {
    sixAM.setDate(sixAM.getDate() + 1);
  }
  
  const timeUntilSixAM = sixAM.getTime() - now.getTime();
  
  setTimeout(() => {
    deliverDailyHoroscopes();
    
    // Schedule again for the next day
    setInterval(deliverDailyHoroscopes, 24 * 60 * 60 * 1000);
  }, timeUntilSixAM);
  
  console.log(`Scheduled first horoscope delivery in ${Math.round(timeUntilSixAM / (60 * 60 * 1000))} hours`);
}

// Deliver horoscopes to all users
export async function deliverDailyHoroscopes(): Promise<void> {
  const today = format(new Date(), 'yyyy-MM-dd');
  console.log(`Starting daily horoscope delivery for ${today}`);
  
  try {
    // Get all users
    const users = await storage.getUsersForDailyDelivery();
    
    for (const user of users) {
      await deliverHoroscopeToUser(user, today);
    }
    
    console.log(`Completed daily horoscope delivery for ${users.length} users`);
  } catch (error) {
    console.error('Error delivering daily horoscopes:', error);
  }
}

// Deliver horoscope to a specific user
export async function deliverHoroscopeToUser(user: User, date: string): Promise<void> {
  try {
    // Get or generate horoscope for this user's sign
    const horoscopeContent = await getHoroscopeForSign(
      user.zodiacSign as any,
      date
    );
    
    // Get the horoscope ID for logging
    const horoscope = await storage.getHoroscopeBySignAndDate(
      user.zodiacSign || 'aries',
      date
    );
    
    if (!horoscope) {
      throw new Error(`Horoscope not found for ${user.zodiacSign} on ${date}`);
    }
    
    // Primary delivery via SMS (recommended method)
    if (user.smsOptIn && user.phone) {
      const smsResult = await sendHoroscopeSMS(user, horoscopeContent);
      
      // Log SMS delivery
      await storage.createDeliveryLog({
        userId: user.id,
        horoscopeId: horoscope.id,
        deliveryType: 'sms',
        status: smsResult ? 'success' : 'failed'
      });
      
      if (smsResult) {
        console.log(`SMS horoscope delivered to ${user.phone} (${user.zodiacSign})`);
      }
    }
    
    // Optional email delivery for CRM and newsletter users
    if (user.emailOptIn) {
      const emailResult = await sendHoroscopeEmail(user, horoscopeContent, date);
      
      // Log email delivery
      await storage.createDeliveryLog({
        userId: user.id,
        horoscopeId: horoscope.id,
        deliveryType: 'email', 
        status: emailResult ? 'success' : 'failed'
      });
    }
    
    console.log(`Delivered horoscope to ${user.email} (${user.zodiacSign})`);
  } catch (error) {
    console.error(`Error delivering horoscope to user ${user.id}:`, error);
  }
}
