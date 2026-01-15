import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { zodiacSignSchema } from "../shared/schema";
import { getHoroscopeForSign, generateDailyHoroscopes } from "./horoscope-generator";
import { deliverHoroscopeToUser } from "./scheduler";
import { format } from "date-fns";
import { initializeScheduler } from "./scheduler";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// Stripe service functions consolidated inline
const pricingPlans = {
  basic: {
    name: "Basic Plan",
    price: 9.99,
    stripePriceId: "price_basic",
    features: ["Daily horoscopes", "Basic wellness tips"]
  },
  premium: {
    name: "Premium Plan", 
    price: 19.99,
    stripePriceId: "price_premium",
    features: ["Daily horoscopes", "Premium wellness reports", "SMS delivery"]
  }
};
import {
  findPremiumReport,
  generateMockPremiumReport,
  generatePremiumReport
} from "./premium-reports";
import { setupAuth } from "./auth";
import { getAnalyticsDashboardData } from "./analytics-service";
import birthChartRoutes from "./routes/birth-chart.routes";
import aiCoachRoutes from "./routes/ai-coach.routes";
import trackingRoutes from "./routes/tracking.routes";
import socialRoutes from "./routes/social.routes";
import gamificationRoutes from "./routes/gamification.routes";
import healthRoutes from "./routes/health.routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Initialize the scheduler for daily horoscope generation and delivery
  initializeScheduler();

  // Health check routes (no rate limiting)
  app.use('/api/health', healthRoutes);
  app.use('/health', healthRoutes); // Also at root for load balancers

  // Register v2 API routes
  app.use('/api/v2/birth-charts', birthChartRoutes);
  app.use('/api/v2', birthChartRoutes); // Also mount at root for ephemeris/lunar endpoints
  app.use('/api/v2/ai', aiCoachRoutes); // AI coach routes
  app.use('/api/v2/tracking', trackingRoutes); // Mood and habit tracking routes
  app.use('/api/v2/social', socialRoutes); // Social features (friends, DMs)
  app.use('/api/v2/gamification', gamificationRoutes); // Gamification (XP, achievements, leaderboards)

  // User signup endpoint
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      console.log('Server - Signup request received:', {
        email: req.body.email,
        zodiacSign: req.body.zodiacSign,
        firstName: req.body.firstName,
      });
      
      const userInputSchema = z.object({
        email: z.string().email("Invalid email format"),
        zodiacSign: z.string().min(1, "Zodiac sign is required"),
        firstName: z.string().min(1, "Name is required"),
        lastName: z.string().optional(),
        phone: z.string().min(1, "Phone number is required"),
        smsOptIn: z.boolean().default(true),
        emailOptIn: z.boolean().default(false),
        birthdate: z.string().optional(),
        password: z.string().optional(),
        referralCode: z.string().optional(), // referral code used to sign up
      });

      const validatedInput = userInputSchema.parse(req.body);
      console.log('Server - Validated input:', {
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        smsOptIn: validatedInput.smsOptIn,
      });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedInput.email);
      if (existingUser) {
        console.log('Server - User already exists:', existingUser.email);
        return res.status(200).json({ 
          success: true, 
          message: "Welcome back! We'll continue sending your daily horoscopes.",
          user: {
            email: existingUser.email,
            zodiacSign: existingUser.zodiacSign
          }
        });
      }
      
      console.log('Server - Creating new user with zodiacSign:', validatedInput.zodiacSign);
      
      // Generate unique referral code for new user
      const userReferralCode = await storage.generateUniqueReferralCode();
      
      // Check if user was referred by someone
      let referrerUser = null;
      if (validatedInput.referralCode) {
        referrerUser = await storage.getReferralByCode(validatedInput.referralCode);
      }
      
      // Create new user
      const newUser = await storage.createUser({
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        phone: validatedInput.phone || "",
        smsOptIn: validatedInput.smsOptIn || false,
        birthdate: validatedInput.birthdate,
        password: validatedInput.password || null,
        emailOptIn: validatedInput.emailOptIn,
        referralCode: userReferralCode,
        referredBy: validatedInput.referralCode || null,
      });

      // Create referral record if user was referred
      if (referrerUser && validatedInput.referralCode) {
        await storage.createReferral({
          referrerId: referrerUser.id,
          referredUserId: newUser.id,
          referralCode: validatedInput.referralCode,
          status: 'completed',
          rewardType: 'free_month',
          rewardValue: 'Premium access for 1 month'
        });
        
        // Increment referrer's reward count
        await storage.incrementUserReferralRewards(referrerUser.id);
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully signed up for daily health horoscopes!",
        user: {
          email: newUser.email,
          zodiacSign: newUser.zodiacSign
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid input",
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "Could not process signup. Please try again later." 
      });
    }
  });

  // Get today's horoscope for a specific sign
  app.get("/api/horoscope/:sign", async (req: Request, res: Response) => {
    try {
      const sign = req.params.sign.toLowerCase();
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      
      // Validate zodiac sign
      if (!['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
             'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].includes(sign)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid zodiac sign" 
        });
      }
      
      const horoscopeContent = await getHoroscopeForSign(sign as any, date);
      
      res.status(200).json({
        success: true,
        sign,
        date,
        content: horoscopeContent
      });
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not retrieve horoscope. Please try again later." 
      });
    }
  });

  // Test endpoint to trigger horoscope generation for all signs
  app.post("/api/admin/generate-horoscopes", async (req: Request, res: Response) => {
    try {
      const date = req.body.date || format(new Date(), 'yyyy-MM-dd');
      
      // Start the generation process (async)
      generateDailyHoroscopes(date).catch(err => {
        console.error("Error in horoscope generation job:", err);
      });
      
      res.status(202).json({ 
        success: true, 
        message: `Horoscope generation for ${date} started in the background` 
      });
    } catch (error) {
      console.error("Error starting horoscope generation:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not start horoscope generation. Please try again later." 
      });
    }
  });

  // Endpoint to deliver horoscopes to all SMS opted-in users
  app.post("/api/admin/deliver-horoscope", async (req: Request, res: Response) => {
    try {
      const { date } = req.body;
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      console.log(`Starting horoscope delivery for date: ${targetDate}`);
      
      // Get all users who opted in for SMS delivery
      const users = await storage.getUsersForDailyDelivery();
      const smsUsers = users.filter(user => user.smsOptIn && user.phone);
      
      if (smsUsers.length === 0) {
        return res.status(200).json({ 
          success: true, 
          message: "No users found with SMS opt-in",
          deliveredCount: 0
        });
      }
      
      let deliveredCount = 0;
      let errorCount = 0;
      
      // Process deliveries
      for (const user of smsUsers) {
        try {
          await deliverHoroscopeToUser(user, targetDate);
          deliveredCount++;
          console.log(`Delivered horoscope to ${user.email} (${user.phone})`);
        } catch (error) {
          errorCount++;
          console.error(`Failed to deliver horoscope to ${user.email}:`, error);
        }
      }
      
      res.status(200).json({ 
        success: true, 
        message: `Horoscope delivery completed for ${targetDate}`,
        deliveredCount,
        errorCount,
        totalUsers: smsUsers.length
      });
    } catch (error) {
      console.error("Error starting horoscope delivery:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not start horoscope delivery. Please try again later." 
      });
    }
  });

  // Get subscription plans
  app.get("/api/subscription/plans", (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        plans: pricingPlans
      });
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve subscription plans. Please try again later."
      });
    }
  });

  // Get user subscription status
  app.get("/api/subscription/status", async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email as string);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.status(200).json({
        success: true,
        subscription: {
          status: user.subscriptionStatus,
          tier: user.subscriptionTier,
          endsAt: user.subscriptionEndDate
        }
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve subscription status. Please try again later."
      });
    }
  });

  // Create Stripe checkout session for subscription
  app.post("/api/subscription/create-checkout", async (req: Request, res: Response) => {
    try {
      const { email, priceId, successUrl, cancelUrl } = req.body;
      
      if (!email || !priceId || !successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: email, priceId, successUrl, or cancelUrl"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({
        success: false,
        message: "Could not create checkout session. Please try again later."
      });
    }
  });

  // Create payment intent for subscription
  app.post("/api/subscription/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { email, amount } = req.body;
      
      if (!email || !amount) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: email or amount"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount.toString()) * 100),
        currency: 'usd',
        customer: user.stripeCustomerId || undefined,
      });

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Could not create payment intent. Please try again later."
      });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({
          success: false,
          message: "No active subscription found"
        });
      }

      // Cancel the subscription in Stripe
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      
      // Update user subscription status in our database
      await storage.updateUser(user.id, {
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        subscriptionEndDate: null
      });

      res.status(200).json({
        success: true,
        message: "Subscription successfully canceled"
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({
        success: false,
        message: "Could not cancel subscription. Please try again later."
      });
    }
  });
  
  // Get premium weekly report
  app.get("/api/premium/weekly-report", async (req: Request, res: Response) => {
    try {
      const { email, sign } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email as string);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Check if user has premium access
      if (user.subscriptionTier !== 'premium' && user.subscriptionTier !== 'pro' || 
          user.subscriptionStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Premium subscription required to access weekly reports",
          subscriptionRequired: true
        });
      }

      // Determine which zodiac sign to use (user's sign or requested sign)
      const zodiacSign = sign ? (sign as string).toLowerCase() : (user.zodiacSign || 'aries');

      // Validate zodiac sign
      if (!['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
             'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].includes(zodiacSign)) {
        return res.status(400).json({
          success: false,
          message: "Invalid zodiac sign"
        });
      }

      // Calculate the current week's start and end dates
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as the first day
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const weekStartDate = format(startOfWeek, 'yyyy-MM-dd');
      const weekEndDate = format(endOfWeek, 'yyyy-MM-dd');

      // Find existing premium report or generate a new one
      let premiumReport = await findPremiumReport(zodiacSign as string, weekStartDate, weekEndDate);

      if (!premiumReport) {
        // In a real app, we would generate a new premium report here
        // For now, we'll create a mock report
        const reportContent = generateMockPremiumReport(zodiacSign as string, startOfWeek, endOfWeek);

        // Create a response object that matches the expected format
        premiumReport = {
          id: 0,
          zodiacSign: zodiacSign as string,
          weekStartDate,
          weekEndDate,
          content: reportContent,
          createdAt: new Date()
        };
      }

      res.status(200).json({
        success: true,
        premiumReport
      });
    } catch (error) {
      console.error("Error fetching premium weekly report:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve premium weekly report. Please try again later."
      });
    }
  });
  
  // Analytics Dashboard Endpoint
  // CRM endpoint to get all users for contact management
  app.get("/api/admin/crm/users", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      // In production, add admin role check here
      const users = await storage.getAllUsersForCRM();
      
      res.json(users);
    } catch (error) {
      console.error("CRM users fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch user data" 
      });
    }
  });

  // Test SMS functionality for specific user
  app.post("/api/admin/test-sms/:userId", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
      const { sendWelcomeSMS } = await import('./sms-service');
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      if (!user.phone || !user.smsOptIn) {
        return res.status(400).json({ 
          success: false, 
          message: "User has no phone number or SMS opt-in disabled" 
        });
      }

      const result = await sendWelcomeSMS(user);
      
      res.json({
        success: result,
        message: result ? "SMS sent successfully" : "Failed to send SMS",
        phone: user.phone
      });
    } catch (error: any) {
      console.error("SMS test error:", error);
      res.status(500).json({ 
        success: false, 
        message: "SMS service error", 
        error: error.message 
      });
    }
  });

  // Broadcast SMS to all opted-in users
  app.post("/api/admin/broadcast-sms", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
      const { sendSMS } = await import('./sms-service');
      const { message } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Message content is required" 
        });
      }

      const users = await storage.getUsersForSMSBroadcast();
      let sentCount = 0;

      for (const user of users) {
        try {
          if (user.phone) {
            const result = await sendSMS(user.phone, message);
            if (result) sentCount++;
          }
        } catch (error) {
          console.error(`Failed to send SMS to ${user.phone}:`, error);
        }
      }
      
      res.json({
        success: true,
        message: `Broadcast completed`,
        sentCount,
        totalUsers: users.length
      });
    } catch (error: any) {
      console.error("Broadcast SMS error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Broadcast failed", 
        error: error.message 
      });
    }
  });

  app.get("/api/admin/analytics", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const analyticsData = await getAnalyticsDashboardData();
      
      res.status(200).json({
        success: true,
        data: analyticsData
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve analytics data. Please try again later."
      });
    }
  });
  
  // Admin: Get all horoscopes
  app.get("/api/admin/horoscopes", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const horoscopes = await storage.getAllHoroscopes();
      
      res.status(200).json({
        success: true,
        data: horoscopes
      });
    } catch (error) {
      console.error("Error fetching horoscopes:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve horoscopes. Please try again later."
      });
    }
  });
  
  // Admin: Get all advertisements
  app.get("/api/admin/ads", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      /* Temporarily disabled for testing
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      */
      
      const ads = await storage.getAllAds();
      
      res.status(200).json({
        success: true,
        data: ads
      });
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve advertisements. Please try again later."
      });
    }
  });
  
  // Admin: Create new advertisement
  app.post("/api/admin/ads", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      /* Temporarily disabled for testing
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      */
      
      const adSchema = z.object({
        name: z.string().min(1, "Ad name is required"),
        content: z.string().min(10, "Ad content is required"),
        linkUrl: z.string().url("Must be a valid URL"),
        position: z.enum(["top", "middle", "bottom"]),
        isActive: z.boolean().default(true)
      });
      
      const validatedInput = adSchema.parse(req.body);
      const newAd = await storage.createAd(validatedInput);
      
      res.status(201).json({
        success: true,
        message: "Advertisement created successfully",
        data: newAd
      });
    } catch (error) {
      console.error("Error creating advertisement:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input",
          errors: error.errors
        });
      }
      res.status(500).json({
        success: false,
        message: "Could not create advertisement. Please try again later."
      });
    }
  });
  
  // Admin: Update advertisement
  app.put("/api/admin/ads/:id", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      /* Temporarily disabled for testing
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      */
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid advertisement ID"
        });
      }
      
      const adSchema = z.object({
        name: z.string().min(1, "Ad name is required"),
        content: z.string().min(10, "Ad content is required"),
        linkUrl: z.string().url("Must be a valid URL"),
        position: z.enum(["top", "middle", "bottom"]),
        isActive: z.boolean().default(true)
      });
      
      const validatedInput = adSchema.parse(req.body);
      const updatedAd = await storage.updateAd(id, validatedInput);
      
      if (!updatedAd) {
        return res.status(404).json({
          success: false,
          message: "Advertisement not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Advertisement updated successfully",
        data: updatedAd
      });
    } catch (error) {
      console.error("Error updating advertisement:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input",
          errors: error.errors
        });
      }
      res.status(500).json({
        success: false,
        message: "Could not update advertisement. Please try again later."
      });
    }
  });
  
  // Admin: Delete advertisement
  app.delete("/api/admin/ads/:id", async (req: Request, res: Response) => {
    try {
      // In a production app, we would check for admin permissions here
      /* Temporarily disabled for testing
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      */
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid advertisement ID"
        });
      }
      
      const success = await storage.deleteAd(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Advertisement not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Advertisement deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      res.status(500).json({
        success: false,
        message: "Could not delete advertisement. Please try again later."
      });
    }
  });

  // Community Features Routes
  
  // Get forum topics by zodiac sign
  app.get("/api/community/topics/:zodiacSign", async (req: Request, res: Response) => {
    try {
      const zodiacSign = req.params.zodiacSign;
      
      // Validate the zodiac sign
      if (!zodiacSignSchema.safeParse(zodiacSign).success) {
        return res.status(400).json({
          success: false,
          message: "Invalid zodiac sign"
        });
      }
      
      // Get pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const offset = (page - 1) * pageSize;
      
      const topics = await storage.getForumTopicsByZodiacSign(zodiacSign, pageSize, offset);
      
      res.status(200).json({
        success: true,
        data: topics,
        pagination: {
          page,
          pageSize,
          hasMore: topics.length === pageSize // Simple way to check if there might be more
        }
      });
    } catch (error) {
      console.error("Error fetching forum topics:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve forum topics. Please try again later."
      });
    }
  });
  
  // Get a specific forum topic by ID
  app.get("/api/community/topics/detail/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      const topic = await storage.getForumTopic(id);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found"
        });
      }
      
      // Increment view count
      await storage.incrementTopicViewCount(id);
      
      res.status(200).json({
        success: true,
        data: topic
      });
    } catch (error) {
      console.error("Error fetching forum topic:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve forum topic. Please try again later."
      });
    }
  });
  
  // Create a new forum topic
  app.post("/api/community/topics", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const { title, content, zodiacSign, category } = req.body;
      
      if (!title || !content || !zodiacSign) {
        return res.status(400).json({
          success: false,
          message: "Title, content, and zodiacSign are required"
        });
      }
      
      // Validate zodiac sign
      if (!zodiacSignSchema.safeParse(zodiacSign).success) {
        return res.status(400).json({
          success: false,
          message: "Invalid zodiac sign"
        });
      }
      
      const topic = await storage.createForumTopic({
        title,
        content,
        userId: req.user.id,
        zodiacSign,
        category: category || 'general',
        isPinned: false,
      });
      
      res.status(201).json({
        success: true,
        data: topic
      });
    } catch (error) {
      console.error("Error creating forum topic:", error);
      res.status(500).json({
        success: false,
        message: "Could not create forum topic. Please try again later."
      });
    }
  });
  
  // Update a forum topic
  app.put("/api/community/topics/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      const topic = await storage.getForumTopic(id);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found"
        });
      }
      
      // Check if the user is the owner of the topic
      if (topic.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to update this topic"
        });
      }
      
      const { title, content, category } = req.body;
      
      if (!title && !content && !category) {
        return res.status(400).json({
          success: false,
          message: "At least one field (title, content, or category) is required"
        });
      }
      
      const updatedTopic = await storage.updateForumTopic(id, {
        title,
        content,
        category
      });
      
      res.status(200).json({
        success: true,
        data: updatedTopic
      });
    } catch (error) {
      console.error("Error updating forum topic:", error);
      res.status(500).json({
        success: false,
        message: "Could not update forum topic. Please try again later."
      });
    }
  });
  
  // Delete a forum topic
  app.delete("/api/community/topics/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      const topic = await storage.getForumTopic(id);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found"
        });
      }
      
      // Check if the user is the owner of the topic
      if (topic.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to delete this topic"
        });
      }
      
      const success = await storage.deleteForumTopic(id);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          message: "Could not delete the topic"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Topic deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting forum topic:", error);
      res.status(500).json({
        success: false,
        message: "Could not delete forum topic. Please try again later."
      });
    }
  });
  
  // Like a forum topic
  app.post("/api/community/topics/:id/like", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      const topic = await storage.getForumTopic(id);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found"
        });
      }
      
      await storage.incrementTopicLikeCount(id);
      
      res.status(200).json({
        success: true,
        message: "Topic liked successfully"
      });
    } catch (error) {
      console.error("Error liking forum topic:", error);
      res.status(500).json({
        success: false,
        message: "Could not like forum topic. Please try again later."
      });
    }
  });
  
  // Get replies for a specific topic
  app.get("/api/community/topics/:id/replies", async (req: Request, res: Response) => {
    try {
      const topicId = parseInt(req.params.id);
      if (isNaN(topicId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      // Get pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;
      
      const replies = await storage.getForumRepliesByTopicId(topicId, pageSize, offset);
      
      res.status(200).json({
        success: true,
        data: replies,
        pagination: {
          page,
          pageSize,
          hasMore: replies.length === pageSize
        }
      });
    } catch (error) {
      console.error("Error fetching forum replies:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve forum replies. Please try again later."
      });
    }
  });
  
  // Add a reply to a topic
  app.post("/api/community/topics/:id/replies", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const topicId = parseInt(req.params.id);
      if (isNaN(topicId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic ID"
        });
      }
      
      const topic = await storage.getForumTopic(topicId);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Topic not found"
        });
      }
      
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required"
        });
      }
      
      const reply = await storage.createForumReply({
        topicId,
        userId: req.user.id,
        content
      });
      
      res.status(201).json({
        success: true,
        data: reply
      });
    } catch (error) {
      console.error("Error creating forum reply:", error);
      res.status(500).json({
        success: false,
        message: "Could not create forum reply. Please try again later."
      });
    }
  });
  
  // Update a reply
  app.put("/api/community/replies/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reply ID"
        });
      }
      
      const reply = await storage.getForumReply(id);
      
      if (!reply) {
        return res.status(404).json({
          success: false,
          message: "Reply not found"
        });
      }
      
      // Check if the user is the owner of the reply
      if (reply.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to update this reply"
        });
      }
      
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required"
        });
      }
      
      const updatedReply = await storage.updateForumReply(id, { content });
      
      res.status(200).json({
        success: true,
        data: updatedReply
      });
    } catch (error) {
      console.error("Error updating forum reply:", error);
      res.status(500).json({
        success: false,
        message: "Could not update forum reply. Please try again later."
      });
    }
  });
  
  // Delete a reply
  app.delete("/api/community/replies/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reply ID"
        });
      }
      
      const reply = await storage.getForumReply(id);
      
      if (!reply) {
        return res.status(404).json({
          success: false,
          message: "Reply not found"
        });
      }
      
      // Check if the user is the owner of the reply
      if (reply.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to delete this reply"
        });
      }
      
      const success = await storage.deleteForumReply(id);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          message: "Could not delete the reply"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Reply deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting forum reply:", error);
      res.status(500).json({
        success: false,
        message: "Could not delete forum reply. Please try again later."
      });
    }
  });
  
  // Like a reply
  app.post("/api/community/replies/:id/like", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reply ID"
        });
      }
      
      const reply = await storage.getForumReply(id);
      
      if (!reply) {
        return res.status(404).json({
          success: false,
          message: "Reply not found"
        });
      }
      
      await storage.incrementReplyLikeCount(id);
      
      res.status(200).json({
        success: true,
        message: "Reply liked successfully"
      });
    } catch (error) {
      console.error("Error liking forum reply:", error);
      res.status(500).json({
        success: false,
        message: "Could not like forum reply. Please try again later."
      });
    }
  });

  // Get user's referral information
  app.get("/api/referrals/my-referrals", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const user = req.user;
      const referrals = await storage.getReferralsByReferrer(user.id);

      res.status(200).json({
        success: true,
        data: {
          referralCode: user.referralCode,
          totalReferrals: user.referralRewards || 0,
          referrals: referrals
        }
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve referral information"
      });
    }
  });

  // Validate a referral code
  app.get("/api/referrals/validate/:code", async (req: Request, res: Response) => {
    try {
      const referralCode = req.params.code;
      const referrer = await storage.getReferralByCode(referralCode);

      if (!referrer) {
        return res.status(404).json({
          success: false,
          message: "Invalid referral code"
        });
      }

      res.status(200).json({
        success: true,
        data: {
          referrerName: referrer.firstName,
          valid: true
        }
      });
    } catch (error) {
      console.error("Error validating referral code:", error);
      res.status(500).json({
        success: false,
        message: "Could not validate referral code"
      });
    }
  });

  // Generate shareable referral link
  app.post("/api/referrals/share", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const user = req.user;
      const { platform } = req.body; // 'sms', 'email', 'social', 'copy'

      const baseUrl = process.env.REPLIT_DOMAIN 
        ? `https://${process.env.REPLIT_DOMAIN}` 
        : 'http://localhost:5000';
      
      const referralUrl = `${baseUrl}/?ref=${user.referralCode}`;
      
      let shareText = '';
      switch (platform) {
        case 'sms':
          shareText = `Found something that actually works! This app knows my body better than I do - gives me daily health tips based on my zodiac that hit different. Check it out: ${referralUrl}`;
          break;
        case 'email':
          shareText = `You know how I'm always trying new wellness stuff? This one's different. HoroscopeHealth gives me personalized health insights based on my zodiac sign and honestly, it's scary accurate. The timing recommendations actually work. You'll unlock premium features with my link: ${referralUrl}`;
          break;
        case 'social':
          shareText = `OK this is weird but... an app that uses my zodiac sign for health advice is actually changing my life? The timing is everything - it told me exactly when to work out for max results. Who knew astrology could be this practical? Premium unlocks: ${referralUrl}`;
          break;
        default:
          shareText = `This wellness app knows things about my body I didn't even know. Try it: ${referralUrl}`;
      }

      res.status(200).json({
        success: true,
        data: {
          referralUrl,
          shareText,
          referralCode: user.referralCode
        }
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      res.status(500).json({
        success: false,
        message: "Could not generate share link"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
