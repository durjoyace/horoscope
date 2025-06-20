// Consolidated service exports for cleaner imports
export { sendEmail, createHoroscopeEmailContent, sendHoroscopeEmail } from '../email-service';
export { sendSMS, createHoroscopeSMSContent, sendHoroscopeSMS, sendWelcomeSMS } from '../sms-service';
export { generateHealthHoroscope } from '../openai';
export { generateDailyHoroscopes, getHoroscopeForSign } from '../horoscope-generator';
export { deliverDailyHoroscopes, deliverHoroscopeToUser } from '../scheduler';
export { getAnalyticsDashboardData } from '../analytics-service';
export { 
  findPremiumReport, 
  storePremiumReport, 
  generatePremiumReport 
} from '../premium-reports';