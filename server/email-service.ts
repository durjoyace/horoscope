import { User } from "@shared/schema";
import { HoroscopeContent } from "@shared/types";
import { storage } from "./storage";

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

// This is a mock email service for demonstration
// In a real application, you would use a service like Nodemailer, SendGrid, etc.
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log(`Sending email to ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content: ${options.html.substring(0, 100)}...`);
    
    // In a real implementation, you'd connect to an SMTP server or email API
    // For now, we'll simulate success
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Create HTML email content from horoscope data
export function createHoroscopeEmailContent(
  user: User,
  horoscope: HoroscopeContent,
  date: string
): string {
  const firstName = user.firstName || 'there';
  const sign = user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1);
  
  // Format wellness categories as badges
  const categories = horoscope.wellnessCategories
    .map(cat => `<span style="display:inline-block;background-color:#f3f4f6;color:#4b3f72;border-radius:9999px;font-size:12px;font-weight:600;padding:4px 8px;margin-right:4px;">${cat}</span>`)
    .join(' ');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #4b3f72; }
        .sign-icon { font-size: 32px; margin: 10px 0; }
        .horoscope { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
        .section { margin-bottom: 15px; }
        .section-title { font-weight: bold; color: #4b3f72; margin-bottom: 5px; }
        .categories { margin: 15px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HoroscopeHealth</div>
          <p>Your Daily Health Horoscope - ${date}</p>
        </div>
        
        <div class="horoscope">
          <h2>Hello ${firstName}!</h2>
          <div class="sign-icon">✨ ${sign} ✨</div>
          
          <div class="section">
            <p>${horoscope.overview}</p>
          </div>
          
          <div class="categories">
            ${categories}
          </div>
          
          <div class="section">
            <div class="section-title">Today's Health Tip</div>
            <p>${horoscope.healthTip}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Nutrition Focus</div>
            <p>${horoscope.nutritionFocus}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Element Alignment</div>
            <p>${horoscope.elementAlignment}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>
            Powered by HoroscopeHealth.com<br>
            The first daily health horoscope built to improve your real life.
          </p>
          <p>
            <a href="https://horoscopehealth.com/unsubscribe?email=${user.email}">Unsubscribe</a> | 
            <a href="https://horoscopehealth.com/preferences?email=${user.email}">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send daily horoscope email to a user
export async function sendHoroscopeEmail(
  user: User,
  horoscopeContent: HoroscopeContent,
  date: string
): Promise<boolean> {
  try {
    const emailHtml = createHoroscopeEmailContent(user, horoscopeContent, date);
    const sign = user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1);
    
    const result = await sendEmail({
      to: user.email,
      subject: `Your ${sign} Health Horoscope for ${date}`,
      html: emailHtml
    });
    
    return result;
  } catch (error) {
    console.error("Error sending horoscope email:", error);
    return false;
  }
}
