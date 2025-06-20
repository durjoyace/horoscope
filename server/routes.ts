import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { zodiacSignSchema } from "../shared/schema";
import { getHoroscopeForSign, generateDailyHoroscopes } from "./horoscope-generator";
import { deliverHoroscopeToUser } from "./scheduler";
import { format } from "date-fns";
import { initializeScheduler } from "./scheduler";
import { 
  createStripeCustomer, 
  createCheckoutSession, 
  pricingPlans, 
  updateUserSubscriptionStatus,
  getSubscription,
  cancelSubscription,
  createPaymentIntent
} from "./stripe-service";
import {
  findPremiumReport,
  generateMockPremiumReport,
  generatePremiumReport
} from "./premium-reports";
import { setupAuth } from "./auth";
import { getAnalyticsDashboardData } from "./analytics-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Initialize the scheduler for daily horoscope generation and delivery
  initializeScheduler();

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
        zodiacSign: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        smsOptIn: z.boolean().default(false),
        birthdate: z.string().optional(),
        password: z.string().optional(),
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
      
      // Create new user
      const newUser = await storage.createUser({
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        phone: validatedInput.phone,
        smsOptIn: validatedInput.smsOptIn,
        birthdate: validatedInput.birthdate,
        password: validatedInput.password || null,
        newsletterOptIn: true,
      });
      
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

  // Test endpoint to deliver horoscope to a specific user
  app.post("/api/admin/deliver-horoscope", async (req: Request, res: Response) => {
    try {
      const { email, date } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }
      
      const targetDate = date || format(new Date(), 'yyyy-MM-dd');
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      // Start the delivery process (async)
      deliverHoroscopeToUser(user, targetDate).catch(err => {
        console.error(`Error delivering horoscope to ${email}:`, err);
      });
      
      res.status(202).json({ 
        success: true, 
        message: `Horoscope delivery to ${email} for ${targetDate} started in the background` 
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

      // Create or get Stripe customer
      const customerId = await createStripeCustomer(user);
      
      // Create checkout session
      const session = await createCheckoutSession(
        customerId,
        priceId,
        successUrl,
        cancelUrl
      );

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

      // Create or get Stripe customer
      const customerId = await createStripeCustomer(user);
      
      // Create payment intent (amount in cents)
      const paymentIntent = await createPaymentIntent(
        Math.round(parseFloat(amount.toString()) * 100),
        customerId
      );

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
      await cancelSubscription(user.stripeSubscriptionId);
      
      // Update user subscription status in our database
      await updateUserSubscriptionStatus(
        user.id,
        'canceled',
        'free',
        undefined
      );

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
      const zodiacSign = sign ? (sign as string).toLowerCase() : user.zodiacSign;
      
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
      let premiumReport = await findPremiumReport(zodiacSign, weekStartDate, weekEndDate);
      
      if (!premiumReport) {
        // In a real app, we would generate a new premium report here
        // For now, we'll create a mock report
        const reportContent = generateMockPremiumReport(zodiacSign, startOfWeek, endOfWeek);
        
        // Create a response object that matches the expected format
        premiumReport = {
          id: 0,
          zodiacSign,
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
          const result = await sendSMS(user.phone, message);
          if (result) sentCount++;
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

  const httpServer = createServer(app);
  return httpServer;
}
